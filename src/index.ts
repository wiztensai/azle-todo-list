import { Canister, Err, Ok, Record, Result, StableBTreeMap, Variant, Vec, query, text, update, ic, nat64 } from 'azle';
import { v4 as uuidv4 } from 'uuid';

/**
 * Type
 */
const Task = Record({
  id: text,
  title: text,
  body: text,
  createdAt: nat64,
  taskStatus: text,
})
const TaskStatus = Record({
  none: text,
  progress: text,
  done: text,
})

type Task = typeof Task.tsType;
type TaskStatus = typeof TaskStatus.tsType;

const Errors = Variant({
  InvalidInput: text
})

/**
 * Application State
 */
let listTodo = StableBTreeMap<text, Task>(0);
let taskStatus: TaskStatus = {
  none: 'none',
  done: 'done',
  progress:'progress'
};

/**
 * High-Level API
 */
export default Canister({
  add: update([text,text], Result(Task, Errors), (title, body)=> {
    // validation
    if (title.length===0) {
      return Err({InvalidInput: "Title is mandatory"});
    }

    const data: Task = { id: uuidv4(), title:title,body:body,createdAt: ic.time(), taskStatus: taskStatus.none};
    listTodo.insert(data.id, data);
    return Result.Ok(data);
  }),
  get: query([], Result(Vec(Task), Errors), ()=> {
    return Ok(listTodo.values())
  }),
  update: update([text, text, text], Result(Task, Errors), (taskId, title, body) => {
    // validation
    if (title.length===0||taskId.length===0) {
      return Err({InvalidInput: "Title and task id is mandatory"});
    }
    
    const listOpt = listTodo.get(taskId);
    const data = listOpt.Some
    if (data) {
      data!.title = title
      data.body = body
      listTodo.insert(data.id, data)
      return Ok(data)      
    } else {
      return Err({InvalidInput: `Couldn't update a task with id=${taskId}. Task not found`})
    }
  }),
  delete: update([text], Result(Task, Errors), (taskId) => {
    // validation
    if (taskId.length===0) {
      return Err({InvalidInput: "Task id is mandatory"});
    }

    const listOpt = listTodo.get(taskId);
    const data = listOpt.Some    
    if(data){
      const res = listTodo.remove(taskId)
      return Ok(res.Some!)
    } else {
      return Err({InvalidInput: `Couldn't delete a task with id=${taskId}. Task not found.`})
    }    
  }),
  getTaskStatus: query([], Result(TaskStatus, Errors), ()=> {
    return Ok(taskStatus)
  }),
  setTaskStatus: update([text, text], Result(Task, Errors), (taskId, status) => {
    // validation
    if (taskId.length===0) {
      return Err({InvalidInput: "Task id is mandatory"});
    }

    const statusValidation = taskStatusValidation(status)
    if (!statusValidation) {
      return Err({InvalidInput: `Couldn't set task status with id=${taskId}. Status is not valid.`})
    }

    const listOpt = listTodo.get(taskId);
    const data = listOpt.Some
    if (data) {
      data!.taskStatus = status
      listTodo.insert(data.id, data)
      return Ok(data)      
    } else {
      return Err({InvalidInput: `Couldn't update a task status with id=${taskId}. Task not found`})
    }
  }),
})

function taskStatusValidation(params:text) {
  const values = Object.values(taskStatus);
  let status = []
  for (const value of values) {
    status.push(value)
  }

  if (!status.includes(params)) {
    return false
  }
  return true;
}

// a workaround to make uuid package work with Azle
globalThis.crypto = {
  // @ts-ignore
 getRandomValues: () => {
     let array = new Uint8Array(32)

     for (let i = 0; i < array.length; i++) {
         array[i] = Math.floor(Math.random() * 256)
     }

     return array
 }
}
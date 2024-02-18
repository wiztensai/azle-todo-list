 # Azle Todo List

A simple to-do list with task status. Built using the Azle package for ICP

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/wiztensai/azle-todo-list.git
   ```

2. **Prerequisites:**

   - Node.js version > 16
   - DFX command line tools (version 0.16.1):

     ```bash
     DFX_VERSION=0.16.1 sh -ci "$(curl -fsSL https://sdk.dfinity.org/install.sh)"
     ```

   - Build dependencies:

     **Ubuntu:**

     ```bash
     sudo apt install clang
     sudo apt install build-essential
     sudo apt install libssl-dev
     sudo apt install pkg-config
     ```

     **macOS:**

     ```bash
     xcode-select --install
     brew install llvm
     ```

3. **Install dependencies and deploy:**

   ```bash
   cd azle-todo-list
   npm install
   dfx deploy
   ```

## API Usage Examples

### Adding a new todo:

1. `add(title: text, body: text)`
2. `get()`
3. `update(taskId: text, title: text, body: text)`

### Setting task status:

1. `get()`
2. `getTaskStatus()`
3. `setTaskStatus(taskId: text, status: text)`

## Dependencies

- "azle": "^0.20.1"
- "uuid": "^9.0.1"

## Additional Information
- Azle github: https://github.com/demergent-labs/azle
- Azle package documentation: https://demergent-labs.github.io/azle/the_azle_book.html
- Dfinity SDK documentation: https://internetcomputer.org/docs/current/developer-docs/backend/typescript/
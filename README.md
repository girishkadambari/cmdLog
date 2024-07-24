# cmdLog

cmdLog is a Visual Studio Code extension that helps developers insert log messages effortlessly. This extension is particularly useful for debugging and monitoring code execution without manually adding log statements.

## Features

- **Insert Log**: Automatically insert log messages at the selected code position.

## Configuration

You can configure the following settings in your `settings.json` file:

- `cmdLog.logMessagePrefix`: The prefix of the log message (default: `GirishLoggerTool ~ `).
- `cmdLog.logMessageSuffix`: The suffix of the log message (default: `""`).
- `cmdLog.logFunction`: The log function to use (default: `console.log`).
- `cmdLog.addSemicolonInTheEnd`: Whether to put a semicolon at the end of the log message (default: `true`).

## Usage

### Insert Log

1. Select the text you want to log.
2. Run the command `cmdLog.addLog` using the keybindings:
   - **macOS**: `Cmd+Alt+L`
   - **Windows/Linux**: `Ctrl+Alt+L`
3. The log message will be inserted at the appropriate position based on the selected text.

## Example

### Original Code

```typescript
function add(a, b) {
  let result = a + b;
  if (result > 10) {
    return result;
  }
  return 0;
}
```

### After Inserting Log

```typescript
function add(a, b) {
  let result = a + b;
  console.log("GirishLoggerTool ~ filename.ts ~ Line: 3 ~ result:", result);
  if (result > 10) {
    return result;
  }
  return 0;
}
````

## Upcoming Features

- **Comment Out Logs**: Comment out all the logs added by the extension.
- **Delete Logs**: Delete all the logs added by the extension.

## AI Version (Beta)

There is an AI-powered version of this extension that automatically generates insightful and efficient debug logs. This version is currently in beta.

## Installation
1. Install the `.vsix` file in VS Code.

## Contact
If you have any questions or suggestions, please feel free to contact us at girish99126@gmail.com.


import * as vscode from "vscode";

// Activate function to register the command and set up the extension
export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "cmdLog" is now active!');

  // Register the command that triggers the log insertion
  const disposable = vscode.commands.registerCommand("cmdLog.addLog", () => {
    const editor = vscode.window.activeTextEditor;
    if (editor) {
      const selection = editor.selection;
      const selectedText = editor.document.getText(selection);
      const config = vscode.workspace.getConfiguration("cmdLog");

      // Get configuration settings for the log message
      const prefix = config.get("logMessagePrefix", "GirishLoggerTool ~ ");
      const suffix = config.get("logMessageSuffix", "");
      const logFunction = config.get("logFunction", "console.log");
      const addSemicolonInTheEnd = config.get("addSemicolonInTheEnd", true);

      const document = editor.document;
      const fileName = document.fileName.split("/").pop();
      const lineNumber = selection.start.line + 1;

      // Construct the log message
      const logMessage = `${logFunction}("${prefix}${fileName} ~ Line: ${lineNumber} ~ ${selectedText}:", ${selectedText})${
        addSemicolonInTheEnd ? ";" : ""
      }`;

      // Edit the document to insert the log message
      editor
        .edit((editBuilder) => {
          const position = new vscode.Position(
            selection.end.line,
            selection.end.character
          );
          const lineText = document.lineAt(selection.start.line).text.trim();

          if (isArrowFunction(lineText)) {
            // Handle single-line arrow functions
            handleArrowFunction(lineText, selection, logMessage, editBuilder);
          } else {
            // Regular insertion for non-arrow functions
            insertLogForNonArrowFunction(
              document,
              selection,
              logMessage,
              editBuilder
            );
          }
        })
        .then((success) => {
          if (success) {
            vscode.window.showInformationMessage("Log inserted successfully");
          } else {
            vscode.window.showErrorMessage("Failed to insert log");
          }
        });
    }
  });

  context.subscriptions.push(disposable);
}

export function deactivate() {}

// Function to check if the line contains a single-expression arrow function
function isArrowFunction(line: string): boolean {
  return line.includes("=>") && !line.includes("{");
}

// Function to handle insertion for single-expression arrow functions
function handleArrowFunction(
  lineText: string,
  selection: vscode.Selection,
  logMessage: string,
  editBuilder: vscode.TextEditorEdit
) {
  const [params, body] = lineText.split("=>").map((part) => part.trim());
  const convertedCode = `${params} => {\n  ${logMessage}\n  return ${body};\n}`;

  editBuilder.replace(
    new vscode.Range(
      new vscode.Position(selection.start.line, 0),
      new vscode.Position(selection.start.line, lineText.length)
    ),
    convertedCode
  );
}

// Function to insert log for non-arrow functions
function insertLogForNonArrowFunction(
  document: vscode.TextDocument,
  selection: vscode.Selection,
  logMessage: string,
  editBuilder: vscode.TextEditorEdit
) {
  const lineText = document.lineAt(selection.start.line).text.trim();

  if (lineText.includes("return ")) {
    // If the line has a return statement, find the nearest closing bracket and insert log after it
    const closingBracketLine = findNearestClosingBracketLine(
      document,
      selection.end.line
    );
    if (closingBracketLine !== -1) {
      editBuilder.insert(
        new vscode.Position(closingBracketLine + 1, 0),
        `${logMessage}\n`
      );
    } else {
      editBuilder.insert(
        new vscode.Position(selection.end.line + 1, 0),
        `${logMessage}\n`
      );
    }
  } else {
    // Insert log in the next line
    editBuilder.insert(
      new vscode.Position(selection.end.line + 1, 0),
      `${logMessage}\n`
    );
  }
}

// Function to find the nearest line number of the closing bracket
function findNearestClosingBracketLine(
  document: vscode.TextDocument,
  startLine: number
): number {
  const lines = document.getText().split("\n");

  for (let i = startLine; i < lines.length; i++) {
    if (lines[i].trim() === "}") {
      return i;
    }
  }
  return -1; // No closing bracket found
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode_1 = require("vscode");
function activate(context) {
    const command = 'extension.formatJSON';
    const commandHandler = () => {
        const languageId = 'json';
        const activeEditor = vscode_1.window.activeTextEditor;
        if (!activeEditor) {
            return;
        }
        vscode_1.languages.setTextDocumentLanguage(activeEditor.document, languageId);
        vscode_1.commands.executeCommand('editor.action.formatDocument');
    };
    context.subscriptions.push(vscode_1.commands.registerCommand(command, commandHandler));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map
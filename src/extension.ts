// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import { REScriptListNodeProvider, REScriptNode } from './ScriptListNodeProvider';
import { REAPI } from './api';

// Usage example
const client = new REAPI('ws://localhost:8765');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {


	
	// Wait for the connection to be established
	setInterval(() => {
		// Send a script action
		client.sendScriptAction('/scripts/script1', 'run');

		// Get the current script list
		console.log('Current scripts:', client.getScripts());
	}, 1000);

	
	const reScriptListNodeProvider = new REScriptListNodeProvider(client);
	vscode.window.registerTreeDataProvider('REScriptListView', reScriptListNodeProvider);
	//context.subscriptions.push(reScriptListNodeProvider);
	//vscode.commands.registerCommand('REScriptListNodeProvider.refresh', () => reScriptListNodeProvider.refresh());
	//reScriptListNodeProvider.refresh();

	//var reScriptView = vscode.window.createTreeView('REScriptListView', { treeDataProvider:reScriptListNodeProvider });
	//context.subscriptions.push(reScriptView);

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension RazorEnhaced for VSCode is now active!');

	vscode.window.showInformationMessage('RE Activate!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('re-vscode.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from RE VSCode!');
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}

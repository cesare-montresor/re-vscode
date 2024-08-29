import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import { Script, REAPI } from './api';

export class REScriptListNodeProvider implements vscode.TreeDataProvider<REScriptNode> {

    constructor(
        public api:REAPI,
    ){
        vscode.window.showInformationMessage('REScriptListNodeProvider:constructor');
        api.OnScriptListUpdate.event((scriptList)=>
            this.refresh()
        );
        this.refresh();
    }
    
    private _onDidChangeTreeData: vscode.EventEmitter<REScriptNode | REScriptNode[] | undefined | void> = new vscode.EventEmitter<REScriptNode | REScriptNode[] | undefined | void>();
	readonly onDidChangeTreeData: vscode.Event<REScriptNode | REScriptNode[] | undefined | void> = this._onDidChangeTreeData.event;

    refresh(): void {
		this._onDidChangeTreeData.fire();
	}


    getTreeItem(element: REScriptNode): vscode.TreeItem | Thenable<vscode.TreeItem> {
        //vscode.window.showInformationMessage('REScriptListNodeProvider:getTreeItem');
        console.log('REScriptListNodeProvider:getTreeItem',element);
        return Promise.resolve(element);
        throw new Error('Method not implemented.');
    }
    getChildren(element?: REScriptNode | undefined): vscode.ProviderResult<REScriptNode[]> {
        console.log(element);
        //vscode.window.showInformationMessage('REScriptListNodeProvider:getChildren');
        var scriptList = this.api.getScripts();
        //vscode.window.showInformationMessage('REScriptListNodeProvider:scriptList',scriptList.toString());
        var scriptNodeList = new Array<REScriptNode>();
        scriptList.forEach((script:Script)=>{
            scriptNodeList.push(REScriptFile.FromScript(script));
        });
        
        return Promise.resolve(scriptNodeList);
        throw new Error('Method not implemented.');
    }
    getParent?(element: REScriptNode): vscode.ProviderResult<REScriptNode> {
        //vscode.window.showInformationMessage('REScriptListNodeProvider:getParent');
        console.log('REScriptListNodeProvider:getParent',element);
        return Promise.resolve(element);
        throw new Error('Method not implemented.');
    }
    resolveTreeItem?(item: vscode.TreeItem, element: REScriptNode, token: vscode.CancellationToken): vscode.ProviderResult<vscode.TreeItem> {
        //vscode.window.showInformationMessage('REScriptListNodeProvider:resolveTreeItem');
        console.log('REScriptListNodeProvider:resolveTreeItem', item, element, token);
        return Promise.resolve(element);
        throw new Error('Method not implemented.');
    }
}

export class REScriptNode extends vscode.TreeItem {

    constructor(
        public readonly fullpath: string,
		public readonly label: string,
		public readonly collapsibleState=vscode.TreeItemCollapsibleState.Expanded,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
        this.description = label;
        this.tooltip = `${this.fullpath}`;
    }
}

export class REScriptFolder extends REScriptNode {
    public readonly is_file = false;
    public readonly is_folder = true;

	constructor(
        public readonly fullpath: string,
		public readonly label: string,
		public readonly collapsibleState=vscode.TreeItemCollapsibleState.Expanded,
		public readonly command?: vscode.Command
	) {
		super(fullpath, label, collapsibleState, command);
        
	}

	contextValue = 'rescriptlist';
}

export class REScriptFile extends REScriptNode {
    public readonly is_file = true;
    public readonly is_folder = false;

    public static FromScript(script:Script){
        let scriptNode = new REScriptFile(
            script.Path,
            path.basename(script.Path),
        );
        return scriptNode;
    }

	constructor(
		public readonly fullpath: string,
		public readonly label: string,
		public readonly command?: vscode.Command
	) {
		super(fullpath, label, vscode.TreeItemCollapsibleState.None, command);

	}

	contextValue = 'rescriptlist';
}
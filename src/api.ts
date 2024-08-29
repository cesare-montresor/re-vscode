import WebSocket from 'isomorphic-ws';
import { EventEmitter } from 'vscode';



export class REAPI {
    private ws: WebSocket;
    private scripts: Script[] = [];
    public static defaultUrl = 'ws://localhost:8765/';

    public readonly OnScriptListUpdate = new EventEmitter<ArrayScript>();

    public static getAPI(url?:string){
        return new REAPI(!url?REAPI.defaultUrl:url);
    }

    constructor(url: string) {
        this.ws = new WebSocket(url);
        this.setupEventListeners();
    }

    private setupEventListeners() {
        let localThis = this;
        this.ws.onopen = () => {
            console.log('REAPI:setupEventListeners:onOpn:Connected to WebSocket server');
        };

        this.ws.onmessage = (event: WebSocket.MessageEvent) => {
            const data = JSON.parse(event.data.toString());
            
            let msg = data as Message;
            switch(msg.messageType){
                case "ScriptList": 
                    localThis.didReciveScriptList(msg);
                default:
                    console.log("REAPI:setupEventListeners:onMessage:unkown message",msg.messageType);
            }
        };

        this.ws.onerror = (error: WebSocket.ErrorEvent) => {
            console.error('REAPI:setupEventListeners:onError:WebSocket error:', error);
        };

        this.ws.onclose = () => {
            console.log('REAPI:setupEventListeners:onClose:','Disconnected from WebSocket server');
        };
    }

    private updateScriptList(newScripts: Script[]) {
        this.scripts = newScripts;
        console.log('Updated script list:', this.scripts);
    }

    private didReciveScriptList(msg: Message){
        let actionMsg = msg as ScriptList;
        let scriptList = actionMsg.scriptList;
        this.OnScriptListUpdate.fire(scriptList);
        console.log("REAPI:didReciveScriptList: Scripts",scriptList.length);
        this.scripts = scriptList;
    }

    public sendScriptAction(path: string, action: 'run' | 'stop' | 'pause' | 'resume') {
        let msgAction = new ScriptAction(path, action);
        const message = JSON.stringify(msgAction);
        this.ws.send(message);
    }

    public getScripts(): Script[] {
        return this.scripts;
    }
}

//Data


export class Script
{
    constructor(
        public Path: string,
        public Filename: string,
        public Content: string,
        public Status: string,
        public Language: string,
        public Temporary: boolean
    ){}
    
}

// Message

export type MessageType = 'ScriptList'|'ScriptAction'|string;
export type ArrayScript = Array<Script>;

export class Message{
    public readonly messageType =  this.constructor.name;
    

}

export class ScriptList extends Message
{
    public readonly messageType =  this.constructor.name;
    
    constructor(
        public scriptList = new Array<Script>(),
    ){
        super();
    }
}

export class ScriptAction extends Message
{
    public readonly messageType =  this.constructor.name;

    constructor(
        public Path: string,
        public Action: string,
    ){
        super();
    }
    
}


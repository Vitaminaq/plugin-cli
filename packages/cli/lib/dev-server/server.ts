import { WebSocketServer, type WebSocket } from 'ws';
import { hooks } from "../config";

export class DevServer {
    private static _instance: DevServer;
    public static get instance() {
        if (!DevServer._instance) {
            DevServer._instance = new DevServer();
        }
        return DevServer._instance;
    }

    public pool: WebSocket[] = []; // socket池
    public messages = new Map(); // 构建产物池
    public updates = []; // 更新队列

    public constructor() {
        const wss = new WebSocketServer({ port: 3000 });

        wss.on('connection', (socket) => {
            this.pool.push(socket);
            this.messages.forEach((content, name) => {
                socket.send(JSON.stringify({ name, content }));
            });
            socket.on('message', (raw) => {
                console.log("========= message =======", raw);
            });
        
            socket.on('error', (err) => {
                console.log("========== error ============", err);
            });
        
            socket.send(JSON.stringify({ type: 'connected' }));
        });
        
        wss.on('error', (e: Error & { code: string }) => {
            console.log("========= wss error ==========", e);
        });

        this.subUpdate();
    }

    private subUpdate() {
        return hooks.hook('update', (name, content) => {
            const msg = this.messages.get(name);
            if (msg && msg === content) return;
            this.messages.set(name, content);
            this.pool.forEach(socket => socket.send(JSON.stringify({
                name,
                content
            })));
        })
    }
}

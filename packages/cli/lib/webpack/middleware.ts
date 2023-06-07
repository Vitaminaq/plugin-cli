import type { Express } from "express";
import expressWs from "express-ws";
import { hooks } from "../config";

const pool: any[] = []; // socket池
const messages = new Map(); // 构建产物池

const remove = (ws: any) => {
    const idx = pool.indexOf(ws);
    if (idx === -1) return;
    pool.splice(idx, 1);
}

const subUpdate = () => {
    return hooks.hook('update', (name, content) => {
        const msg = messages.get(name);

        if (msg && msg === content) return;
        messages.set(name, content);
        pool.forEach(socket => socket.send(JSON.stringify({
            name,
            content
        })));
    })
}

export const pluginScoket = (app: Express) => {
    const eWs = expressWs(app);

    subUpdate();

    eWs.app.ws("/plugin", (ws: any) => {
        pool.push(ws);

        messages.forEach((content, name) => {
            ws.send(JSON.stringify({ name, content }));
        });

        ws.on('message', (msg: string) => {
            console.log(msg);
        });

        ws.on('error', (err: any) => {
            console.log("scoket error", err);
            remove(ws);
        });
        ws.on('close', () => {
            remove(ws);
        });
    });

    return eWs.app;
}

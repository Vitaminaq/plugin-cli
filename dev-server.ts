// import { WebSocketServer } from 'ws';
import { devCompiler, buildCompiler } from './webpack/service';

// const wss = new WebSocketServer({ port: 3000 });

// wss.on('connection', (socket) => {
//     socket.on('message', (raw) => {
//         console.log("========= message =======", raw);
//     });

//     socket.on('error', (err) => {
//         console.log("========== error ============", err);
//     });

//     socket.send(JSON.stringify({ type: 'connected' }));

//     createCompiler(socket);
// });

// wss.on('error', (e: Error & { code: string }) => {
//     console.log("========= wss error ==========", e);
// });

devCompiler();

// buildCompiler();

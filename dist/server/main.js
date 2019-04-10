"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const app = express();
//initialize a simple http server
const server = http.createServer(app);
//initialize the WebSocket server instance
const wss = new WebSocket.Server({ server });
let changes = new Array();
wss.on('connection', (ws) => {
    //connection is up, let's add a simple simple event
    ws.on('message', (message) => {
        //log the received message and send it back to the client
        console.log('received: %s', message);
        var change = JSON.parse(message);
        if (change.type === 'request_init_load') {
            ws.send(JSON.stringify({ type: 'init_load', data: changes }));
            console.log('sent the messages');
        }
        else {
            if (['insert', 'delete', 'retain'].includes(change.type)) {
                changes.push(message);
                console.log(changes.length);
            }
            //send back the message to the other clients
            wss.clients
                .forEach(function (client) {
                if (client != ws) {
                    client.send(message);
                }
            });
        }
    });
});
//start our server
server.listen(process.env.PORT || 5000, () => {
    console.log(`Server started`);
});
//# sourceMappingURL=main.js.map
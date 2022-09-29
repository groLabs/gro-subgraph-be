#!/usr/bin/env ts-node

// Module dependencies.
import { app } from '../app';
import http from 'http';
import {
    showInfo,
    showError
} from '../handler/logHandler';
import { PORT } from '../constants';


// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT || PORT);
app.set('port', port);

// Create HTTP server.
const server = http.createServer(app);

// Listen on provided port, on all network interfaces.
server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

// Normalize a port into a number, string or false.
function normalizePort(val: any) {
    const port = parseInt(val, 10);
    if (isNaN(port)) {
        // named pipe
        return val;
    }
    if (port >= 0) {
        // port number
        return port;
    }
    return false;
}

// Event listener for HTTP server "error" event.
function onError(error: any) {
    if (error.syscall !== 'listen') {
        throw error;
    }

    const bind = typeof port === 'string'
        ? 'Pipe ' + port
        : 'Port ' + port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case 'EACCES':
            showError('www.ts->onError()', bind + ' requires elevated privileges');
            process.exit(1);
        case 'EADDRINUSE':
            showError('www.ts->onError()', bind + ' is already in use');
            process.exit(1);
        default:
            showError('www.ts->onError()', error.code);
            throw error;
    }
}

// Event listener for HTTP server "listening" event
function onListening() {
    var addr = server.address();
    var bind = typeof addr === 'string'
        ? `pipe ${addr}`
        : `port ${(addr?.port) ? addr?.port : 'unknown'}`;
    showInfo(`Subgraph express server listening on ${bind}`);
}

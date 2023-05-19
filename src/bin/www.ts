#!/usr/bin/env ts-node

import http from 'http';
import { app } from '../app';
import { Env } from '../types';
import * as dotenv from 'dotenv';
import { DAYS_GVT_APY } from '../constants';
import * as dotenvExpand from 'dotenv-expand';
import { startJobs } from '../scheduler/scheduler';
import { getBlockNumbers } from '../caller/blockCaller';
import {
    readAirdropProofs,
    readVestingAirdropProofs,
} from '../etl/etlAirdrops';
import {
    showInfo,
    showError,
} from '../handler/logHandler';

let env = dotenv.config();
dotenvExpand.expand(env);

showInfo('Starting subgraph bot ...');

// Load airdrop & vestingAirdrop proofs synchronously once
readAirdropProofs();
readVestingAirdropProofs();

// Get port from environment and store in Express.
const port = normalizePort(process.env.PORT);
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
    showInfo(`Subgraph bot ready!`);
}

// start scheduled jobs
startJobs();

// retrieve block numbers for gvt apy calc at the bot startup. Then, 
// it will be called every time there's a groStats API request
(async () => {
    if (process.env.NODE_ENV === Env.PROD) {
        await getBlockNumbers(DAYS_GVT_APY);
    }
})();

const { NODE_ENV } = process.env;

import asyncSleep from 'await-sleep';

if (!NODE_ENV || NODE_ENV === 'development') {
    import dotenv from 'dotenv';
    dotenv.config();
}

process.on('exit', () => {
    // eslint-disable-next-line no-console
    console.log('Probe Shutting Shutdown');
});

process.on('unhandledRejection', err => {
    // eslint-disable-next-line no-console
    console.error('Unhandled rejection in probe process occurred');
    // eslint-disable-next-line no-console
    console.error(err);
});

process.on('uncaughtException', err => {
    // eslint-disable-next-line no-console
    console.error('Uncaught exception in probe process occurred');
    // eslint-disable-next-line no-console
    console.error(err);
});

import Main from './workers/main';
import config from './utils/config';
import logger from '../common-server/utils/logger';

const cronMinuteStartTime = Math.floor(Math.random() * 50);

setTimeout(async () => {
    // keep monitoring in an infinate loop.

    //eslint-disable-next-line
    while (true) {
        try {
            await Main.runJob();
        } catch (error) {
            logger.error(error);
            logger.info('Sleeping for 30 seconds...');
            await asyncSleep(30 * 1000);
        }
    }
}, cronMinuteStartTime * 1000);

// eslint-disable-next-line no-console
console.log(
    `Probe with Probe Name ${config.probeName} and Probe Key ${config.probeKey}. OneUptime Probe API URL: ${config.probeApiUrl}`
);

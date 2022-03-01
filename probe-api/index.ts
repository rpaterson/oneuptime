import 'common-server/utils/env';
import 'common-server/utils/process';
import Express from 'common-server/utils/express';

const app = Express.launchApplication();

app.get(['/probe-api/status', '/status'], function(
    req: express.Request,
    res: express.Response
) {
    res.setHeader('Content-Type', 'application/json');
    res.send(
        JSON.stringify({
            status: 200,
            message: 'Service Status - OK',
            serviceType: 'oneuptime-probe-api',
        })
    );
});

app.use(['/probe', '/api/probe'], require('./api/probe'));

export default app;

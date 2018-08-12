import koa from 'koa';
import logger from 'koa-logger';
import router from 'koa-joi-router';
import responseTime from 'koa-response-time';
import dotenv from 'dotenv';
import scanValidator from './src/rules/scan';
import repoValidator from './src/rules/repo';
import repo from './src/repo';
import { getResults } from './src/mcl';
import tryHandle from './src/error_handler';
import markdown from './src/markdown';

const app = new koa();
const route = new router();
dotenv.config();

route
    .post('/scan', scanValidator, async(ctx) => {
        if (ctx.invalid) {
            ctx.assert(!ctx.invalid, 400, ...ctx.invalid.body.details)
            return;
        }
        ctx.body = { data_id: await repo.scan({ username: ctx.request.body.username, repo: ctx.request.body.repo, ref: ctx.request.body.ref }) };
    })
    .get('/repo/file/:data_id', repoValidator.file, async(ctx) => {
        if (ctx.invalid) {
            ctx.assert(!ctx.invalid, 400, ...ctx.invalid.params.details)
            return;
        }
        ctx.body = {...await getResults({ data_id: ctx.params.data_id }) };
    })
    .get('/repo/hash/:hash', repoValidator.hash, async(ctx) => {
        if (ctx.invalid) {
            ctx.assert(!ctx.invalid, 400, ...ctx.invalid.params.details)
            return;
        }
        ctx.body = {...await getResults({ hash: ctx.params.hash }) };
    });

app
    .use(logger())
    .use(responseTime())
    .use(markdown)
    .use(tryHandle)
    .use(route.middleware())
    .listen(process.env.PORT || 3000);
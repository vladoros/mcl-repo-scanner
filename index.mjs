import koa from 'koa';
import logger from 'koa-logger';
import router from 'koa-joi-router';
import rp from 'request-promise';
import markdown from 'koa-markdown';
import dotenv from 'dotenv';

const app = new koa();
const route = new router();
const Joi = router.Joi;
dotenv.config();

const scanRepo = async(ctx) => {
    if (ctx.invalid) {
        ctx.body = { errors: ctx.invalid.body.message };
        ctx.status = ctx.invalid.body.status;
        return;
    }
    let github_api = `https://api.github.com`
    try {
        let repo = await rp({
            method: 'get',
            uri: `${github_api}/repos/${ctx.request.body.username}/${ctx.request.body.repo}`,
            headers: { 'User-Agent': 'scan' },
            json: true
        });
        if (repo) {
            let result = await rp({
                method: 'get',
                uri: `${github_api}/repos/${ctx.request.body.username}/${ctx.request.body.repo}/tarball/${ctx.request.body.ref}`,
                headers: { 'User-Agent': 'scan' },
            }).pipe(rp.post({
                method: 'post',
                uri: `https://api.metadefender.com/v2/file`,
                headers: {
                    apikey: process.env.MCL_APIKEY,
                    filename: `${ctx.request.body.username}/${ctx.request.body.repo}-${ctx.request.body.ref}.tar.gz`
                },
                json: true
            }));
            ctx.body = { data_id: result.data_id };
        } else {
            ctx.throw(500, 'Could not access github')
        }
    } catch (err) {
        handleErr(err, ctx)
    }
}

const getResults = async(ctx) => {
    if (ctx.invalid) {
        ctx.body = { errors: ctx.invalid.params.message };
        ctx.status = ctx.invalid.params.status;
        return;
    }
    const mcl_api = 'https://api.metadefender.com/v2';
    let uri = ctx.params.data_id ? `${mcl_api}/file/${ctx.params.data_id}` : `${mcl_api}/hash/${ctx.params.hash}`;
    try {
        let result = await rp({
            method: 'get',
            uri: uri,
            headers: { apikey: process.env.MCL_APIKEY },
            json: true
        });
        if (result) {
            ctx.body = { result };
        } else {
            ctx.throw(500, 'Could not access metadefender')
        }
    } catch (err) {
        handleErr(err, ctx)
    }
}

const handleErr = (err, ctx) => {
    if (err.response) {
        ctx.status = err.response.statusCode;
        ctx.body = { error: err.response.statusMessage }
    } else {
        ctx.status = 500;
        ctx.body = err.message;
    }
}

route
    .post('/scan', {
            validate: {
                body: {
                    username: Joi.string().max(100).required(),
                    repo: Joi.string().max(100).required(),
                    ref: Joi.string().max(100).default('master')
                },
                type: 'json',
                output: {
                    200: {
                        body: {
                            data_id: Joi.string()
                        }
                    }
                },
                continueOnError: true
            }
        },
        scanRepo)
    .get('/repo/file/:data_id', {
        validate: {
            params: {
                data_id: Joi.string().required().min(5)
            },
            continueOnError: true
        },
    }, getResults)
    .get('/repo/hash/:hash', {
        validate: {
            params: {
                hash: Joi.string().required().min(5)
            },
            continueOnError: true
        },
    }, getResults);

app.use(logger())
    .use(markdown({
        root: process.cwd(),
        baseUrl: '/',
        indexName: 'readme',
        layout: process.cwd() + '/layout.html'
    }))
    .use(route.middleware())
    .listen(process.env.PORT || 3000);
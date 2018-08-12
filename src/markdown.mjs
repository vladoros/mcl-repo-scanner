import markdown from 'koa-markdown';
import convert from 'koa-convert';

const m = convert(markdown({
    root: process.cwd(),
    cache: true,
    baseUrl: '/',
    indexName: 'readme',
    layout: process.cwd() + '/layout.html'
}));

export default m;
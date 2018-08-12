const tryHandle = async(ctx, next) => {
    try {
        if (await ctx.cashed()) return;
        await next();
    } catch (err) {
        if (err.response) {
            ctx.status = err.response.statusCode;
            ctx.body = { error: err.response.body ? err.response.body : err.response.statusMessage };
        } else {
            ctx.status = ctx.status ? ctx.status : 500;
            ctx.body = { error: err.message };
        }
        return;
    }
    if (!ctx.body) ctx.body = { error: ctx.message }
}

export default tryHandle;
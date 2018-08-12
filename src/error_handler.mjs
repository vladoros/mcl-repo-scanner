const tryHandle = async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        if (err.response) {
            ctx.status = err.response.statusCode;
            ctx.body = { error: err.response.body };
        } else {
            ctx.status = ctx.status ? ctx.status : 500;
            ctx.body = { error: err.message };
        }
        return;
    }
    if (!ctx.body) ctx.body = { error: ctx.message }
}

export default tryHandle;
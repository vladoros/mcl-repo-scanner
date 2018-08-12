import router from 'koa-joi-router';
const Joi = router.Joi;

// TODO add repo type
export const scanValidator = {
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
}

export const scanParamValidator = {
    validate: {
        params: {
            username: Joi.string().max(100).required(),
            repo: Joi.string().max(100).required(),
            ref: Joi.string().max(100).default('master')
        },
        continueOnError: true
    },
}
export default scanValidator;
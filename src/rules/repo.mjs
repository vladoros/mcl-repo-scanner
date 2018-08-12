import router from 'koa-joi-router';
const Joi = router.Joi;

export const file = {
    validate: {
        params: {
            data_id: Joi.string().required().min(5)
        },
        continueOnError: true
    }
}
export const hash = {
    validate: {
        params: {
            hash: Joi.string().required().min(5)
        },
        continueOnError: true
    },
}
export default { file, hash };
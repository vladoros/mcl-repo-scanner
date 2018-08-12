import rp from 'request-promise-native';
import request from 'request';

const mcl_api = 'https://api.metadefender.com/v2';

export const getResults = async({ data_id, hash }) => {
    let uri = data_id ? `${mcl_api}/file/${data_id}` : `${mcl_api}/hash/${hash}`;
    let result = await rp({
        method: 'get',
        uri: uri,
        headers: { apikey: process.env.MCL_APIKEY },
        json: true
    });
    if (result) {
        return result;
    }
    throw new Error('Could not access metadefender');
}

export const uploadFile = ({ file, callback }) => request({
    method: 'post',
    uri: `${mcl_api}/file`,
    headers: {
        apikey: process.env.MCL_APIKEY,
        filename: file
    },
    json: true
}, callback);

export default { getResults };
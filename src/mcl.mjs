import rp from 'request-promise-native';

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

export const uploadFile = ({ username, repo, ref }) => rp.post({
    method: 'post',
    uri: `${mcl_api}/file`,
    headers: {
        apikey: process.env.MCL_APIKEY,
        filename: `${username}/${repo}-${ref}.tar.gz`
    },
    json: true
})

export default { getResults, uploadFile };
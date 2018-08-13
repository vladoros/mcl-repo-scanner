import rp from 'request-promise-native';
import request from 'request';
import { getResults, uploadFile } from './mcl';

const scan = async({ type, username, repo, ref, wait = false }) => {
    let result;
    let providerAPI, uri, checkUri = '';
    switch (type) {
        case 'bitbucket':
            providerAPI = `https://bitbucket.org`;
            uri = `${providerAPI}/${username}/${repo}/get/${ref}.tar.gz`;
            checkUri = `https://api.bitbucket.org/2.0/repositories/${username}/${repo}/downloads`;
            break;
        case 'gitlab':
            providerAPI = `https://gitlab.com`;
            uri = `${providerAPI}/${username}/${repo}/-/archive/${ref}/${repo}-${ref}.tar.gz`;
            checkUri = `https://gitlab.com/api/v4/users/${username}/projects`;
            break;
        default:
            providerAPI = `https://api.github.com`
            checkUri = `${providerAPI}/repos/${username}/${repo}`
            uri = `${providerAPI}/repos/${username}/${repo}/tarball/${ref}`
    }

    result = await rp({
        method: 'get',
        uri: checkUri,
        headers: { 'User-Agent': 'scan' },
    })
    if (type === 'gitlab') {
        try {
            result = JSON.parse(result)
        } catch(err) {
            result = false
        }
        result = result && result.filter(x => x.name === repo).length > 0;
    }
    if (result && providerAPI) {
        result = await new Promise((resolve, reject) => request({
            uri: uri,
            headers: { 'User-Agent': 'scan' },
        }).pipe(uploadFile({
            file: `${username}/${repo}-${ref}.tar.gz`,
            callback: (err, response) => {
                if (!err) {
                    return resolve(response.body)
                } else {
                    return reject(err)
                }
            }
        })));

        return !wait ? result.data_id :
            await lookup(getResults, { data_id: result.data_id }, 1000, 25);
    } else {
        throw new Error(`Could not repo from ${type}`)
    }
}

const lookup = (fn, val, ms, maxRetries, current = 0) => new Promise(resolve => {
    let retries = current;
    fn.call(this, val).then((data) => {
        if (data && data.scan_results &&
            (data.scan_results.progress_percentage !== 100 ||
                data.scan_results.scan_all_result_i === 14)) {
            setTimeout(() => {
                ++retries;
                if (retries == maxRetries) {
                    return resolve(data);
                }
                lookup(fn, val, ms, maxRetries, retries).then(resolve);
            }, ms);
        } else {
            return resolve(data);
        }
    });
});

export default { scan };
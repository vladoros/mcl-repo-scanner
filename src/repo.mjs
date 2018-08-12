import rp from 'request-promise-native';
import { uploadFile } from './mcl';
import { getResults } from './mcl.mjs';

let github_api = `https://api.github.com`

const scan = async({ username, repo, ref, wait = false }) => {
    let rep = await rp({
        method: 'get',
        uri: `${github_api}/repos/${username}/${repo}`,
        headers: { 'User-Agent': 'scan' },
        json: true
    });
    if (rep) {
        let response = {};
        let result = await rp({
            method: 'get',
            uri: `${github_api}/repos/${username}/${repo}/tarball/${ref}`,
            headers: { 'User-Agent': 'scan' },
        }).pipe(uploadFile({ username, repo, ref }));
        response = !wait ? result.data_id : await lookup(getResults, { data_id: result.data_id }, 1000, 25);
        return response;
    } else {
        throw new Error('Could not access github')
    }
}

const lookup = (fn, val, ms, maxRetries, current = 0) => new Promise(resolve => {
    let retries = current;
    fn.call(this, val).then((data) => {
        if (data && data.scan_results && (data.scan_results.scan_all_result_i === 14 || data.scan_results.progress_percentage === 100)) {
            return resolve(data);
        }
        setTimeout(() => {
            ++retries;
            if (retries == maxRetries) {
                return resolve(data);
            }
            lookup(fn, val, ms, maxRetries, retries).then(resolve);
        }, ms);
    });
});

export default { scan };
import rp from 'request-promise-native';
import { uploadFile } from './mcl';

let github_api = `https://api.github.com`

const scan = async({ username, repo, ref }) => {
    let rep = await rp({
        method: 'get',
        uri: `${github_api}/repos/${username}/${repo}`,
        headers: { 'User-Agent': 'scan' },
        json: true
    });
    if (rep) {
        let result = await rp({
            method: 'get',
            uri: `${github_api}/repos/${username}/${repo}/tarball/${ref}`,
            headers: { 'User-Agent': 'scan' },
        }).pipe(uploadFile({ username, repo, ref }));
        return result.data_id;
    } else {
        throw new Error('Could not access github')
    }
}

export default { scan };
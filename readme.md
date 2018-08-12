# mcl-repo-scanner

Repository scanner API example with [Metadefender Cloud APIs](https://onlinehelp.opswat.com/mdcloud).

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/vladoros/mcl-repo-scanner)
[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/vladoros/mcl-repo-scanner)

### Prerequisites

Before starting the API make sure you have:

- a Metadefender Cloud apikey; if not, please go to [metadefender.opswat.com](https://metadefender.opswat.com) and click the "Sign up" button
- repository cloned, [nodejs](https://nodejs.org/en/download/package-manager/) & dependencies installed:
```bash
git clone git@github.com:vladoros/mcl-repo-scanner.git
npm install
```
- `MCL_APIKEY` env variable setup with the provided apikey or `.env` file in repository root

## Run the code

[Experimental modules flag](https://nodejs.org/api/esm.html#esm_ecmascript_modules) is required due to usage of [ECMAScript modules](https://github.com/nodejs/node-eps/blob/master/002-es-modules.md).

`npm start` or `node --experimental-modules ./index.mjs`

## Endpoints

All endpoints are cached for 60 seconds & return only JSON.

### GET /

Serves `readme.md` as html.

### GET /scan/:username/:repo/:ref?

Will check if specified repository exists & start a scan request with a tarball of the repository then return a result with highest progress available in 25 sec.

Ref is optional, defaults to master.

```bash
curl -X GET http://localhost/scan/vladoros/mcl-repo-scanner
```

### POST /scan

Will check if specified repository exists & start a scan request with a tarball of the repository.
When done it will return a data_id of the file.
Ref is still optional, defaults to master.

```bash
curl -d '{"username":"vladoros", "repo": "mcl-repo-scanner", "ref": "master"}' \
     -H "Content-Type: application/json" -X POST http://localhost/scan
```
### GET /repo/file/:data_id

Returns the scan response as result.

```bash
curl -X GET http://localhost/repo/file/:data_id
```

### GET /repo/hash/:hash

Returns the scan response as result by querying repository tarball hash.

```bash
curl -X GET http://localhost/repo/hash/:hash
```

## Metadefender Cloud API Documentation

1. [Scanning a file by file upload](https://onlinehelp.opswat.com/mdcloud/2.1_Scanning_a_file_by_file_upload.html)
2. [Retrieving scan reports using data ID](https://onlinehelp.opswat.com/mdcloud/2.2_Retrieving_scan_reports_using_data_ID.html)
3. [Rate limiting](https://onlinehelp.opswat.com/mdcloud/3._Rate_Limiting.html)
4. [Throttling](https://onlinehelp.opswat.com/mdcloud/4._Throttling.html)

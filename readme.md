# mcl-repo-scanner

Repository scanner API example with [Metadefender Cloud APIs](https://onlinehelp.opswat.com/mdcloud).

## Metadefender Cloud API Key

Before running the tool, please make sure you have:

- a Metadefender Cloud apikey; if not, please go to [metadefender.opswat.com](https://metadefender.opswat.com) and click the "Sign up" button
- `MCL_APIKEY` env variable setup with the provided apikey or `.env` file in repository root

## Run the code

[Experimental modules flag](https://nodejs.org/api/esm.html#esm_ecmascript_modules) is required because of [ECMAScript modules usage](https://github.com/nodejs/node-eps/blob/master/002-es-modules.md).

```bash
git clone git@github.com:vladoros/mcl-repo-scanner.git
npm install
npm start
```
or

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)
[![Remix on Glitch](https://cdn.glitch.com/2703baf2-b643-4da7-ab91-7ee2a2d00b5b%2Fremix-button.svg)](https://glitch.com/edit/#!/remix/vladoros/mcl-repo-scanner)
[![Deploy to now](https://deploy.now.sh/static/button.svg)](https://deploy.now.sh/?repo=https://github.com/vladoros/mcl-repo-scanner)

## Endpoints

### GET /

Serve `readme.md` as html.

### POST /scan

Will check if specified repository exists & start a scan request with a tarball of the repository.
When done it will return a data_id of the file.

```bash
curl -d '{"username":"vladoros", "repo": "mcl-repo-scanner", "ref": "master"}' -H "Content-Type: application/json" -X POST http://localhost/scan
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

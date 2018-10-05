const copy = require('recursive-copy');
const rp = require('request-promise-native');
const request = require('request');
const fs = require('fs-extra');
const pgb = require('pgb-api')();
const sleep = require('util').promisify(setTimeout);

(async function() {

    await fs.remove('./build');
    await fs.mkdir('./build');
    await copy('./www', './build/www');

    pgb.addAuth('');

    let appData = {
        id: '3292017',
        private: true, 
        share: false,
        tag: 'master',
        debug: true,
    }
     
    console.log('Updating');
    const app = await pgb.updateApp(appData.id, './build', appData);

    console.log('Building');
    await pgb.buildApp(app.id, ['android']);

    let buildComplete = false;
    while (!buildComplete) {
        const appStatus = await pgb.getApp(app.id);
        buildComplete = appStatus.status.android === 'complete';
        console.log(appStatus.status.android);
        await sleep(1500);
    }

    console.log('Downloading');

    const r = request(`https://build.phonegap.com/api/v1/apps/${appData.id}/android?auth_token=`);
    r.pipe(fs.createWriteStream('./test.apk'));
    await r;

    console.log('Done');

}());

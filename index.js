const promptly = require('promptly');
const rp = require('request-promise-native');
const copy = require('recursive-copy');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const pgb = require('pgb-api')();
const argv = require('yargs').argv;
const metadata = require('./metadata');
const sleep = require('util').promisify(setTimeout);
const request = require('request');
const inquirer = require('inquirer');

const apkDir = 'phonegapApks';

// Colours for console logs
const normalConsole = '%s\x1b[0m';
const blueConsole = '\x1b[36m' + normalConsole;
const redConsole = '\x1b[31m' + normalConsole;
const whiteConsole = '\x1b[37m' + normalConsole;
const yellowConsole = '\x1b[33m' + normalConsole;
const greenConsole = '\x1b[32m' + normalConsole;
const brightConsole = '\x1b[1m' + normalConsole;

const { apiBaseUrl = 'https://flow.manywho.com', cdnBaseUrl = 'https://assets.manywho.com' } = argv;

const generateHtml = ({
    htmlTemplate, makeOffline, theme, tenantId, flowId, flowVersionId
}) => htmlTemplate
    .replace('{{{OFFLINE}}}', makeOffline ? '<script src="js/ui-offline.js"></script>' : '')
    .replace('{{{METADATA}}}', makeOffline ? '<script src="js/ui-metadata.js"></script>' : '')
    .replace('{{{THEME}}}', theme)
    .replace('{{{TENANT_ID}}}', tenantId)
    .replace('{{{FLOW_ID}}}', flowId)
    .replace('{{{FLOW_VERSION_ID}}}', flowVersionId);

let userDefaults = {
    theme: 'paper', 
    tenantId: '',
    flowId: '',
    flowVersionId: '',
    username: '',
    password: '',
};

(async function () {
    console.log('Downloading UI Framework');

    const bundles = await rp.get({
        uri: `${cdnBaseUrl}/bundles.json`,
        json: true
    });

    try {
        userDefaults = JSON.parse(fs.readFileSync('./user-defaults.json'));
    } catch (err) { }

    const htmlTemplate = fs.readFileSync('./template.html').toString();

    const theme = await promptly.prompt(`Theme (default: ${userDefaults.theme}):`, { default: userDefaults.theme });
    const tenantId = await promptly.prompt(`Tenant Id: (default: ${userDefaults.tenantId}):`, { default: userDefaults.tenantId });
    const flowId = await promptly.prompt(`Flow Id: (default: ${userDefaults.flowId}):`, { default: userDefaults.flowId });
    const flowVersionId = await promptly.prompt(`Flow Version Id: (default: ${userDefaults.flowVersionId}):`, { default: userDefaults.flowVersionId });
    const makeOffline = await promptly.confirm('Do you want to go offline? y/n');
    const username = makeOffline
        ? await promptly.prompt(`Username: (default: ${userDefaults.username}):`, { default: userDefaults.username })
        : '';
    const password = makeOffline
        ? await promptly.prompt(`Password: (default: ${userDefaults.password}):`, { default: userDefaults.password })
        : '';
    const saveDefaults = await promptly.confirm('Save these options as defaults? y/n');

    const html = generateHtml({
        htmlTemplate, makeOffline, theme, tenantId, flowId, flowVersionId
    });

    // bundlePaths and outputPaths order must match
    const bundlePaths = [
        `/css/themes/mw-${theme}.css`,
        bundles.bootstrap3[1],
        bundles.bootstrap3[2],
        bundles.bootstrap3[0],
        bundles.core[0]
    ];

    const outputPaths = [
        `./www/css/themes/mw-${theme}.css`,
        './www/css/mw-bootstrap.css',
        './www/css/ui-bootstrap.css',
        './www/js/ui-bootstrap.js',
        './www/js/ui-core.js'
    ];

    if (saveDefaults) {

        const defaults = {
            theme,
            tenantId,
            flowId,
            flowVersionId,
            username,
            password
        };

        fs.writeFile('./user-defaults.json', JSON.stringify(defaults));
    }

    mkdirp.sync('./www/css');
    mkdirp.sync('./www/css/themes');
    mkdirp.sync('./www/js');

    console.log('Downloading assets');

    Promise.all(
        bundlePaths.map(path => rp.get({
            uri: `${cdnBaseUrl}${path}`,
            gzip: true
        }))
    ).then(
        (fileContents) => fileContents.forEach((fileContent, index) => {
            fs.writeFile(outputPaths[index], fileContent);
        })
    );

    if (makeOffline) {

        Promise.all([
            metadata({ baseUrl: apiBaseUrl, username, password, tenantId, flowId, flowVersionId }),
            rp.get({
                uri: `${cdnBaseUrl}${bundles.offline[0]}`,
                gzip: true
            })
        ]).then(
            (files) => {
                fs.writeFile('./www/js/ui-metadata.js', `var metaData = ${JSON.stringify(JSON.parse(files[0]))};\n`);
                fs.writeFile('./www/js/ui-offline.js', files[1]);
            },
            (response) => {
                console.log(`Failed to retrieve a snapshot of the flow\nAPI Response: ${response}`)
            }
        );
    }

    console.log('Updating index.html');

    fs.writeFile('./www/index.html', html);

    const isPhoneGapBuild = await promptly.confirm('Would you like to package your app using Phonegap Build? y/n');
    const phoneGapAuthToken = isPhoneGapBuild
    ? await promptly.prompt(`Phonegap Build authentication token: `)
    : '';

    if (isPhoneGapBuild && phoneGapAuthToken) {

        let appToBuild;
        let appData = {
            private: true, 
            share: false,
            tag: 'master',
            debug: true,
        };

        // The app assets are copied into a build folder
        // so first remove an existing build folder
        await fs.remove('./build');
        await fs.mkdir('./build');
        await copy('./www', './build/www');

        // Copy config file or phone gap will use its own
        await copy('./config.xml', './build/www/config.xml');

        // Authenticate phonegap build requests
        pgb.addAuth(phoneGapAuthToken);

        // Now display all phone gap apps
        // If none exist, then ask to add an app
        let phoneGapApps;
        try {
            phoneGapApps = await pgb.getApps();
        } catch(error) {
            console.error(redConsole, error.message);
            process.exit();
        }

        if (phoneGapApps.apps.length > 0) {

            const appList = phoneGapApps.apps.map(app => {
                return `${app.title}-${app.id}`
            });

            const selectedApp = await inquirer.prompt([
                {
                    type: 'list',
                    name: 'apps',
                    message: 'Which app would you like to update?',
                    choices: appList
                }
            ]);
    
            // const selectedApp = await promptly.choose('Which app would you like to update?', appList);
            const selectedAppId = selectedApp.apps.split('-')[1];
    
            appData['id'] = selectedAppId;
    
            appToBuild = await pgb.updateApp(selectedAppId, './build/www', appData);
        } else {
            // If there are no apps then create a new one
            console.log('Adding your first app...');
            try {
                appToBuild = await pgb.addApp('./build/www', [appData]);
            } catch(error) {
                console.error(redConsole, error.message);
                process.exit();
            }
        }

        console.log(blueConsole, 'Building...');
        try {
            await pgb.buildApp(appToBuild.id, ['android']);
        } catch(error) {
            console.error(redConsole, error.message);
            process.exit();
        }
    
        let buildComplete = false;
        while (!buildComplete) {
            const appStatus = await pgb.getApp(appToBuild.id);
            buildComplete = appStatus.status.android === 'complete';
            const colour = buildComplete ? greenConsole : yellowConsole;
            console.log(colour, appStatus.status.android);
            await sleep(1500);
        }

        console.log(blueConsole, 'Downloading...');

        const r = request(`https://build.phonegap.com/api/v1/apps/${appToBuild.id}/android?auth_token=${phoneGapAuthToken}`);
        r.pipe(fs.createWriteStream(`./${apkDir}/${appToBuild.id}.apk`));
        await r;
    
        console.log(brightConsole, `${appToBuild.id}.apk can be found in your ${apkDir} folder and is ready to install on your Android device`);

    } else {
        console.log(brightConsole, 'Your app is now ready to be run inside an emulator');
    }
})();


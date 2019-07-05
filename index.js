const promptly = require('promptly');
const progress = require('progress');
const rp = require('request-promise-native');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const decompressResponse = require('decompress-response');
const argv = require('yargs').argv;
const metadata = require('./metadata');

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
    theme: '',
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
        ? await promptly.password(`Password: (default: ${userDefaults.password}):`, { default: userDefaults.password })
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

    console.log('Done');
})();


const promptly = require('promptly');
const progress = require('progress');
const rp = require('request-promise-native');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');
const metadata = require('./metadata');

const generateHtml = ({ 
    template, makeOffline, theme, tenantId, flowId, flowVersionId, username, password
}) => template
    .replace('{{{OFFLINE}}}', makeOffline ? '<script src="js/ui-offline.js"></script>' : '')
    .replace('{{{METADATA}}}', makeOffline ? '<script src="js/ui-metadata.js"></script>' : '')
    .replace('{{{THEME}}}', theme)
    .replace('{{{TENANT_ID}}}', tenantId)
    .replace('{{{FLOW_ID}}}', flowId)
    .replace('{{{FLOW_VERSION_ID}}}', flowVersionId)
    .replace('{{{USERNAME}}}', username)
    .replace('{{{PASSWORD}}}', password);

(async function() {    
    console.log('Downloading UI Framework');

    const bundles = await rp.get({
        uri: 'https://s3.amazonaws.com/manywho-cdn-react-staging/bundles.json',
        json: true
    });
    
    const theme = await promptly.prompt('Theme (defaults to paper):', { default: 'paper' });    
    const tenantId = await promptly.prompt('Tenant Id:');
    const flowId = await promptly.prompt('Flow Id:');
    const flowVersionId = await promptly.prompt('Flow Version Id:', { default: '' });
    const makeOffline = await promptly.confirm('Do you want to go offline? y/n');
    const username = makeOffline ? await promptly.prompt('Username:') : '';
    const password = makeOffline ? await promptly.prompt('Password:') : '';

    const template = (await fs.readFile('./template.html')).toString();
    const html = generateHtml({ 
        template, makeOffline, theme, tenantId, flowId, flowVersionId, username, password
    });
    
    mkdirp.sync('./www/css');
    mkdirp.sync('./www/css/themes');
    mkdirp.sync('./www/js');

    console.log('Downloading assets');

    await fs.writeFile('./www/css/mw-bootstrap.css', await rp.get('https://s3.amazonaws.com/manywho-cdn-react-staging' + bundles.bootstrap3[0]));
    await fs.writeFile('./www/css/ui-bootstrap.css', await rp.get('https://s3.amazonaws.com/manywho-cdn-react-staging' + bundles.bootstrap3[1]));
    await fs.writeFile('./www/js/ui-bootstrap.js', await rp.get('https://s3.amazonaws.com/manywho-cdn-react-staging' + bundles.bootstrap3[2]));
    await fs.writeFile('./www/js/ui-core.js', await rp.get('https://s3.amazonaws.com/manywho-cdn-react-staging' + bundles.core[0]));
    await fs.writeFile(`./www/css/themes/mw-${theme}.css`, await rp.get(`https://s3.amazonaws.com/manywho-cdn-react-staging/css/themes/mw-${theme}.css`));

    if(makeOffline) {
        const snapshot = await metadata({ username, password, tenantId, flowId, flowVersionId }).catch(e => console.log('Failed to get snapshot: ' + e));
        await fs.writeFile('./www/js/ui-metadata.js', `window.flow.metadata = ${JSON.stringify(JSON.parse(snapshot))};\n`);
        await fs.writeFile('./www/js/ui-offline.js', await rp.get('https://s3.amazonaws.com/manywho-cdn-react-staging' + bundles.offline[0]));
    }
    
    console.log('Updating index.html');

    await fs.writeFile('./www/index.html', html);

    process.exit();

    console.log('Done');
})();


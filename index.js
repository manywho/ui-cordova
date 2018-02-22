const promptly = require('promptly');
const progress = require('progress');
const rp = require('request-promise-native');
const fs = require('fs-extra');
const mkdirp = require('mkdirp');

(async function() {    
    console.log('Downloading UI Framework');

    const bundles = await rp.get({
        uri: 'https://assets.manywho.com/bundles.json',
        json: true
    });
    
    mkdirp.sync('./www/css');
    mkdirp.sync('./www/css/themes');
    mkdirp.sync('./www/js');

    await fs.writeFile('./www/css/mw-bootstrap.css', await rp.get('https://assets.manywho.com' + bundles.bootstrap3[0]));
    await fs.writeFile('./www/css/ui-bootstrap.css', await rp.get('https://assets.manywho.com' + bundles.bootstrap3[1]));
    await fs.writeFile('./www/js/ui-bootstrap.js', await rp.get('https://assets.manywho.com' + bundles.bootstrap3[2]));
    await fs.writeFile('./www/js/ui-core.js', await rp.get('https://assets.manywho.com' + bundles.core[0]));

    const theme = await promptly.prompt('Theme (defaults to paper):', {
        default: 'paper'
    });

    await fs.writeFile(`./www/css/themes/mw-${theme}.css`, await rp.get('https://assets.manywho.com' + bundles.core[0]));

    const tenantId = await promptly.prompt('Tenant Id:');
    const flowId = await promptly.prompt('Flow Id:');
    const flowVersionId = await promptly.prompt('Flow Version Id:', { default: '' });

    const flowDetails = new RegExp('\/\/FLOWSTART.*\/\/FLOWEND', 'gs');

    let html = (await fs.readFile('./www/index.html')).toString();
    html = html.replace(flowDetails, `
        //FLOWSTART
        var tenantId = ${tenantId};
        var flowId = ${flowId};
        var flowVersionId = ${flowVersionId}
        //FLOWEND
    `);
    
    console.log('Updating index.html');
    await fs.writeFile('./www/index.html', html);

    console.log('Done');
})();


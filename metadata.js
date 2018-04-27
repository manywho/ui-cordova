const rp = require('request-promise-native');

module.exports = async ({ baseUrl = "https://flow.manywho.com", username, password, tenantId, flowId, flowVersionId }) => {

    const token = await rp({
        method: "POST",
        uri: baseUrl + "/api/draw/1/authentication",
        body: {
            "loginUrl": baseUrl + "/plugins/manywho/api/draw/1/authentication",
            "username": username,
            "password": password
        },
        headers: {
            'ManyWhoTenant': 'da497693-4d02-45db-bc08-8ea16d2ccbdf'
        },
        json: true
    });

    const authToken = await rp({
        method: "GET",
        uri: baseUrl + "/api/draw/1/authentication/" + tenantId,
        headers: {
            'authorization': token,
        }
    });

    const authTokenClean = authToken.replace(/\"/g, '');

    const snapshot = await rp({
        method: "GET",
        uri: baseUrl + "/api/draw/1/flow/snap/" + flowId + "/" + flowVersionId,
        headers: {
            'authorization': authTokenClean,
            'ManyWhoTenant': tenantId
        }
    });

    return snapshot;
};
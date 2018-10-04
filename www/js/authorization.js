manywho.authorization.invokeAuthorization = (response, flowKey, onAuthenticated) => {
    if (response.authorizationContext != null && response.authorizationContext.directoryId != null) {

        if (manywho.utils.isEqual(response.authorizationContext.authenticationType, 'oauth', true)
            || manywho.utils.isEqual(response.authorizationContext.authenticationType, 'saml', true)
            || manywho.utils.isEqual(response.authorizationContext.authenticationType, 'oauth2', true)) {

            // Open the redirect url in an InAppBrowser instance so we can hook the navigation events
            const browser = cordova.InAppBrowser.open(response.authorizationContext.loginUrl, "_blank");

            browser.addEventListener("loadstart", function(event) {
                const urlMatcher = /^https:\/\/flow\..*?\.com\/[0-9a-fA-F]{8}[-]?([0-9a-fA-F]{4}[-]?){3}[0-9a-fA-F]{12}\/play/i
                
                // After a successful log the auth provider will attempt to redirect back to the flow, via flow.manywho.com.
                // We intercept that here and redirect to index.html + the query string which contains the auth token
                if (urlMatcher.test(event.url)) {
                    ref.close();
                    window.location.href = 'index.html' + event.url.substr(event.url.indexOf('?'));
                }
            });

            browser.show();
            return;
        }

        manywho.state.setLogin({
            isVisible: true,
            directoryId: response.authorizationContext.directoryId,
            directoryName: response.authorizationContext.directoryName,
            loginUrl: response.authorizationContext.loginUrl,
            stateId: response.stateId,
            callback: onAuthenticated,
        },             flowKey);
    }
};
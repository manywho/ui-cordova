/*!
Copyright 2016 ManyWho, Inc.
Licensed under the ManyWho License, Version 1.0 (the "License"); you may not use this
file except in compliance with the License.
You may obtain a copy of the License at: http://manywho.com/sharedsource
Unless required by applicable law or agreed to in writing, software distributed under
the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, either express or implied. See the License for the specific language governing
permissions and limitations under the License.
*/

manywho.authorization.invokeAuthorization = function (response, flowKey, doneCallback) {

    // Check to see if the user has successfully authenticated
    if (response.authorizationContext != null && response.authorizationContext.directoryId != null) {

        if (manywho.utils.isEqual(response.authorizationContext.authenticationType, 'oauth2', true)) {

            var authWindow = cordova.InAppBrowser.open(response.authorizationContext.loginUrl, '_blank', 'location=no,toolbar=no');
            
            $(authWindow).on('loadstart', function(e) {
                var url = e.originalEvent.url;
                
                if (url.indexOf('?join=') != -1 && url.indexOf('authorization=') != -1) {
                    authWindow.close();
                    window.location.search = url.split('?', 2)[1];
                }
            });

            return;
        }

        manywho.state.setLogin({
            isVisible: true,
            directoryId: response.authorizationContext.directoryId,
            directoryName: response.authorizationContext.directoryName,
            loginUrl: response.authorizationContext.loginUrl,
            stateId: response.stateId,
            callback: doneCallback
        }, flowKey);

    }

}

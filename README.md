ManyWho Offline for Cordova
===========================

This UI project allows you to embed your flows into a Cordova application.

## Set-up

Install Git on your machine:
```
https://desktop.github.com
```

Install Node on your machine (4.4.3):
```http
https://nodejs.org
```

## Usage

This repo is linked to our HTML5 player UI code repo here:
```
https://github.com/manywho/ManyWho_HTML5_Players2.
```

This allows 
you to easily debug any UI issues and easily extend the UI to include new capabilities as we have included with the above
two additional PhoneGap/Cordova plugins.

For the purposes of this project, we are assuming you have a valid Flow built on the ManyWho platform.

To clone this repo, execute the following git command in either Terminal (Mac) or using the Git Shell (Windows):
```bash
git clone --recursive https://github.com/manywho/ui-cordova.git
```

#### Building

To build, you should include the files in this repo in your Cordova project. We have not included the standard Cordova 
template directories here.

To install Cordova on your machine:
```bash
$ npm install -g cordova
```

Add the mobile platforms that you wish to support:
```bash
$ cd ui-cordova
$ cordova platform add android
$ cordova platform add ios
```

Add the InAppBrowser plugin to support oauth authentication:
```bash
$ cordova plugin add cordova-plugin-inappbrowser
```

Add the following plugins to make sure the code can operate fully offline on all platforms:
```bash
$ cordova plugin add cordova-plugin-network-information
$ cordova plugin add cordova-plugin-statusbar
$ cordova plugin add cordova-plugin-whitelist
$ cordova plugin add cordova-sqlite-storage
$ cordova plugin add cordova-plugin-inappbrowser
```

The UI code included in this project is compatible with iOS, Android, and Windows phones.

Now that you've built the core Cordova project pieces, terminal to /www/manywho/runtime and install the various gulp libraries
to allow you to build the UI code:
```bash
$ cd www/manywho/runtime
$ npm install -g gulp
$ npm install
```

Once that has completed, you can now build the offline code (only do this if you need to update the offline config files):
```bash
$ gulp offline
[13:38:56] Using gulpfile C:\GitHub\ui-cordova\www\manywho\runtime\gulpfile.js
[13:38:56] Starting 'offline'...
                                                                   @@@@
                                                                   @@@@
  @@@@   @@@@       @@@@@       @@@@    @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@@@@@@     @@@@@@
@@@@@@@@@@@@@@@  @@@@@@@@@@   @@@@@@@@  @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@@@@@@@  @@@@@@@@@@
@@@@ @@@@@ @@@@ @@@@    @@@@ @@@@@@@@@@ @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@  @@@@ @@@@    @@@@
@@@@ @@@@@ @@@@ @@@@    @@@@ @@@@  @@@@ @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@  @@@@ @@@@    @@@@
@@@@ @@@@@ @@@@ @@@@@@@ @@@@ @@@@  @@@@ @@@@@@@@@@ @@@@@@@@@@@@@@@ @@@@  @@@@  @@@@@@@@@@
@@@@ @@@@@ @@@@   @@@@@ @@@@ @@@@  @@@@  @@@@@@@@@  @@@@@@ @@@@@@  @@@@  @@@@    @@@@@@
                                             @@@@@
                                           @@@@@@@
                                           @@@@@
[13:38:56] Starting 'offline-build'...
[13:38:56] Finished 'offline-build' after 6.08 ms
[13:38:56] Starting 'jshint'...
[13:38:56] Finished 'jshint' after 47 ms
[13:38:56] Starting 'less'...
[13:38:56] Finished 'less' after 46 ms
[13:38:56] Starting 'bootstrap'...
[13:38:56] Finished 'bootstrap' after 2.87 ms
[13:38:56] Starting 'bootstrap-templates'...
[13:38:56] Finished 'bootstrap-templates' after 1.83 ms
[13:38:56] Finished 'offline' after 136 ms
[?] What is your ManyWho username? {enter your ManyWho Flow builder username}
[?] And your password? {enter your password}
[?] What is the name of the Flow you want to make offline? {enter the name of your Flow}
[?] Is this a PhoneGap build? (y/n) y
[?] Is this a debug build? (y/n) y
[?] Do you want to override any existing recording sequences? (y/n) n
```

To cancel out of this mode, Press ctrl-C on Windows or Mac.

**NOTE** The above steps should only be performed when the Flow is changed and the changes re-published. You should also make sure you keep any sequence or response files as these will be overwritten if you use the same build name. For now, each time the Flow is re-published with changes, you will need to re-do the responses exercise of going through every step in the Flow. If you are confident you know what changes have been made to the Flow, it is possible to simply get a response entry for the updated Page, etc and replace it in the reponses file rather than re-doing the entire cache of responses.

You can run the following to simply run up an existing build:
```bash
$ gulp offline-run
[13:38:56] Using gulpfile C:\GitHub\ui-cordova\www\manywho\runtime\gulpfile.js
[13:38:56] Starting 'offline'...
                                                                   @@@@
                                                                   @@@@
  @@@@   @@@@       @@@@@       @@@@    @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@@@@@@     @@@@@@
@@@@@@@@@@@@@@@  @@@@@@@@@@   @@@@@@@@  @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@@@@@@@  @@@@@@@@@@
@@@@ @@@@@ @@@@ @@@@    @@@@ @@@@@@@@@@ @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@  @@@@ @@@@    @@@@
@@@@ @@@@@ @@@@ @@@@    @@@@ @@@@  @@@@ @@@@  @@@@ @@@@ @@@@@ @@@@ @@@@  @@@@ @@@@    @@@@
@@@@ @@@@@ @@@@ @@@@@@@ @@@@ @@@@  @@@@ @@@@@@@@@@ @@@@@@@@@@@@@@@ @@@@  @@@@  @@@@@@@@@@
@@@@ @@@@@ @@@@   @@@@@ @@@@ @@@@  @@@@  @@@@@@@@@  @@@@@@ @@@@@@  @@@@  @@@@    @@@@@@
                                             @@@@@
                                           @@@@@@@
                                           @@@@@
[13:38:56] Starting 'offline-build'...
[13:38:56] Finished 'offline-build' after 6.08 ms
[13:38:56] Starting 'jshint'...
[13:38:56] Finished 'jshint' after 47 ms
[13:38:56] Starting 'less'...
[13:38:56] Finished 'less' after 46 ms
[13:38:56] Starting 'bootstrap'...
[13:38:56] Finished 'bootstrap' after 2.87 ms
[13:38:56] Starting 'bootstrap-templates'...
[13:38:56] Finished 'bootstrap-templates' after 1.83 ms
[13:38:56] Finished 'offline' after 136 ms
[?] Was this a PhoneGap build? (y/n) y
[?] Was this a debug build? (y/n) y
```

#### Extensions

If your offline build includes additional extension libraries, you can add those by adding them to the `js/config/extensions-{build}.json`. If this file doesn't exist you can create a new one. The format is as follows:

```json
[
    "js/vendor/signature_pad.min.js",
    "js/ui-signature-pad/signature-pad.js"
]
```

When running `gulp offline-build`, this will add the following references to your index.html and tools.html pages:

```html
<!-- Extensions -->
<script src="js/vendor/signature_pad.min.js"></script>
<script src="js/ui-signature-pad/signature-pad.js"></script>
<!-- Extensions -->
```

#### Making Flows Offline

There are four parts to making Flows offline:

1. Ensuring Outcome "Types" are consistent with behavior.
2. Recording the responses that result from a request.
3. Recording sequences that should be remembered for future playback. This is for data that you expect the user to edit.
4. Updating the data-sync configuration with any database specific or app specific settings.

Breaking that down a bit further, you need to do the following:

Run `gulp offline-run` as described above. Click on the **Clear Storage** button. Refresh the tools.html page again to be sure
there's not data being stored that's invalid.

##### **Outcome Types**: Make sure offline works similarly to online:

When building your Flow, you need to make sure your Outcomes are configured to simulate the correct behaviour. The Outcome "Type"
(or pageActionType in the Page metadata) can have a range of values, though for simplicity, here are our recommendations:

- **New**: Use this action type if the Outcome will create a "new" object. For example, if your Outcome is placed with a Table of objects, this will tell the offline UI that you're creating a new one. As a result, it will clear any existing object held in the cache so the page is correctly blank.
- **Edit**: Use this action type if the Outcome will allow the user to "edit" an object. For example, if the Outcome is placed with a Table (as above), this will tell the offline UI that it should cache the selected object and show it in any pages that follow.
- **Delete**: Use this action type if the Outcome will delete an object.

It's important that all changes to the application state made by the user are ignored while offline, unless that change is configured in a sequence. The sequences tell the offline engine which user actions should be remembered.

##### **Recording Responses**: Click through every path in the Flow:

1. Click on every outcome.
2. Click on every navigation item.

This will generate a cache of responses that can be used when the user is offline. Once you have completed this activity
for a particular Flow build, you need to do the following:

1. Click on **Update** button for the first text box (js/config/responses-{build}.js)
2. Open your js/config/responses-{build}.js file and replace the 'null' with the JSON.

This provides your offline UI with all of the responses that should be served to the offline user for all of the click paths you have navigated.

##### **Recording Sequences**: Record inputs from the user to that should be played back when next connected.

1. Click on the **Start Recording** link for the second text box (js/config/sequences-{build}.js)
2. Click on the Outcome button for the screen the user will enter data into.
3. Enter some data.
4. Click on the Outcome button that will save the data provided.
5. Click on the **Stop Recording** button.
6. Open your js/config/sequences-{build}.js file and replace the 'null' with the JSON.

This will have generated a sequence for a recording. Each time the user goes through the sequence of screens recorded, the
offline engine will record the data for later playback when the user is online. A few considerations with respect to sequences:

1. Your Flow must have `Allow the Flow to be moved to any Map Element in the flow` enabled (have a look in the Flow properties in the Draw tooling). This allows the sync technology to navigate the workflow on behalf of the user to replay the recorded sequences back when next online.
2. Recordings can be configured to `allowInterruptions`. This means if the user does not follow the exact click path, the recording will still be registered. By default, the user must follow the exact same Outcome/MapElements for the recording to be registered.
3. Multiple recordings can be managed in parallel is `allowInterruptions` is set to `true`.

##### **Configuring Data Sync**: Configure the how data is retrieved from the underlying database.

It's important to note that databases like Salesforce can return records in a random order. This means that the synchronization can
ignore records as it pages through the results. In order to get around this issue:

**Ordering**

1. Open the /js/config/data-sync-{build}.js file.
2. Find the "listFilter" property. This will have "limit": 250
3. Update the limit setting accordingly. The 250 means that the data synchronization will retrieve a maximum of 250 records for that table.
4. Add ordering to make sure the records are coming back in a consistent order. In the example below, the column is "Record ID" (have a look at the list of properties in the data synchronization entry. The ASC means the records should be ordered ascending (use DESC for descending).
```json
"listFilter": {
    "limit": 250,
    "orderByPropertyDeveloperName": "Record ID",
    "orderByDirectionType": "ASC"
}
```

**Chunk Size**

1. Find the "chunkSize" property. This will have "chunkSize": 10
2. Update the chunk size setting accordingly for your database. The 10 means that the data synchronization technology will get 10 records at a time for a single HTTP request until either all records or retrieved or the number of records hits the "limit" setting.

Repeat these settings for each data synchronization entry.


#### Offline Management

In order to allow users to manage their offline data, we have created two custom components that you can include in
your page layouts. This allows you to decide the best place in your Flow application where offline management should
appear to the end user. The two components are:

##### ComponentType: RECORDINGS
This provides the list of recorded sequences that the user can play back when online.

##### ComponentType: DATA_SYNC
This provides the list of data sources that should be synchronized before taking the Flow application offline.


#### Running

This is a standard Cordova structure. However, before running the app on Android, you will need to remove any `node_modules` references from the project when running with android:

Mac
```bash
$ cd www/manywho/runtime
$ mv node_modules ___node_modules
```

Windows
```bash
$ cd www/manywho/runtime
$ rename node_modules ___node_modules
```

This will stop Cordova from getting confused. If you need to rebuild your offline again using `gulp offline`, you'll need to rename this directory back again:

Mac
```bash
$ cd www/manywho/runtime
$ mv ___node_modules node_modules
```

Windows
```bash
$ cd www/manywho/runtime
$ rename ___node_modules node_modules
```

Now, finally, to run the app, do the following:

Android
```bash
$ cordova run android --emulator
```

iOS
```bash
$ cordova run ios --emulator
```

#### Debugging

When debugging your offline Flow applications, we recommend using the Chrome browser, with the Developer Tools open so you can see any log lines in the console. If you want to debug in the emulator, you can use iOS logs or Android `logcat`. 

To get Android `logcat` you can do the following on Mac:
```bash
$ brew install android-platform-tools
```

Once installed, you can run logcat to view console logs by simply typing:
```bash
$ adb logcat
```

## Contributing

Contribution are welcome to the project - whether they are feature requests, improvements or bug fixes! Refer to 
[CONTRIBUTING.md](CONTRIBUTING.md) for our contribution requirements.

## License

This service is released under the [MIT License](http://opensource.org/licenses/mit-license.php).
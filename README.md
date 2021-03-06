# ManyWho UI Cordova

Cordova container for running ManyWho flows as apps on mobile devices.

## Prerequisites

* [NodeJS](https://nodejs.org/en/)
* [Cordova](https://cordova.apache.org/)
* Xcode for iOS apps
* Android Studio / SDK for android apps

If you are unfamiliar with cordova and / or building mobile apps you should go through the really good cordova tutorial: https://cordova.apache.org/docs/en/latest/guide/cli/index.html

If you can get a cordova app running on an iOS or Android device / emulator then you are ready to go.

### Building

Make sure your flow is published before running the build.

```
npm install
npm run build
```

This will download the latest version of the UI assets and update `index.html` with the specified `tenant id`, `flow id` and `flow version id`.

If you choose to run the flow offline you will also be promted for a username and password.

The build command optionally accepts two arguments:
```
cdnBaseUrl [default - https://assets.manywho.com]
apiBaseUrl [default - https://flow.manywho.com]
```
example 
```
npm run build -- --apiBaseUrl="https://example.com" --cdnBaseUrl="https://example.com"
```
Alternatively, to use local dependencies:

* Install the dependencies for each ui-* project (consult their respective readme's for details)
* Run the watcher or a static build for each ui-* project, such that the `--build` switch points to the `www` directory in this project

### Running

Run using the standard cordova command line e.g.

```
cordova prepare android
cordova run android

cordova prepare ios
cordova run ios
```

The browersync plugin is included which will auto reload the app when changes to the assets are made, append `-- --live-reload` to enable this.

More details on available commands can be found [here](https://cordova.apache.org/docs/en/latest/reference/cordova-cli/)

## Contributing

Contributions are welcome to the project - whether they are feature requests, improvements or bug fixes! Refer to 
[CONTRIBUTING.md](CONTRIBUTING.md) for our contribution requirements.

## License

ui-cordova is released under our shared source license: https://manywho.com/sharedsource
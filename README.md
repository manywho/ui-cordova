# ManyWho UI Cordova

Cordova container for running ManyWho flows as apps on mobile devices.

## Prerequisites

* [NodeJS](https://nodejs.org/en/)
* [Cordova](https://cordova.apache.org/)
* Xcode for iOS apps
* Android Studio / SDK for android apps

If you are unfamiliar with cordova and / or building mobile apps you should go through the really good cordova tutorial: https://cordova.apache.org/docs/en/latest/guide/cli/index.html

If you can get a cordova app running on an iOS or Android device / emulator then you are ready to go.

## Usage

This project is a wrapper for the other UI projects, you will need to clone at least [ui-core](https://github.com/manywho/ui-core) and [ui-bootstrap](https://github.com/manywho/ui-bootstrap), and optionally [ui-offline](https://github.com/manywho/ui-offline).

### Building

* Install the dependencies for each ui-* project (consult their respective readme's for details)
* Run the watcher or a static build for each ui-* project, such that the `--build` switch points to the `www` directory in this project

Alternatively:

```
npm install
npm run prepare
```

This will download the latest version of the UI assets (excluding offline) and update `index.html` with the specified `tenant id`, `flow id` and `flow version id`.

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
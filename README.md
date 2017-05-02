# ManyWho UI Cordova

Cordova container for running ManyWho flows as apps on mobile devices.

## Usage

This project is a wrapper for the other UI projects, you will need to clone at least (ui-core)[https://github.com/manywho/ui-core] an (ui-bootstrap)[https://github.com/manywho/ui-bootstrap], and optionally (ui-offline)[https://github.com/manywho/ui-offline].

### Building

* Install the dependencies for each ui-* project (consult their respective readme's for details)
* Run the watcher or a static build for each ui-* project, such that the `--build` points to the `www` directory in this project

### Running

Run using the standard cordova command line e.g.

```
cordova prepare android
cordova run android

cordova prepare ios
cordova run ios
```

The browersync plugin is included which will auto reload the app when changes to the assets are made, append `-- --live-reload` to enable this.

More details on available commands can be found (here)[https://cordova.apache.org/docs/en/latest/reference/cordova-cli/]

## Contributing

Contributions are welcome to the project - whether they are feature requests, improvements or bug fixes! Refer to 
[CONTRIBUTING.md](CONTRIBUTING.md) for our contribution requirements.

## License

ui-cordova is released under our shared source license: https://manywho.com/sharedsource
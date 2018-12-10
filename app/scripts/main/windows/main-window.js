'use strict'


/**
 * Modules
 * Node
 * @constant
 */
const path = require('path')
const url = require('url')

/**
 * Modules
 * Electron
 * @constant
 */
const electron = require('electron')
const { app, BrowserWindow, shell } = electron

/**
 * Modules
 * External
 * @constant
 */
const appRootPath = require('app-root-path')['path']
const logger = require('@sidneys/logger')({ write: true })
const platformTools = require('@sidneys/platform-tools')


/**
 * Filesystem
 * @constant
 * @default
 */
const windowHtml = path.join(appRootPath, 'app', 'html', 'main.html')

/**
 * Application
 * @constant
 * @default
 */
const windowTitle = global.manifest.productName
const windowUrl = url.format({ protocol: 'file:', pathname: windowHtml })


/**
 * @class MainWindow
 * @extends Electron.BrowserWindow
 * @namespace Electron
 */
class MainWindow extends BrowserWindow {
    constructor() {
        super({
            acceptFirstMouse: true,
            autoHideMenuBar: true,
            // Hotfix: Window Translucency, https://github.com//electron/electron/issues/2170
            // backgroundColor: platformTools.isMacOS ? void 0 : '#95A5A6',
            backgroundColor: '#303030',
            frame: true,
            hasShadow: platformTools.isMacOS ? true : void 0,
            height: void 0,
            minHeight: 256,
            minWidth: 128,
            show: false,
            thickFrame: platformTools.isWindows ? true : void 0,
            title: windowTitle,
            titleBarStyle: platformTools.isMacOS ? 'hiddenInset' : void 0,
            // Hotfix: Window Translucency, https://github.com//electron/electron/issues/2170
            // transparent: true,
            transparent: false,
            // Hotfix: Crash on exit, https://github.com//electron/electron/issues/12726
            // vibrancy: platformTools.isMacOS ? 'dark' : void 0,
            vibrancy: void 0,
            webPreferences: {
                allowRunningInsecureContent: true,
                backgroundThrottling: true,
                experimentalCanvasFeatures: true,
                experimentalFeatures: true,
                nodeIntegration: true,
                partition: 'persist:app',
                scrollBounce: platformTools.isMacOS ? true : void 0,
                webaudio: true,
                webgl: false,
                webSecurity: false
            },
            width: void 0,
            x: void 0,
            y: void 0
        })

        this.init()
    }

    /**
     * Init
     */
    init() {
        logger.debug('init')

        /**
         * @listens MainWindow#close
         */
        this.on('close', (event) => {
            logger.debug('AppWindow#close')

            if (global.state.isQuitting === false) {
                event.preventDefault()
                this.hide()
            }
        })

        /**
         * @listens MainWindow#will-navigate
         */
        this.webContents.on('will-navigate', (event, url) => {
            logger.debug('AppWindow.webContents#will-navigate')

            if (url) {
                event.preventDefault()
                shell.openExternal(url)
            }
        })


        this.loadURL(windowUrl)
    }
}


/**
 * Init
 */
let init = () => {
    logger.debug('init')

    // Ensure single instance
    if (!global.mainWindow) {
        global.mainWindow = new MainWindow()
    }
}


/**
 * @listens Electron.App#on
 */
app.on('activate', () => {
    logger.debug('app#activate')

    global.mainWindow.show()
})

/**
 * @listens Electron.App#on
 */
app.once('ready', () => {
    logger.debug('app#ready')

    init()
})


/**
 * @exports
 */
module.exports = global.mainWindow

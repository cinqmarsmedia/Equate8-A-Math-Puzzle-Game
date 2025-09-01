const { app, BrowserWindow, Menu, ipcMain } = require("electron");
const path = require("path");


//paste all of user's local files in a folder called userdata, and enable this to reproduce their local state.
const debugUserData = false;
let showDevTools = false;

if (debugUserData) {
    app.setPath('userData', path.join(__dirname, "userdata"));
    showDevTools = true;
}
function createWindow() {
    const { screen } = require('electron')
    let { width, height } = screen.getPrimaryDisplay().workAreaSize;


app.commandLine.appendSwitch('enable-gpu-rasterization');
app.commandLine.appendSwitch('enable-zero-copy');
app.commandLine.appendSwitch('enable-gpu-compositing');
app.commandLine.appendSwitch('disable-background-timer-throttling');
app.commandLine.appendSwitch('disable-renderer-backgrounding');
app.commandLine.appendSwitch('disable-gpu-vsync');

app.commandLine.appendSwitch('enable-features', 'SharedArrayBuffer');

    const win = new BrowserWindow({
        width: Math.round(0.8 * width),
        height: Math.round(0.8 * height),
        minWidth: 800,
        minHeight: 500,
        frame: false,
        transparent: false,
        vibrancy: "menu",
        fullscreen: false,
        webPreferences: {
            nodeIntegration: false,
            webviewTag: true,
            sandbox: true,
            offscreen:false,
            webgl:true,
            hardwareAcceleration: true,
            contextIsolation: true,
            enableRemoteModule: false,
            preload: path.join(__dirname, "preload.js"),
        },
        fullscreen: false,
    });

    win.once("ready-to-show", () => {
        //win.webContents.setZoomFactor(defaultZoomFactor);
        win.setFullScreenable(true);
        win.setFullScreen(false);
    })

    if (showDevTools) {
        win.webContents.openDevTools();
    }

    let forceQuit = false;

    app.on("before-quit", (e) => {
        if (!forceQuit) {
            e.preventDefault();
        }
        setTimeout(() => {
            forceQuit = true;
            app.quit();
        }, 3000);
        if (win && typeof win === "object" && !win.isDestroyed() && win.webContents && win.webContents.send) {
            win.webContents.send("ONBEFOREQUIT")
        }
    });
    //win.webContents.openDevTools();

    ipcMain.on("FULLSCREEN", () => {
        // dialog.showMessageBox(null, win.isFullScreen());
        win.setFullScreen(!win.isFullScreen());
        
    });

    ipcMain.on("MINIMISE", () => {
        win.minimize();
    })

      ipcMain.on("OPENLINK", (event,link) => {
          console.log(link);
        const { shell } = require("electron");
        shell.openExternal(link);
    })

    ipcMain.on("QUIT", () => {
        forceQuit = false;
        app.quit();
    });

    ipcMain.on("FORCEQUIT", () => {
        forceQuit = true;
        app.quit();
    })

    ipcMain.on("ZOOM", (event, level) => {
        win.webContents.setZoomFactor(level);
    });


    const isMac = process.platform === "darwin";
    const template = [
        // { role: 'appMenu' }
        ...(isMac
            ? [
                {
                    label: app.name,
                    submenu: [
                        { role: "about" },
                        { type: "separator" },
                        { role: "services" },
                        { type: "separator" },
                        { role: "hide" },
                        { role: "hideothers" },
                        { role: "unhide" },
                        { type: "separator" },
                        { role: "quit" },
                    ],
                },
            ]
            : []),
        // { role: 'fileMenu' }
        {
            label: "File",
            submenu: [isMac ? { role: "close" } : { role: "quit" }],
        },
        // { role: 'editMenu' }
        // { role: 'viewMenu' }
        {
            label: "View",
            submenu: [{ role: "togglefullscreen" }],
        },
        // { role: 'windowMenu' }
        {
            label: "Window",
            submenu: [
                { role: "minimize" },
                ...(isMac
                    ? [
                        { type: "separator" },
                        { role: "front" },
                        { type: "separator" },
                        { role: "window" },
                    ]
                    : [{ role: "close" }]),
            ],
        },
        {
            role: "help",
            submenu: [
                {
                    label: "Learn More",
                    click: async () => {
                        const { shell } = require("electron");
                        await shell.openExternal("https://cinqmarsmedia.com");
                    },
                },
            ],
        },
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);

    win.setMenuBarVisibility(false);
    win.setMenu(null);

    win.loadFile("www/index.html");
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
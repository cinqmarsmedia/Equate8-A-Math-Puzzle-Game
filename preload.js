const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electron", {
    quit: () => {
        ipcRenderer.send("QUIT");
    },
    forceQuit: () => {
        ipcRenderer.send("FORCEQUIT");
    },
    fullscreen: () => {
        ipcRenderer.send("FULLSCREEN");
    },
    onBeforeQuit: () => {
        return new Promise((res) => {
            ipcRenderer.on("ONBEFOREQUIT", (event) => {
                res();
            });
        });
    },
    zoom: (level) => {
        ipcRenderer.send("ZOOM", level);
    },
    minimise: () => {
        ipcRenderer.send("MINIMISE");
    },
    openLink: (link) => {
        ipcRenderer.send("OPENLINK",link);
    },
});

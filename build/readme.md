    # building for electron
    
    npm run build
    export CSC_KEY_PASSWORD='xxxxxxxx'
    npm run build-mac
    node notarize.js
    npx electron-builder -wl --x64

    #Linux overlay fix
    mv dist/linux-unpacked/equate8 dist/linux-unpacked/bin
    cp equate8-linux dist/linux-unpacked/equate8

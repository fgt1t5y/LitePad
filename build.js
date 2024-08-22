import nwbuild from "nw-builder";

nwbuild({
  mode: "build",
  srcDir: "./dist",
  glob: false,
  managedManifest: {
    name: "litepad",
    main: "index.html",
    window: {
      id: "litepad-gui",
      title: "LitePad",
      position: "center",
      height: 660,
      width: 1060,
      min_height: 600,
      min_width: 800,
      icon: "./appicon.png",
    },
  },
});

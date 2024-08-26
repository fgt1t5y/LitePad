import nwbuild from "nw-builder";
import { copyFile } from "fs";

const build = () => {
  nwbuild({
    mode: "build",
    srcDir: "./dist",
    glob: false,
    flavor: "normal",
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
};

copyFile("package.json", "dist/package.json", (err) => {
  if (err) throw err;
  build();
});

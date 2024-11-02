import nwbuild from "nw-builder";
import { copyFile, existsSync } from "fs";

const build = () => {
  nwbuild({
    version: "0.91.0",
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
    app: {
      name: "LitePad",
    },
    zip: "zip",
  });
};

if (!existsSync("dist/")) {
  throw new Error("Please build app first.");
}

copyFile("package.json", "dist/package.json", (err) => {
  if (err) throw err;
  build();
});

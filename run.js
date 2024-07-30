import nwbuild from "nw-builder";

nwbuild({
  mode: "build",
  srcDir: ".",
  managedManifest: {
    name: "litepad_release",
    main: "index.html",
  },
});

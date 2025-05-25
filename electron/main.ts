import { app, BrowserWindow } from "electron";

const createMainWindow = () => {
  const win = new BrowserWindow({
    title: "LitePad",
    width: 1060,
    height: 660,
    minWidth: 800,
    minHeight: 600,
    icon: "public/appicon.png",
    center: true,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL);
  } else {
    win.loadFile("dist/index.html");
  }
};

app.whenReady().then(() => {
  createMainWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createMainWindow();
    }
  });
});

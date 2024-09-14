# LitePad

Litepad 是一个简单的、纯本地、富文本的笔记软件。

## 构建开发环境

克隆此项目：

```sh
git clone https://github.com/fgt1t5y/LitePad
```

完成后，进入项目目录：

```sh
cd LitePad
```

> ⚠️ 注意：此项目强制使用 `pnpm` 管理依赖，如果你还没有安装它，请运行 `corepack enable pnpm`。

安装项目依赖：

```sh
pnpm install
```

至此，你完成了开发环境的构建。接下来，执行你需要的操作的命令:

```sh
pnpm run <命令>
```

命令列表：

| 命令    | 说明                             |
| ------- | -------------------------------- |
| dev     | 启动开发服务器和 SDK 模式的 NWJS |
| dev:app | 仅启动开发服务器                 |
| dev:nw  | 仅启动 SDK 模式的 NWJS           |
| build   | 构建 App 并打包 NWJS             |
| dev:app | 仅构建 App                       |
| dev:nw  | 仅打包 NWJS                      |
| preview | 启动预览服务器（需要先构建 App） |

## 软件截图

![](/images/app.png)

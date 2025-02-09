# LitePad

LitePad 是一个跨平台、简单、纯本地、富文本的笔记软件。

此项目用于学习 ProseMirror 的设计模式、富文本编辑器的实现原理，以及笔记软件的开发实践。

## 技术点

**跨平台**：使用 [Electron](https://www.electronjs.org) 来实现跨平台。

**本地持久化**：使用 [Dexie](https://dexie.org/) 来操作本地 IndexedDB 数据库以存储笔记等数据。

**富文本编辑器**：基于 [ProseMirror](https://prosemirror.net) 封装实现。

**组件库**：使用 [PrimeVue](https://primevue.org/) 作为组件库用以用于提供基础组件。

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
| dev     | 启动开发服务器并启动 Electron    |
| build   | 构建 App 并打包 Electron         |
| preview | 启动预览服务器（需要先构建 App） |

## 软件截图

![](/images/app2.png)

<template>
  <div id="Root">
    <aside v-show="c.showAsidePanel" ref="leftPanelRef" id="LeftPanel">
      <div id="MainMenu">
        <button title="主菜单" @click="mainMenuRef!.show">
          <i class="i i-menu"></i>
        </button>
        <button title="隐藏侧栏" @click="c.showAsidePanel = false">
          <i class="i i-left-panel-close"></i>
        </button>
      </div>
      <Panel title="笔记本列表">
        <ListSelect v-model:items="s.notebooks" :active="c.lastNotebook" />
        <template #extra>
          <button title="新建笔记本" @click="s.modal.createNotebook = true">
            <i class="i i-add"></i>
          </button>
        </template>
      </Panel>
      <Panel title="笔记">
        <Tree
          :items="fileTreeNodes"
          v-model:expanded-items="s.tree.expanded"
          v-model:selected-items="s.tree.selected"
          v-model:highlighted-item="tabs.current"
          group-type="folder"
          @node-click="treeNodeClick"
          @node-contextmenu="treeNodeClick"
        />
        <template #extra>
          <button title="新建文件夹" @click="createFolder()">
            <i class="i i-folder-add"></i>
          </button>
          <button title="新建笔记" @click="createNote()">
            <i class="i i-note-add"></i>
          </button>
        </template>
      </Panel>
      <div
        class="ResizeHandle"
        ref="resizeHandleRef"
        title="按住左键以调整侧栏宽度"
      ></div>
    </aside>
    <main id="RightPanel">
      <PageTabs id="PageTab" v-model:tabs="tabs.tabs" ref="pageTabsRef">
        <template #header>
          <button
            v-show="!c.showAsidePanel"
            class="Tab AutoWidth"
            title="主菜单"
            @click="mainMenuRef!.show"
          >
            <i class="i i-menu"></i>
          </button>
          <button
            v-show="!c.showAsidePanel"
            class="Tab AutoWidth"
            title="显示侧栏"
            @click="c.showAsidePanel = true"
          >
            <i class="i i-left-panel-open"></i>
          </button>
        </template>
        <template #footer>
          <button class="Tab AutoWidth" title="新建笔记" @click="createNote()">
            <i class="i i-add"></i>
          </button>
        </template>
      </PageTabs>
      <div id="PageWrapper">
        <RouterView #default="{ Component, route }">
          <KeepAlive ref="keepAliveRef">
            <component :key="route.fullPath" :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </main>
  </div>
  <CreateNotebookModal
    v-model="s.modal.createNotebook"
    @submit="createNotebook"
  />
  <ContextMenu ref="contextMenuRef" :model="fileTreeContextMenuItems" />
  <ContextMenu ref="mainMenuRef" :model="mainMenuItems" popup />
</template>

<script setup lang="ts">
// Types
import type { MenuItem } from "primevue/menuitem";
import type { TreeItem, PageTabsItem, PatchedKeepAlive } from "@/types";
import type { ContextMenuMethods } from "primevue/contextmenu";

// Functions, methods, or vars
import { computed, onMounted, ref } from "vue";
import { db } from "@/db";
import { usePageTabs } from "@/utils/usePageTabs";
import { useElementResize } from "@/utils/useElementResize";
import { arrayToTree } from "performant-array-to-tree";
import { RouterView } from "vue-router";
import { useShared } from "@/utils/useShared";
import { useTheme } from "@/utils/useTheme";
import { useXScroll } from "@/utils/useXScroll";
import { useConfig } from "@/utils/useConfig";
import { emptyNotebook, emptyFolder, emptyNote } from "@/constant";

// Components
import PageTabs from "@/components/PageTabs.vue";
import Tree from "@/components/Tree.vue";
import Panel from "@/components/Panel.vue";
import ListSelect from "@/components/ListSelect.vue";
import CreateNotebookModal from "@/components/modal/CreateNotebook.vue";
import ContextMenu from "primevue/contextmenu";

const contextMenuRef = ref<ContextMenuMethods>();
const leftPanelRef = ref<HTMLElement>();
const resizeHandleRef = ref<HTMLDivElement>();
const keepAliveRef = ref<PatchedKeepAlive>();
const mainMenuRef = ref<ContextMenuMethods>();

const selectedTreeNode = ref<TreeItem>();

const s = useShared();

const c = useConfig();
c.load();
c.$subscribe(() => {
  c.save();
});

const tabs = usePageTabs();
tabs.init();
tabs.onTabClose((tab: PageTabsItem) => {
  keepAliveRef.value!.pruneCacheEntry(tab.path);
});

const { mode: themeMode, switchTo } = useTheme();

const loadNotebookList = async () => {
  s.notebooks = await db.notebooks.orderBy("id").toArray();
};

const loadNotebook = async (notebook_id?: number) => {
  if (!notebook_id || !Number.isInteger(notebook_id))
    throw new Error("Can't load notebook");

  s.folders = await db.folders
    .where("notebook_id")
    .equals(notebook_id)
    .toArray();
  s.notes = await db.notes.where("notebook_id").equals(notebook_id).toArray();
};

const toggleFolderNode = (folder_id: number) => {
  if (s.tree.expanded[folder_id]) s.tree.expanded[folder_id] = false;
  else s.tree.expanded[folder_id] = true;
};

const openNotePage = (id: number, label: string) => {
  const path = `/note/${id}`;
  const newTab = { id, label, path };

  tabs.push(newTab);
  tabs.to(newTab);
};

const treeNodeClick = (node: TreeItem, event: MouseEvent) => {
  selectedTreeNode.value = node;

  if (event.button === 2) {
    contextMenuRef.value!.show(event);
    return;
  }

  if (node.type === "folder") {
    toggleFolderNode(node.id);
    return;
  }

  if (node.type === "note") {
    openNotePage(node.id, node.title);
  }
};

const createNotebook = async (name: string, description: string) => {
  const notebook = emptyNotebook(name, description);
  const id = await db.notebooks.add(notebook);
  if (!id) return;

  s.notebooks.push(notebook);
};

const createFolder = async (folder_id?: number) => {
  const folder = emptyFolder(c.lastNotebook, folder_id);
  const id = await db.folders.add(folder);
  if (!id) return;

  s.folders.push(folder);
  toggleFolderNode(id);
};

const createNote = async (folder_id?: number) => {
  const note = emptyNote(c.lastNotebook, folder_id);
  const id = await db.notes.add(note);
  if (!id) return;

  s.notes.push(note);

  const newTab: PageTabsItem = {
    id,
    label: note.title,
    path: `/note/${id}`,
  };

  tabs.push(newTab);
  tabs.to(newTab);
  if (folder_id) {
    s.tree.expanded[folder_id] = true;
  }
};

const fileTreeNodes = computed(() => {
  if (!(s.folders && s.notes)) {
    return [];
  }

  const items = [...s.folders, ...s.notes];

  items.forEach((item: any) => {
    item.label = item.title || item.name;
  });

  return arrayToTree(items, {
    parentId: "folder_id",
    dataField: null,
  }) as TreeItem[];
});

const fileTreeContextMenuItems = computed<MenuItem[]>(() => {
  if (selectedTreeNode.value?.type === "note") {
    return [
      {
        label: "打开",
        command: () => {
          const { id, title } = selectedTreeNode.value!;
          openNotePage(id, title);
        },
      },
      {
        label: "删除",
      },
    ];
  } else {
    return [
      {
        label: "新笔记",
        command: () => {
          const folder_id = selectedTreeNode.value!.id;
          if (folder_id) {
            createNote(folder_id);
          }
        },
      },
      {
        label: "新文件夹",
        command: () => {
          const folder_id = selectedTreeNode.value!.id;
          if (folder_id) {
            createFolder(folder_id);
          }
        },
      },
      {
        label: "删除",
      },
    ];
  }
});

const mainMenuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: "设置",
    },
    {
      label: "主题模式",
      items: [
        {
          label: "跟随系统",
          disabled: themeMode.value === "auto",
          command() {
            switchTo("auto");
          },
        },
        {
          label: "浅色模式",
          disabled: themeMode.value === "light",
          command() {
            switchTo("light");
          },
        },
        {
          label: "深色模式",
          disabled: themeMode.value === "dark",
          command() {
            switchTo("dark");
          },
        },
      ],
    },
  ];
});

onMounted(() => {
  loadNotebookList();
  loadNotebook(c.lastNotebook);

  useElementResize(resizeHandleRef.value!, leftPanelRef.value!, {
    min: 250,
    max: 700,
    onLessThanMin: () => (c.showAsidePanel = false),
    onGreaterThanMin: () => (c.showAsidePanel = true),
  });

  // 标签页多到溢出时可用鼠标滚轮滚动X轴
  useXScroll(document.getElementById("PageTab")!);
});
</script>

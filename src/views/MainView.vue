<template>
  <div id="Root">
    <aside ref="leftPanelRef" id="LeftPanel">
      <div id="MainMenu">
        <button>
          <i class="i i-menu"></i>
        </button>
        <button>
          <i class="i i-left-panel-close"></i>
        </button>
      </div>
      <Panel title="笔记本列表">
        <ListSelect v-model:items="notebookList" :active="currentNotebook!" />
        <template #extra>
          <button
            title="新建笔记本"
            @click="d.modalVisible.createNotebook = true"
          >
            <i class="i i-add"></i>
          </button>
        </template>
      </Panel>
      <Panel title="笔记">
        <Tree
          :items="fileTreeNodes"
          v-model:expanded-items="expandedItems"
          v-model:selected-items="selectedItems"
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
        title="按住左键以调整边栏宽度"
      ></div>
    </aside>
    <main id="RightPanel">
      <PageTabs v-model:tabs="tabs.tabs" ref="pageTabsRef">
        <template #footer>
          <button id="AddTab" @click="createNote()">
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
    v-model="d.modalVisible.createNotebook"
    @success="loadNotebookList"
  />
  <ContextMenu ref="contextMenuRef" :model="fileTreeContextMenu" />
</template>

<script setup lang="ts">
// Types
import type { MenuItem } from "primevue/menuitem";
import type {
  Folder,
  Notebook,
  Note,
  TreeItem,
  IDs,
  PageTabsItem,
  PatchedKeepAlive,
} from "@/types";
import type { ContextMenuMethods } from "primevue/contextmenu";

// Functions or methods
import { computed, onMounted, ref } from "vue";
import { db, rest } from "@/db";
import { usePageTabs } from "@/utils/usePageTabs";
import { useElementResize } from "@/utils/useElementResize";
import { arrayToTree } from "performant-array-to-tree";
import { RouterView } from "vue-router";
import { useShared } from "@/utils/useShared";

// Components
import PageTabs from "@/components/PageTabs.vue";
import Tree from "@/components/Tree.vue";
import Panel from "@/components/Panel.vue";
import ListSelect from "@/components/ListSelect.vue";
import CreateNotebookModal from "@/components/modal/CreateNoteModal.vue";

const contextMenuRef = ref<ContextMenuMethods>();
const leftPanelRef = ref<HTMLElement>();
const resizeHandleRef = ref<HTMLDivElement>();
const keepAliveRef = ref<PatchedKeepAlive>();

const expandedItems = ref<IDs>({});
const selectedItems = ref<IDs>({});
const selectedTreeNode = ref<TreeItem>();
const notebookList = ref<Notebook[]>([]);
const folderList = ref<Folder[]>([]);
const noteList = ref<Note[]>([]);
const currentNotebook = ref<number>();

const d = useShared();
d.init();

const tabs = usePageTabs();
tabs.init();
tabs.onTabClose((tab: PageTabsItem) => {
  keepAliveRef.value!.pruneCacheEntry(tab.path);
});

const loadNotebookList = async () => {
  notebookList.value = await db.notebooks.orderBy("id").toArray();
};

const loadNotebook = async (notebook_id: number | null) => {
  if (!notebook_id || !Number.isInteger(notebook_id)) return;

  folderList.value = await db.folders
    .where("notebook_id")
    .equals(notebook_id)
    .toArray();
  noteList.value = await db.notes
    .where("notebook_id")
    .equals(notebook_id)
    .toArray();
};

const toggleFolderNode = (folder_id: number) => {
  if (expandedItems.value[folder_id]) expandedItems.value![folder_id] = false;
  else expandedItems.value![folder_id] = true;
};

const openNotePage = (id: number, label: string) => {
  const path = `/note/${id}`;
  const newTab = { id, label, path };

  tabs.push(newTab);
  tabs.to(newTab);
};

const treeNodeClick = (node: TreeItem, event: MouseEvent) => {
  selectedTreeNode.value = node;
  selectedItems.value = { [node.id]: true };

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

const createFolder = async (folder_id?: number) => {
  const folder = {
    notebook_id: currentNotebook.value!,
    folder_id: folder_id,
    name: "新文件夹",
    type: "folder",
    ...rest(),
  };
  const id = await db.folders.add(folder);

  if (id) {
    folderList.value.push(folder);
    toggleFolderNode(id);
  }
};

const createNote = async (folder_id?: number) => {
  const note: Note = {
    notebook_id: currentNotebook.value!,
    folder_id: folder_id,
    title: "新笔记",
    type: "note",
    content: "<p></p>",
    labels: [],
    ...rest(),
  };

  const id = await db.notes.add(note);

  if (id) {
    noteList.value.push(note);

    const newTab: PageTabsItem = {
      id,
      label: note.title,
      path: `/note/${id}`,
    };

    tabs.push(newTab);
    tabs.to(newTab);
    if (folder_id) {
      expandedItems.value![folder_id] = true;
    }
  }
};

const fileTreeNodes = computed(() => {
  if (!(folderList.value && noteList.value)) {
    return [];
  }

  const items = [...folderList.value, ...noteList.value];

  items.forEach((item: any) => {
    item.label = item.title || item.name;
  });

  return arrayToTree(items, {
    parentId: "folder_id",
    dataField: null,
  }) as TreeItem[];
});

const fileTreeContextMenu = computed<MenuItem[]>(() => {
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

onMounted(() => {
  currentNotebook.value = d.state.lastNotebook;
  loadNotebookList();
  loadNotebook(currentNotebook.value!);

  useElementResize(resizeHandleRef.value!, leftPanelRef.value!);
});
</script>

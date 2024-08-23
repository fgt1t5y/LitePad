<template>
  <div id="Root">
    <aside ref="leftPanelRef" id="LeftPanel">
      <Panel v-model:open="expandNotebookList" title="笔记本列表">
        <ListSelect v-model:items="notebookList" :active="currentNotebook!" />
        <template #extra>
          <button
            title="新建笔记本"
            @click.stop="showCreateNotebookModel = true"
          >
            <i class="pi pi-plus"></i>
          </button>
        </template>
      </Panel>
      <Panel v-model:open="expandFileTree" title="笔记" flex-grow>
        <Tree
          :items="fileTreeNodes"
          :icon-map="fileTreeIconMap"
          v-model:expanded-items="expandedItems"
          v-model:selected-items="selectedItems"
          v-model:highlighted-item="currentPageID"
          @node-click="treeNodeClick"
        />
        <template #extra>
          <button title="新建文件夹">
            <i class="pi pi-folder-plus"></i>
          </button>
          <button title="新建笔记" @click.stop="createNewNote">
            <i class="pi pi-file-plus"></i>
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
      <PageTabs
        v-if="tabs"
        v-model:tabs="tabs.tabs"
        v-model:current-tab="currentPageID"
        ref="pageTabsRef"
        @tab-click="tabClick"
      ></PageTabs>
      <div id="PageWrapper">
        <RouterView #default="{ Component, route }">
          <KeepAlive>
            <component :key="route.fullPath" :is="Component" />
          </KeepAlive>
        </RouterView>
      </div>
    </main>
  </div>
  <CreateNotebookModal
    v-model="showCreateNotebookModel"
    @success="loadNotebookList"
  />
  <ContextMenu ref="contextMenuRef" :model="fileTreeContextMenu" />
</template>

<script setup lang="ts">
import "@/styles/Default.css";

import type { MenuItem } from "primevue/menuitem";
import type {
  Folder,
  Notebook,
  Note,
  PageTabsItem,
  TreeItem,
  IDs,
} from "@/types";
import type { ContextMenuMethods } from "primevue/contextmenu";

import { computed, onMounted, ref } from "vue";
import { db } from "@/db";
import { get } from "@/utils/helpers";
import { usePageTabs } from "@/utils/usePageTabs";
import { useElementResize } from "@/utils/useElementResize";
import { arrayToTree } from "performant-array-to-tree";
import CreateNotebookModal from "@/components/modal/CreateNoteModal.vue";
import { RouterView, useRouter } from "vue-router";

import PageTabs from "@/components/PageTabs.vue";
import Tree from "@/components/Tree.vue";
import Panel from "@/components/Panel.vue";
import ListSelect from "@/components/ListSelect.vue";

const contextMenuRef = ref<ContextMenuMethods>();
const leftPanelRef = ref<HTMLElement>();
const resizeHandleRef = ref<HTMLDivElement>();

const expandedItems = ref<IDs>({});
const selectedItems = ref<IDs>({});
const selectedTreeNode = ref<TreeItem>();
const notebookList = ref<Notebook[]>([]);
const folderList = ref<Folder[]>([]);
const noteList = ref<Note[]>([]);
const currentNotebook = ref<number>();
const currentPageID = ref<number | null>(null);

const showCreateNotebookModel = ref<boolean>(false);
const expandNotebookList = ref<boolean>(true);
const expandFileTree = ref<boolean>(true);

const fileTreeIconMap = {
  folder: "pi pi-folder",
  note: "pi pi-file",
};

const router = useRouter();
const tabs = usePageTabs();

const loadNotebookList = async () => {
  const notebooks = await db.notebooks.orderBy("id").toArray();
  notebookList.value = notebooks;
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

const treeNodeClick = (node: TreeItem, event: MouseEvent) => {
  selectedTreeNode.value = node;
  selectedItems.value = { [node.id]: true };

  if (event.button === 2) {
    contextMenuRef.value!.show(event);
    return;
  }

  if (node.type === "folder") {
    if (expandedItems.value[node.id]) {
      expandedItems.value![node.id] = false;
      return;
    }
    expandedItems.value![node.id] = true;
    return;
  }

  if (node.type === "note") {
    const path = `/note/${node.id}`;

    tabs.push({
      id: node.id,
      label: node.title,
      path: path,
    });
    currentPageID.value = node.id;
    router.replace(path);

    return;
  }
};

const tabClick = (tab: PageTabsItem) => {
  currentPageID.value = tab.id;
  router.replace(tab.path);
};

const createNewNote = () => {
  const note: Note = {
    notebook_id: currentNotebook.value || 1,
    folder_id: undefined,
    title: "新笔记",
    type: "note",
    content: "<p></p>",
    preview: "",
    labels: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  db.notes.add(note).then(() => {
    noteList.value.push(note);
  });
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
      },
      {
        label: "删除",
      },
    ];
  } else {
    return [
      {
        label: "新笔记",
      },
      {
        label: "新文件夹",
      },
      {
        label: "删除",
      },
    ];
  }
});

onMounted(() => {
  const lastNotebook = Number(get("LP_LAST_NOTEBOOK"));
  currentNotebook.value = Number.isInteger(lastNotebook) ? lastNotebook : 1;
  loadNotebookList();
  loadNotebook(currentNotebook.value);

  useElementResize(resizeHandleRef.value!, leftPanelRef.value!);
});
</script>

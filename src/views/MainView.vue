<template>
  <div id="RootPanel">
    <div id="LeftPanel">
      <Panel title="笔记本列表">
        <ListSelect v-model:items="notebookList" :active="currentNotebook!" />
      </Panel>
      <div class="Padding">
        <Button icon="pi pi-plus" size="small" label="新笔记" raised></Button>
      </div>
      <Tree
        :items="fileTreeNodes"
        :icon-map="fileTreeIconMap"
        v-model:expanded-items="expandedItems"
        v-model:selected-items="selectedItems"
        @node-click="nodeSelect"
      />
    </div>
    <div id="RightPanel">
      <PageTabs v-if="tabs" v-model:tabs="tabs"></PageTabs>
      <RouterView #default="{ Component }">
        <KeepAlive>
          <component :is="Component" />
        </KeepAlive>
      </RouterView>
    </div>
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
import { computed, onMounted, ref } from "vue";
import { db } from "@/db";
import type { Folder, Notebook, Note, TabsItem, TreeItem, IDs } from "@/types";
import { get } from "@/utils/helpers";
import { arrayToTree } from "performant-array-to-tree";
import CreateNotebookModal from "@/components/modal/CreateNoteModal.vue";
import { RouterView } from "vue-router";

import PageTabs from "@/components/PageTabs.vue";
import Tree from "@/components/Tree.vue";
import Panel from "@/components/Panel.vue";
import ListSelect from "@/components/ListSelect.vue";

const contextMenuRef = ref();

const expandedItems = ref<IDs>({});
const selectedItems = ref<IDs>({});
const selectedTreeNode = ref<TreeItem>();
const notebookList = ref<Notebook[]>();
const folderList = ref<Folder[]>();
const noteList = ref<Note[]>();
const currentNotebook = ref<number>();
const tabs = ref<TabsItem[]>([
  {
    key: 1,
    label: "欢迎",
    path: "/",
  },
]);

const showCreateNotebookModel = ref<boolean>(false);

const fileTreeIconMap = {
  folder: "pi pi-folder",
  note: "pi pi-file",
};

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

const nodeSelect = (node: TreeItem) => {
  selectedTreeNode.value = node;
  selectedItems.value = { [node.id]: true };
  if (expandedItems.value[node.id]) {
    expandedItems.value![node.id] = false;
    return;
  }
  expandedItems.value![node.id] = true;
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
        label: "新建",
        items: [
          {
            label: "笔记",
          },
          {
            label: "文件夹",
          },
        ],
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
});
</script>

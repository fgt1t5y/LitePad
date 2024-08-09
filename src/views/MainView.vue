<template>
  <div id="RootPanel">
    <div id="LeftPanel" class="Panel">
      <ContextMenu ref="contextMenuRef" :model="fileTreeContextMenu" />
      <div class="Padding">
        <Select
          :model-value="currentNotebook"
          :options="notebookList"
          option-label="name"
          option-value="name"
          placeholder="选择笔记本"
          variant="filled"
          fluid
        ></Select>
      </div>
      <TreePro
        :items="fileTreeNodes"
        :icon-map="fileTreeIconMap"
        v-model:expanded-items="expandedItems"
        v-model:selected-items="selectedItems"
        @node-click="nodeSelect"
      />
    </div>
    <div id="RightPanel">
      <Tabs v-if="tabs" v-model:tabs="tabs"></Tabs>
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
</template>

<script setup lang="ts">
import "@/styles/Default.css";
import type { MenuItem } from "primevue/menuitem";
import { computed, onMounted, ref } from "vue";
import { db } from "@/db";
import type { Folder, Notebook, Note, TabsItem, TreeItem, IDs } from "@/types";
import { get } from "@/utils/helpers";
import { useToast } from "primevue/usetoast";
import { arrayToTree } from "performant-array-to-tree";
import CreateNotebookModal from "@/components/modal/CreateNoteModal.vue";
import Tabs from "@/components/Tabs.vue";
import { RouterView } from "vue-router";
import TreePro from "@/components/TreePro.vue";

const toast = useToast();

const contextMenuRef = ref();

const expandedItems = ref<IDs>({});
const selectedItems = ref<IDs>({});
const selectedTreeNode = ref<TreeItem>();
const notebookList = ref<Notebook[]>();
const folderList = ref<Folder[]>();
const noteList = ref<Note[]>();
const currentNotebook = ref<string | null>(get("LP_NOTEBOOK"));
const tabs = ref<TabsItem[]>([]);

const showCreateNotebookModel = ref<boolean>(false);

const fileTreeIconMap = {
  folder: "pi pi-folder",
  note: "pi pi-file",
};

const loadNotebookList = async () => {
  const notebooks = await db.notebooks.orderBy("id").toArray();
  notebookList.value = notebooks;
};

const loadNotebook = async (name: string | null) => {
  if (!name) return;

  folderList.value = await db.folders.toArray();
  noteList.value = await db.notes.toArray();
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

const nodeClick = (node: TreeItem, e: MouseEvent) => {
  selectedTreeNode.value = node;
  if (e.button === 2) contextMenuRef.value.show(e);
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
  loadNotebookList();
  loadNotebook(currentNotebook.value);
});
</script>

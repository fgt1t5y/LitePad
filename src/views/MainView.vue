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
        />
      </div>
      <div>
        <Tree
          v-if="fileTreeNodes.length"
          id="FileTree"
          selectionMode="single"
          :value="fileTreeNodes"
          v-model:selectionKeys="selectionKeys"
          v-model:expandedKeys="expandedKeys"
          @node-select="nodeSelect"
          @node-unselect="nodeSelect"
          @contextmenu="$event.preventDefault()"
        >
          <template #default="{ node }">
            <div @mouseup="(e) => nodeClick(node, e)">
              {{ node.label }}
            </div>
          </template>
          <template #nodeicon="{ node }">
            <i v-if="node.type === 'folder'" class="pi pi-folder"></i>
            <i v-else class="pi pi-file"></i>
          </template>
        </Tree>
        <div v-else class="Padding VGap">
          <Skeleton width="100%" height="36px"></Skeleton>
          <Skeleton width="100%" height="36px"></Skeleton>
          <Skeleton width="100%" height="36px"></Skeleton>
        </div>
      </div>
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
import type { TreeNode } from "primevue/treenode";
import type { TreeSelectionKeys, TreeExpandedKeys } from "primevue/tree";
import { computed, onMounted, ref } from "vue";
import { db } from "@/db";
import type { Folder, Notebook, Note, TabsItem } from "@/types";
import { get } from "@/utils/helpers";
import { useToast } from "primevue/usetoast";
import { arrayToTree } from "performant-array-to-tree";
import CreateNotebookModal from "@/components/modal/CreateNoteModal.vue";
import Tabs from "@/components/Tabs.vue";
import { RouterView } from "vue-router";

const toast = useToast();

const contextMenuRef = ref();

const selectionKeys = ref<TreeSelectionKeys>();
const expandedKeys = ref<TreeExpandedKeys>({});
const selectedTreeNode = ref<TreeNode>();
const notebookList = ref<Notebook[]>();
const folderList = ref<Folder[]>();
const noteList = ref<Note[]>();
const currentNotebook = ref<string | null>(get("LP_NOTEBOOK"));
const tabs = ref<TabsItem[]>([]);

const showCreateNotebookModel = ref<boolean>(false);

const loadNotebookList = async () => {
  const notebooks = await db.notebooks.orderBy("id").toArray();
  notebookList.value = notebooks;
};

const loadNotebook = async (name: string | null) => {
  if (!name) return;

  folderList.value = await db.folders.toArray();
  noteList.value = await db.notes.toArray();
};

const nodeSelect = (node: TreeNode) => {
  selectedTreeNode.value = node;
  if (expandedKeys.value[node.key]) {
    expandedKeys.value![node.key] = false;
    return;
  }
  expandedKeys.value![node.key] = true;
};

const nodeClick = (node: TreeNode, e: MouseEvent) => {
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
    item.key = item.id;
  });

  return arrayToTree(items, {
    parentId: "folder_id",
    dataField: null,
  }) as TreeNode[];
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

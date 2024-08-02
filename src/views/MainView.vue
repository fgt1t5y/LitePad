<template>
  <Menubar id="Menubar" :model="menubarItems" />
  <div id="RootPanel">
    <div id="LeftPanel" class="Panel">
      <ContextMenu ref="menuRef" :model="fileTreeContextMenu" />
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
      <Tree
        id="FileTree"
        selectionMode="single"
        :value="nodes"
        v-model:selectionKeys="selectionKeys"
        v-model:expandedKeys="expandedKeys"
        @node-select="selectNode"
        @node-unselect="selectNode"
        @contextmenu="$event.preventDefault()"
      >
        <template #default="{ node }">
          <div @mouseup="(e) => nodeClick(node, e)">{{ node.label }}</div>
        </template>
      </Tree>
    </div>
    <div id="RightPanel"></div>
  </div>
  <CreateNotebookModal
    v-model="showCreateNotebookModel"
    @success="loadNotebooks"
  />
  <Toast />
</template>

<script setup lang="ts">
import "@/styles/Default.css";
import { useTheme } from "@/services/theme";
import type { MenuItem } from "primevue/menuitem";
import type { TreeNode } from "primevue/treenode";
import type { TreeSelectionKeys, TreeExpandedKeys } from "primevue/tree";
import { ref } from "vue";
import { db } from "@/db";
import type { Notebook } from "@/types";
import { get } from "@/utils/helpers";
import { useToast } from "primevue/usetoast";
import CreateNotebookModal from "@/components/modal/CreateNoteModal.vue";

const { switchTo } = useTheme();
const toast = useToast();

const menuRef = ref();

const selectionKeys = ref<TreeSelectionKeys>();
const expandedKeys = ref<TreeExpandedKeys>({});
const selectedTreeNode = ref<TreeNode>();
const notebookList = ref<Notebook[]>();
const currentNotebook = ref<string | null>(get("LP_NOTEBOOK"));

const showCreateNotebookModel = ref<boolean>(false);

const loadNotebooks = async () => {
  const notebooks = await db.notebooks.orderBy("id").toArray();
  notebookList.value = notebooks;
};

loadNotebooks();

const onCreateNotebookClick = () => {};

const selectNode = (node: TreeNode) => {
  if (expandedKeys.value[node.key]) {
    expandedKeys.value![node.key] = false;
    return;
  }
  expandedKeys.value![node.key] = true;
};

const nodeClick = (node: TreeNode, e: MouseEvent) => {
  selectedTreeNode.value = node;
  if (e.button === 2) menuRef.value.show(e);
};

const menubarItems = ref<MenuItem[]>([
  {
    label: "新建",
    icon: "pi pi-plus",
    items: [
      {
        label: "笔记",
      },
      {
        label: "文件夹",
      },
      {
        label: "笔记本",
        command: () => {
          showCreateNotebookModel.value = true;
        },
      },
    ],
  },
  {
    label: "快速调试",
    items: [
      {
        label: "浅色主题",
        command: () => switchTo("light"),
      },
      {
        label: "暗色主题",
        command: () => switchTo("dark"),
      },
    ],
  },
]);

const fileTreeContextMenu = ref([
  {
    label: "View",
  },
  {
    label: () => "Delete",
  },
]);

const nodes = ref([
  {
    key: "0",
    label: "Documents",
    icon: "pi pi-fw pi-inbox",
    children: [
      {
        key: "0-0",
        label: "Work",
        icon: "pi pi-fw pi-cog",
        children: [
          {
            key: "0-0-0",
            label: "Expenses.doc",
            icon: "pi pi-fw pi-file",
          },
          {
            key: "0-0-1",
            label: "Resume.doc",
            icon: "pi pi-fw pi-file",
          },
        ],
      },
      {
        key: "0-1",
        label: "Home",
        icon: "pi pi-fw pi-home",
        children: [
          {
            key: "0-1-0",
            label: "Invoices.txt",
            icon: "pi pi-fw pi-file",
          },
        ],
      },
    ],
  },
]);
</script>

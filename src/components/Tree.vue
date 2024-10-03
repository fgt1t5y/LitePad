<template>
  <div class="Tree">
    <TreeNode
      v-for="item of items"
      :key="item.id"
      :items="item"
      :level="0"
      :expanded-items="expandedItems"
      :selected-items="selectedItems"
      :highlighted-item="highlightedItem"
      :renaming-item="renamingItem"
      :group-type="groupType"
      :prev-path="item[labelField]"
      :label-field="labelField"
      @node-click="onNodeClick"
      @node-drag="onNodeDrag"
      @rename="onRename"
    />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, TreeDnDStat, IDs } from "@/types";

import TreeNode from "./TreeNode.vue";
import { provide, watch } from "vue";

defineOptions({
  name: "Tree",
});

const props = defineProps<{
  items: TreeItem[];
  groupType: string;
  labelField: string;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
  (e: "node-move", from: number, to: number): void;
  (e: "rename", newName: string, origin: string): void;
}>();

provide<TreeDnDStat>("dnd", {
  startId: undefined,
  endId: undefined,
  startEl: undefined,
  endEl: undefined,
});

const expandedItems = defineModel<IDs>("expandedItems", {
  default: {},
});
const selectedItems = defineModel<IDs>("selectedItems", {
  default: {},
});
const highlightedItem = defineModel<number>("highlightedItem");
const renamingItem = defineModel<number>("renamingItem");

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};

const onRename = (newName: string, origin: string) => {
  emits("rename", newName, origin);
};

const onNodeDrag = (from: number, to: number) => {
  emits("node-move", from, to);
};

watch(
  () => renamingItem.value,
  (id) => {
    if (!id) return;
    // 聚焦到重命名的输入框
    let t = window.setTimeout(() => {
      const input = document.getElementById(
        `Renaming_${id}`
      ) as HTMLInputElement;
      input?.select();
      window.clearTimeout(t);
    }, 20);
  }
);
</script>

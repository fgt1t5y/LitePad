<template>
  <div class="Tree">
    <TreeNode
      v-for="item of items"
      :key="item.id"
      :items="item"
      :level="0"
      :expanded-items="expandedItems || {}"
      :selected-items="selectedItems || {}"
      :highlighted-item="highlightedItem || -1"
      :group-type="groupType"
      :prev-path="item.label"
      @node-click="onNodeClick"
      @node-contextmenu="onNodeContextmenu"
    />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, IDs } from "@/types";
import TreeNode from "./TreeNode.vue";

defineOptions({
  name: "Tree",
});

const props = defineProps<{
  items: TreeItem[];
  groupType: string;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
  (e: "node-contextmenu", node: TreeItem, event: MouseEvent): void;
}>();

const expandedItems = defineModel<IDs>("expandedItems");
const selectedItems = defineModel<IDs>("selectedItems");
const highlightedItem = defineModel<number | null>("highlightedItem");

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};

const onNodeContextmenu = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-contextmenu", node, event);
};
</script>

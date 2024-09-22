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
      @node-contextmenu="onNodeContextenu"
      @node-move="onNodeMove"
    />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, IDs, TreeDnDStat } from "@/types";
import TreeNode from "./TreeNode.vue";
import { provide, ref } from "vue";

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
  (e: "node-move", from: number, to: number): void;
}>();

const expandedItems = defineModel<IDs>("expandedItems");
const selectedItems = defineModel<IDs>("selectedItems");
const highlightedItem = defineModel<number | null>("highlightedItem");

const dndStat = ref<TreeDnDStat>({});

provide("tree_dnd", dndStat);

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};

const onNodeContextenu = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-contextmenu", node, event);
};

const onNodeMove = (from: number, to: number) => {
  emits("node-move", from, to);
};
</script>

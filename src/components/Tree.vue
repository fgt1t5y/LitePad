<template>
  <div class="Tree">
    <ul class="TreeRoot">
      <TreeNode
        v-for="item of items"
        :key="item.id"
        :items="item"
        :level="0"
        :icon-map="iconMap"
        :expanded-items="expandedItems || {}"
        :selected-items="selectedItems || {}"
        :highlighted-item="highlightedItem || -1"
        :group-type="groupType"
        @node-click="onNodeClick"
        @node-contextmenu="onNodeContext"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, IDs, IconMap, TreeDnDStat } from "@/types";
import TreeNode from "./TreeNode.vue";
import { provide, ref } from "vue";

defineOptions({
  name: "Tree",
});

const props = defineProps<{
  items: TreeItem[];
  iconMap: IconMap;
  groupType: string;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
  (e: "node-contextmenu", node: TreeItem, event: MouseEvent): void;
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

const onNodeContext = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-contextmenu", node, event);
};
</script>

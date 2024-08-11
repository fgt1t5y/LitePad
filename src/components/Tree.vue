<template>
  <div class="Tree" @contextmenu="$event.preventDefault()">
    <ul class="TreeRoot" data-root="true">
      <TreeNode
        v-for="item of items"
        :items="item"
        :level="0"
        :icon-map="iconMap"
        :expanded-items="expandedItems || {}"
        :selected-items="selectedItems || {}"
        @node-click="onNodeClick"
      />
    </ul>
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, IDs, IconMap } from "@/types";
import TreeNode from "./TreeNode.vue";

defineOptions({
  name: "TreePro",
});

const props = defineProps<{
  items: TreeItem[];
  iconMap: IconMap;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
}>();

const expandedItems = defineModel<IDs>("expandedItems");
const selectedItems = defineModel<IDs>("selectedItems");

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};
</script>

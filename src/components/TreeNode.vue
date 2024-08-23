<template>
  <li
    :class="{ TreeLeaf: !hasChildren, TreeNodeActive: items.id === highlightedItem }"
    :title="items.label"
  >
    <button class="TreeNode" @mouseup="emits('node-click', items, $event)">
      <i v-if="expanded" class="pi pi-angle-down"></i>
      <i v-else class="pi pi-angle-right"></i>
      <i :class="iconMap[items.type!]"></i>
      <span>{{ getLabel() }}</span>
    </button>
  </li>
  <ul v-if="expanded && hasChildren" class="TreeChildren">
    <TreeNode
      v-for="item of items.children"
      :key="item.id"
      :items="item"
      :level="level + 1"
      :icon-map="iconMap"
      :expanded-items="expandedItems || {}"
      :selected-items="selectedItems || {}"
      :highlighted-item="highlightedItem"
      @node-click="onNodeClick"
    />
  </ul>
</template>

<script setup lang="ts">
import type { TreeItem, IDs, IconMap } from "@/types";
import { computed } from "vue";

defineOptions({
  name: "TreeNode",
});

const props = defineProps<{
  items: TreeItem;
  level: number;
  expandedItems: IDs;
  selectedItems: IDs;
  highlightedItem: number | null;
  iconMap: IconMap;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
}>();

const getLabel = () => {
  if (typeof props.items === "object") {
    return props.items.label;
  }
};

const expanded = computed(() => {
  return props?.expandedItems[props?.items.id] === true;
});

const hasChildren = computed(() => {
  return props?.items && props?.items?.children?.length! > 0;
});

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};
</script>

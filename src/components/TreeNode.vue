<template>
  <li
    :class="{
      TreeLeaf: !isGroup,
      TreeGroup: isGroup,
      Active: items.id === highlightedItem,
    }"
    :title="items.label"
    :data-id="items.id"
    :data-type="items.type"
    draggable="true"
    @contextmenu="emits('node-contextmenu', items, $event)"
    @dragstart="onDragStart"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @drop="onDrop"
  >
    <button class="TreeToggle" @click="emits('node-click', items, $event)">
      <i v-if="expanded" class="pi pi-angle-down"></i>
      <i v-else class="pi pi-angle-right"></i>
      <i :class="iconMap[items.type!]"></i>
      {{ getLabel() }}
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
      :group-type="groupType"
      @node-click="onNodeClick"
      @node-contextmenu="onNodeContext"
    />
  </ul>
</template>

<script setup lang="ts">
import type { TreeItem, IDs, IconMap, TreeDnDStat } from "@/types";
import { computed, inject } from "vue";

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
  groupType: string;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
  (e: "node-contextmenu", node: TreeItem, event: MouseEvent): void;
}>();

const dndStat = inject<TreeDnDStat>("tree_dnd");

const onDragStart = (event: DragEvent) => {
  const startID = (event.currentTarget as HTMLElement).getAttribute("data-id");
  if (startID) {
    dndStat!.startId = startID;
  }
};

const onDragEnter = (event: DragEvent) => {
  const endID = (event.currentTarget as HTMLElement).getAttribute("data-id");
  if (endID) {
    dndStat!.endId = endID;
  }
};

const onDragOver = (event: DragEvent) => {
  event.preventDefault();
  event.dataTransfer!.dropEffect = "move";
};

const onDrop = (event: DragEvent) => {
  console.log(dndStat?.startId, dndStat?.endId);
};

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

const isGroup = computed(() => {
  return props.items.type === props.groupType;
});

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};

const onNodeContext = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-contextmenu", node, event);
};
</script>

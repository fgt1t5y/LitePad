<template>
  <div
    :class="{
      TreeLeaf: !isGroup,
      TreeGroup: isGroup,
      Active: items.id === highlightedItem,
    }"
    :title="items.label"
    :data-id="items.id"
    @contextmenu="emits('node-click', items, $event)"
  >
    <button class="TreeToggle" @click="emits('node-click', items, $event)">
      <i v-if="expanded" class="pi pi-angle-down"></i>
      <i v-else class="pi pi-angle-right"></i>
      <input
        v-if="isRenaming"
        type="text"
        autocomplete="off"
        :id="`Renaming_${items.id}`"
        :value="label"
        @blur="onRename(label, $event)"
        @keydown="onRenameInputKeydown(label, $event)"
      />
      <span v-else>{{ label }}</span>
    </button>
  </div>
  <div v-if="expanded && hasChildren" class="TreeChildren">
    <TreeNode
      v-for="item of items.children"
      :key="item.id"
      :items="item"
      :level="level + 1"
      :expanded-items="expandedItems"
      :selected-items="selectedItems"
      :highlighted-item="highlightedItem"
      :renaming-item="renamingItem"
      :group-type="groupType"
      :prev-path="`${prevPath}/${item.label}`"
      :label-field="labelField"
      @node-click="onNodeClick"
      @rename="(o, or) => emits('rename', o, or)"
    />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, IDs } from "@/types";
import { computed } from "vue";

defineOptions({
  name: "TreeNode",
});

const props = defineProps<{
  items: TreeItem;
  level: number;
  expandedItems: IDs;
  selectedItems: IDs;
  highlightedItem?: number;
  renamingItem?: number;
  groupType: string;
  prevPath: string;
  labelField: string;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
  (e: "rename", newName: string, origin: string): void;
}>();

const label = computed(() => {
  if (typeof props.items === "object") {
    return props.items[props.labelField];
  }
  return "";
});

const expanded = computed(() => {
  return props.expandedItems[props?.items.id] === true;
});

const hasChildren = computed(() => {
  return props.items && props?.items?.children?.length! > 0;
});

const isGroup = computed(() => {
  return props.items.type === props.groupType;
});

const isRenaming = computed(() => {
  return props.items.id === props.renamingItem;
});

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};

const onRename = (origin: string, event: FocusEvent | KeyboardEvent) => {
  const newName = (event.target as HTMLInputElement).value;
  emits("rename", newName, origin);
};

const onRenameInputKeydown = (origin: string, event: KeyboardEvent) => {
  if (event.key === "Enter") {
    (event.target as HTMLInputElement).blur();
  }
  if (event.key === "Escape") {
    (event.target as HTMLInputElement).value = origin;
    (event.target as HTMLInputElement).blur();
  }
};
</script>

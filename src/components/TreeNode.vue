<template>
  <div
    role="treeitem"
    :class="{
      TreeLeaf: !isGroup,
      TreeGroup: isGroup,
      Active: items.id === highlightedItem,
    }"
    :title="items.label"
    :data-id="items.id"
    :data-type="items.type"
    :draggable="draggable && !isRenaming"
    @contextmenu="emits('node-click', items, $event)"
    @dragstart="onDragStart"
    @dragenter="onDragEnter"
    @dragover="onDragOver"
    @dragend="onDragEnd"
    @drop="onDrop"
  >
    <Indent />
    <button
      class="TreeToggle"
      :disabled="isRenaming"
      @click="emits('node-click', items, $event)"
    >
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
      :prev-path="`${prevPath}/${item[labelField]}`"
      :label-field="labelField"
      :draggable="draggable"
      @node-click="onNodeClick"
      @node-drag="onNodeDrag"
      @rename="onNodeRename"
    />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, TreeDnDStat, IDs } from "@/types";
import type { VNode } from "vue";

import { computed, h, inject } from "vue";

defineOptions({
  name: "TreeNode",
});

const props = defineProps<{
  items: TreeItem;
  level: number;
  expandedItems: IDs;
  selectedItems: IDs;
  groupType: string;
  prevPath: string;
  labelField: string;
  highlightedItem?: number;
  renamingItem?: number;
  draggable?: boolean;
}>();

const emits = defineEmits<{
  (e: "node-click", node: TreeItem, event: MouseEvent): void;
  (e: "node-drag", from: number, to: number): void;
  (e: "rename", newName: string, origin: string): void;
}>();

const label = computed(() => {
  if (typeof props.items === "object") {
    return props.items[props.labelField];
  }
  return "";
});

const expanded = computed(() => {
  return props.expandedItems[props.items.id] === true;
});

const hasChildren = computed(() => {
  return props.items && props.items.children?.length! > 0;
});

const isGroup = computed(() => {
  return props.items.type === props.groupType;
});

const isRenaming = computed(() => {
  return props.items.id === props.renamingItem;
});

const Indent = () => {
  const nodes: VNode[] = [];
  for (let i = 0; i < props.level; i += 1) {
    nodes.push(h("div"));
  }

  return h("div", { class: "Indent" }, nodes);
};

const onNodeClick = (node: TreeItem, event: MouseEvent) => {
  event.preventDefault();
  emits("node-click", node, event);
};

const onNodeRename = (newName: string, origin: string) => {
  emits("rename", newName, origin);
};

const onNodeDrag = (from: number, to: number) => {
  emits("node-drag", from, to);
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

const dndStat = inject<TreeDnDStat>("dnd");

const onDragStart = (event: DragEvent) => {
  event.dataTransfer!.effectAllowed = "move";
  const target = event.currentTarget as HTMLElement;
  const startID = target.getAttribute("data-id");
  target.classList.add("Dragging");
  if (startID) {
    dndStat!.startId = startID;
    dndStat!.startEl = target;
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
  if (
    (event.currentTarget as HTMLElement).getAttribute("data-type") ===
    props.groupType
  )
    event.dataTransfer!.dropEffect = "move";
  else event.dataTransfer!.dropEffect = "none";
};

const onDragEnd = (event: DragEvent) => {
  event.preventDefault();
  if (dndStat!.startEl) {
    dndStat!.startEl.classList.remove("Dragging");
  }
};

const onDrop = (event: DragEvent) => {
  event.preventDefault();

  if (
    (event.currentTarget as HTMLElement).getAttribute("data-type") ===
    props.groupType
  )
    emits("node-drag", Number(dndStat!.startId), Number(dndStat!.endId));
};
</script>

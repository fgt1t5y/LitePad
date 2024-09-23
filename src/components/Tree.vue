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
      @rename="onRename"
    />
  </div>
</template>

<script setup lang="ts">
import type { TreeItem, IDs } from "@/types";
import TreeNode from "./TreeNode.vue";
import { watch } from "vue";

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
  (e: "rename", newName: string, origin: string): void;
}>();

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

watch(
  () => renamingItem.value,
  (id) => {
    if (!id) return;
    // 聚焦到重命名的输入框
    let t = window.setTimeout(() => {
      const input = document.getElementById(`Renaming_${id}`);
      input?.focus();
      window.clearTimeout(t);
    }, 20);
  }
);
</script>

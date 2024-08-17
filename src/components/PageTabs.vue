<template>
  <draggable
    v-model="tabs"
    class="Tabs"
    item-key="id"
    ghost-class="TabDragging"
  >
    <template #item="{ element }">
      <button :class="{ Tab: true, TabActive: element.path === $route.path }">
        <span>
          <i class="pi pi-file"></i>
        </span>
        <div>
          <span>{{ element.label }}</span>
        </div>
        <span class="TabButton" tabindex="0" role="button" title="关闭标签页">
          <i class="pi pi-times"></i>
        </span>
      </button>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import type { PageTabsItem } from "@/types";
import draggable from "vuedraggable";

defineOptions({
  name: "PageTabs",
});

const tabs = defineModel<PageTabsItem[]>("tabs");
</script>

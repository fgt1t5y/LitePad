<template>
  <draggable
    v-model="tabs"
    class="Tabs"
    item-key="id"
    ghost-class="TabDragging"
  >
    <template #item="{ element }">
      <button
        :class="{ Tab: true, TabActive: element.path === $route.path }"
        :title="element.label"
        @click="emits('tab-click', element)"
      >
        <span>
          <i class="pi pi-file"></i>
        </span>
        <div>
          <span>{{ element.label }}</span>
        </div>
        <span
          class="TabButton"
          tabindex="0"
          role="button"
          title="关闭标签页"
          @click.stop="pageTabs.close(element.key)"
        >
          <i class="pi pi-times"></i>
        </span>
      </button>
    </template>
    <template #footer>
      <button class="Tab">
        <i class="pi pi-plus"></i>
      </button>
    </template>
  </draggable>
</template>

<script setup lang="ts">
import type { PageTabsItem } from "@/types";
import { usePageTabs } from "@/utils/usePageTabs";
import draggable from "vuedraggable";

defineOptions({
  name: "PageTabs",
});

const emits = defineEmits<{
  (e: "tab-click", tab: PageTabsItem): void;
}>();

const [tabs] = defineModel<PageTabsItem[]>("tabs");

const pageTabs = usePageTabs();
</script>

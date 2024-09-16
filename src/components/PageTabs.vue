<template>
  <draggable v-model="tabs" class="Tabs" item-key="id" ghost-class="Dragging">
    <template #header>
      <slot name="header" />
    </template>
    <template #item="{ element }">
      <button
        :class="{ Tab: true, TabActive: element.id === pageTabs.current }"
        :title="element.label"
        @click="tabClick(element)"
      >
        <span class="TabLabel">{{ element.label }}</span>
        <span
          class="TabButton"
          tabindex="0"
          role="button"
          title="关闭标签页"
          @click.stop="pageTabs.close(element)"
        >
          <i class="i i-close"></i>
        </span>
      </button>
    </template>
    <template #footer>
      <slot name="footer" />
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

const tabClick = (tab: PageTabsItem) => {
  pageTabs.to(tab);
  emits("tab-click", tab);
};
</script>

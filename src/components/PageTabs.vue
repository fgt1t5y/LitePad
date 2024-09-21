<template>
  <draggable v-model="tabs" class="Tabs" item-key="id" ghost-class="Dragging">
    <template #header>
      <slot name="header" />
    </template>
    <template #item="{ element }">
      <button
        :class="{ Tab: true, TabActive: element.id === pageTabs.current }"
        :title="element.label"
        @click="tabClick(element, $event)"
        @contextmenu="tabClick(element, $event)"
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
      <ContextMenu ref="tabMenuRef" :model="tabContextMenuItems" />
    </template>
  </draggable>
</template>

<script setup lang="ts">
import type { PageTabsItem } from "@/types";
import type { ContextMenuMethods } from "primevue/contextmenu";
import type { MenuItem } from "primevue/menuitem";

import { usePageTabs } from "@/utils/usePageTabs";
import { computed, ref } from "vue";
import draggable from "vuedraggable";

defineOptions({
  name: "PageTabs",
});

const emits = defineEmits<{
  (e: "tab-click", tab: PageTabsItem): void;
}>();

const [tabs] = defineModel<PageTabsItem[]>("tabs");
const tabMenuRef = ref<ContextMenuMethods>();
const selectedTab = ref<PageTabsItem>();

const pageTabs = usePageTabs();

const tabClick = (tab: PageTabsItem, event?: MouseEvent) => {
  selectedTab.value = tab;

  if (event && event.button === 2) {
    tabMenuRef.value!.show(event);
    return;
  }

  pageTabs.to(tab);
  emits("tab-click", tab);
};

const tabContextMenuItems = computed<MenuItem[]>(() => {
  return [
    {
      label: "转到",
      command() {
        pageTabs.to(selectedTab.value!);
      },
    },
    {
      separator: true,
    },
    {
      label: "关闭",
      command() {
        pageTabs.close(selectedTab.value!);
      },
    },
    {
      label: "关闭左侧标签页",
      command() {
        pageTabs.closeBefore(selectedTab.value!);
      },
    },
    {
      label: "关闭右侧标签页",
      command() {
        pageTabs.closeAfter(selectedTab.value!);
      },
    },
    {
      label: "关闭其他标签页",
      command() {
        pageTabs.closeOther(selectedTab.value!);
      },
    },
  ];
});
</script>

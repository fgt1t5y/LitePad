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
      >
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
    <template #footer>
      <button class="Tab">
        <i class="pi pi-plus"></i>
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

const emits = defineEmits<{
  (e: "change", tab: PageTabsItem): void;
}>();

const [tabs] = defineModel<PageTabsItem[]>("tabs");

const pushTab = (tab: PageTabsItem) => {
  if (!tab || typeof tab !== "object") return;

  tabs.value!.push(tab);
};

const setTabTitle = (target: number, title: string) => {
  if (!title) return;

  const tabIndex = tabs.value?.findIndex((tab) => tab.key === target);

  if (tabIndex === -1) return;

  tabs.value![tabIndex!].label = title;
};

defineExpose({ pushTab, setTabTitle });
</script>

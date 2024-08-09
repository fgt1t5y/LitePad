<template>
  <div class="Tabs">
    <button
      v-for="tab in tabs"
      class="Tab"
      draggable="true"
      :data-key="tab.key"
    >
      <span>
        <i class="pi pi-file"></i>
      </span>
      <span>{{ tab.label }}</span>
      <span class="TabButton" tabindex="0" role="button" title="关闭标签页">
        <i class="pi pi-times"></i>
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { TabsItem } from "@/types";

defineOptions({
  name: "Tabs",
});

const tabs = defineModel<TabsItem[]>("tabs");
</script>

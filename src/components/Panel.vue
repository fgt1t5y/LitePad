<template>
  <div class="Panel">
    <div :title="title" class="PanelHeader">
      <span class="PanelTitle">
        <span>{{ title }}</span>
      </span>
      <span class="PanelExtra">
        <slot name="extra"></slot>
      </span>
    </div>
    <div class="PanelBody">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "Panel",
});

const props = defineProps<{
  title: string;
}>();
</script>

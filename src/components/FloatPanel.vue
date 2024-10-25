<template>
  <div ref="mainRef" class="FloatPanel" :style="style">
    <div ref="headerRef" class="FloatPanelHeader">
      <span>{{ title }}</span>
      <button title="关闭面板">
        <i class="i i-close"></i>
      </button>
    </div>
    <div class="FloatPanelBody">123</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useDraggable } from "@vueuse/core";

defineOptions({
  name: "FloatPanel",
});

const props = defineProps<{
  title: string;
}>();

const mainRef = ref<HTMLElement>();
const headerRef = ref<HTMLElement>();

const { style } = useDraggable(mainRef, {
  handle: headerRef,
  initialValue: {
    x: 200,
    y: 200,
  },
});
</script>

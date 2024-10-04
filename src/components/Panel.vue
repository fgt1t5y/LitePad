<template>
  <div class="Panel">
    <div :title="title" class="PanelHeader">
      <span class="PanelTitle">
        <button
          ref="toggleButtonRef"
          title="展开/收起此面板"
          :aria-label="title"
          @click="togglePanel"
        >
          <span>{{ title }}</span>
        </button>
      </span>
      <span class="PanelExtra">
        <slot name="extra"></slot>
      </span>
    </div>
    <div v-show="expanded" class="PanelBody">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "Panel",
});

const props = defineProps<{
  title: string;
}>();

const expanded = defineModel<boolean>();

const toggleButtonRef = ref<HTMLButtonElement>();

const togglePanel = () => {
  expanded.value = !expanded.value;
  toggleButtonRef.value?.focus();
};
</script>

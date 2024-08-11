<template>
  <div class="Panel">
    <div class="PanelHeader" role="button" tabindex="0" @click="toggle">
      <span>{{ title }}</span>
      <button>
        <i v-if="open" class="pi pi-angle-up"></i>
        <i v-else class="pi pi-angle-down"></i>
      </button>
    </div>
    <div v-show="open" class="PanelBody">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "PanelPro",
});

const props = defineProps<{
  title: string;
}>();

const [open] = defineModel("open", { type: Boolean, default: false });

const toggle = () => {
  open.value = !open.value;
};
</script>

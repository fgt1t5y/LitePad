<template>
  <div :class="{ Panel: true, PanelFlexGrow: open && flexGrow }">
    <div :title="title" class="PanelHeader" @click="toggle">
      <span class="PanelTitle">
        <button>
          <i v-if="open" class="pi pi-angle-up"></i>
          <i v-else class="pi pi-angle-right"></i>
        </button>
        <span>{{ title }}</span>
      </span>
      <span class="PanelExtra">
        <slot name="extra"></slot>
      </span>
    </div>
    <div v-show="open" class="PanelBody">
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
  flexGrow?: boolean;
}>();

const [open] = defineModel("open", { type: Boolean, default: false });

const toggle = () => {
  open.value = !open.value;
};
</script>

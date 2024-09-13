<template>
  <div class="ListSelect">
    <button
      :class="{ ListSelectItem: true, Active: item.id === active }"
      :title="item.name"
      v-for="item in items"
    >
      <i class="pi pi-book"></i>
      <span>{{ item.name }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "ListSelect",
});

const props = defineProps<{
  active?: number | string;
}>();

const [items] = defineModel<any[] | undefined>("items");
</script>

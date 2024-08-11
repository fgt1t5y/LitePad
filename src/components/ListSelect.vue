<template>
  <div class="ListSelect">
    <div
      :class="{ ListSelectItem: true, ListSelectActive: item.id === active }"
      v-for="item in items"
    >
      <i class="pi pi-book"></i>
      <span>{{ item.name }}</span>
    </div>
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

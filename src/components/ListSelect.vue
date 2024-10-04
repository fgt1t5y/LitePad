<template>
  <div class="ListSelect">
    <button
      :class="{ ListSelectItem: true, Active: item.id === active }"
      :title="item[labelField || 'name']"
      v-for="item in items"
    >
      <i v-show="icon" :class="icon"></i>
      <span>{{ item[labelField || "name"] }}</span>
    </button>
  </div>
</template>

<script setup lang="ts">
defineOptions({
  name: "ListSelect",
});

const props = defineProps<{
  icon?: string;
  active?: number;
  labelField?: string;
}>();

const [items] = defineModel<any[] | undefined>("items");
</script>

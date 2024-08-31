<template>
  <div ref="editorViewRef" id="Editor"></div>
</template>

<script setup lang="ts">
import { useEditor } from "@/utils/useEditor";
import { onMounted, ref } from "vue";

const editorViewRef = ref<HTMLElement>();

onMounted(() => {
  useEditor(editorViewRef.value!);
});
</script>

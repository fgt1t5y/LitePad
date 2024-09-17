<template>
  <Editor ref="editorRef" />
</template>

<script setup lang="ts">
import Editor from "@/components/editor/Editor.vue";
import { ref, onBeforeUnmount } from "vue";

const editorRef = ref<InstanceType<typeof Editor>>();

onBeforeUnmount(() => {
  editorRef.value?.destroy();
});
</script>

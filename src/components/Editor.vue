<template>
  <div class="Toolbar" ref="toolbarRef"></div>
  <div class="EditorBody" ref="editorBodyRef"></div>
</template>

<script setup lang="ts">
import type { EditorView } from "prosemirror-view";

import { useEditor } from "@/utils/useEditor";
import { onMounted, shallowRef, ref } from "vue";

const toolbarRef = ref<HTMLElement>();
const editorBodyRef = ref<HTMLElement>();
const view = shallowRef<EditorView | null>(null);

const destroy = () => {
  if (view.value) {
    view.value.destroy();
  }
};

onMounted(() => {
  view.value = useEditor(toolbarRef.value!, editorBodyRef.value!);
});

defineExpose({ destroy });
</script>

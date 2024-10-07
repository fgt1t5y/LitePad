<template>
  <div class="EditorStatus">
    <span>字数：{{ editor.textCount }}</span>
    <div>
      <Checkbox v-model="editorEditable" input-id="editableSwitch" binary />
      <label for="editableSwitch">编辑模式</label>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LitePadEditor } from ".";

import { ref, watch } from "vue";

defineOptions({
  name: "EditorStatus",
});

const props = defineProps<{
  editor: LitePadEditor;
}>();

const editorEditable = ref<boolean>(props.editor.isEditable);

watch(
  () => editorEditable.value,
  (value) => {
    props.editor.setEditable(value);
  }
);
</script>

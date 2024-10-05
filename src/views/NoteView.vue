<template>
  <EditorTools v-if="editor" :editor="editor" />
  <div class="Editor">
    <div class="EditorHeader">
      <input v-model="noteTitle" class="TitleInput" placeholder="无标题笔记" />
    </div>
    <div ref="editorRef"></div>
  </div>
</template>

<script setup lang="ts">
import { LitePadEditor } from "@/components/editor";
import { db } from "@/db";
import { usePageTabs } from "@/utils/usePageTabs";
import { useShared } from "@/utils/useShared";
import { useToast } from "primevue/usetoast";
import { onUnmounted, ref, shallowRef } from "vue";
import { useRoute } from "vue-router";
import { schema } from "@/components/editor/schema";

import EditorTools from "@/components/editor/EditorTools.vue";

const editor = shallowRef<LitePadEditor | null>();
const editorRef = ref<HTMLElement>();
const noteTitle = ref<string>();
const noteContent = ref<string>("<p></p>");

const route = useRoute();
const toast = useToast();
const s = useShared();
const tabs = usePageTabs();
const noteId = Number(route.params.id);

db.notes.get(noteId).then((note) => {
  if (!note) return;

  noteTitle.value = note.name;
  noteContent.value = note.content;

  setupEditor();
});

const setupEditor = () => {
  if (!editorRef.value) return;

  editor.value = new LitePadEditor({
    mount: editorRef.value,
    content: noteContent.value,
    schema,
    onUpdate({ editor }) {
      noteContent.value = editor.getHTML();
    },
  });
};

const saveNote = async () => {
  await db.notes.update(noteId, {
    name: noteTitle.value,
    content: noteContent.value,
  });

  s.updateNote(noteId, {
    name: noteTitle.value,
  });

  tabs.setLabel(noteId, noteTitle.value!);

  toast.add({ severity: "success", summary: "保存成功", life: 1000 });
};

onUnmounted(() => {
  editor.value?.destroy();
  editor.value = null;
});
</script>

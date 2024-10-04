<template>
  <div class="Editor">
    <div class="EditorHeader">
      <input
        v-model="noteTitle"
        class="TitleInput"
        type="text"
        placeholder="无标题笔记"
      />
    </div>
    <InputRichText v-model:html="noteContent" />
  </div>
</template>

<script setup lang="ts">
import { db } from "@/db";
import { usePageTabs } from "@/utils/usePageTabs";
import { useShared } from "@/utils/useShared";
import { useToast } from "primevue/usetoast";
import { ref } from "vue";
import { useRoute } from "vue-router";

import InputRichText from "@/components/editor/InputRichText.vue";

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
});

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
</script>

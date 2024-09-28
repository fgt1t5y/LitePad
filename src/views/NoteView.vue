<template>
  <Editor v-if="noteContent" v-model:html="noteContent" ref="editorRef">
    <div>
      <button class="i-hover" title="保存" @click="saveNote">
        <i class="i i-save i-m"></i>
      </button>
    </div>
    <input
      v-model="noteTitle"
      class="TitleInput"
      type="text"
      placeholder="无标题笔记"
    />
  </Editor>
</template>

<script setup lang="ts">
import Editor from "@/components/editor/Editor.vue";
import { db } from "@/db";
import { useToast } from "primevue/usetoast";
import { ref, onBeforeUnmount, watchEffect } from "vue";
import { useRoute } from "vue-router";

const editorRef = ref<InstanceType<typeof Editor>>();
const noteTitle = ref<string>();
const noteContent = ref<string>();

const route = useRoute();
const toast = useToast();
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

  toast.add({ severity: "success", summary: "保存成功", life: 1000 });
};

watchEffect(() => {
  console.log(noteTitle.value);
});

onBeforeUnmount(() => {
  editorRef.value?.destroy();
});
</script>

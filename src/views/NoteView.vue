<template>
  <EditorTools v-if="editor" :tools="editorTools" />
  <EditorFindAndReplace
    v-if="editor && showSearchReplacePanel"
    v-model="showSearchReplacePanel"
    :editor="editor"
  />
  <div class="Editor">
    <div class="EditorHeader">
      <input v-model="noteTitle" class="TitleInput" placeholder="无标题笔记" />
    </div>
    <div ref="editorRef" @contextmenu="editorMenuRef?.show($event)"></div>
  </div>
  <EditorFloatMenu v-if="editor" :editor="editor" />
  <EditorStatus v-if="editor" :editor="editor" />
  <ContextMenu ref="editorMenuRef" :model="editorMenuItems" />
</template>

<script setup lang="ts">
import type { EditorTool } from "@/types";
import type { ContextMenuMethods } from "primevue/contextmenu";
import type { MenuItem } from "primevue/menuitem";

import { LitePadEditor } from "@/components/editor";
import { db } from "@/db";
import { usePageTabs } from "@/utils/usePageTabs";
import { useShared } from "@/utils/useShared";
import { useToast } from "primevue/usetoast";
import { computed, onUnmounted, ref, shallowRef, watch } from "vue";
import { useRoute } from "vue-router";
import { schema } from "@/components/editor/schema";
import { extraKeymap } from "@/components/editor/keymap";
import { concatKeymap } from "@/components/editor/helper";
import { writeRichText, readRichText } from "@/utils/helpers";

import EditorFindAndReplace from "@/components/editor/EditorFindAndReplace.vue";
import EditorTools from "@/components/editor/EditorTools.vue";
import EditorStatus from "@/components/editor/EditorStatus.vue";
import EditorFloatMenu from "@/components/editor/EditorFloatMenu.vue";

const editor = shallowRef<LitePadEditor | null>();
const editorMenuRef = ref<ContextMenuMethods>();
const editorRef = ref<HTMLElement>();
const noteTitle = ref<string>();
const noteContent = ref<string>("<p></p>");
const titleChanged = ref<boolean>(false);
const contentChanged = ref<boolean>(false);
const showSearchReplacePanel = ref<boolean>(false);

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

const heading = (level: number): EditorTool => ({
  icon: `i i-m i-h${level}`,
  command: () => editor.value!.setBlockType("heading", { level }),
  active: () => editor.value!.isNodeActive("heading", { level }),
  enable: () => true,
});

const editorTools = [
  {
    icon: "i i-m i-save",
    command: () => saveNote(),
    active: () => false,
    enable: () => titleChanged.value || contentChanged.value,
  },
  {
    icon: "i i-m i-search",
    command: () => {
      showSearchReplacePanel.value = !showSearchReplacePanel.value;
    },
    active: () => showSearchReplacePanel.value,
    enable: () => true,
  },
  {
    icon: "i i-m i-undo",
    command: () => editor.value!.undo(),
    active: () => false,
    enable: () => editor.value!.canUndo(),
  },
  {
    icon: "i i-m i-redo",
    command: () => editor.value!.redo(),
    active: () => false,
    enable: () => editor.value!.canRedo(),
  },
  {
    icon: "i i-m i-content-copy",
    command: () => copySelection(),
    active: () => false,
    enable: () => editor.value!.hasSelection(),
  },
  {
    icon: "i i-m i-content-cut",
    command: () => copySelection(true),
    active: () => false,
    enable: () => editor.value!.hasSelection(),
  },
  {
    icon: "i i-m i-content-paste",
    command: () => paste(),
    active: () => false,
    enable: () => true,
  },
  heading(1),
  heading(2),
  heading(3),
  heading(4),
  heading(5),
  heading(6),
  {
    icon: "i i-m i-paragraph",
    command: () => editor.value!.setBlockType("paragraph"),
    active: () => editor.value!.isNodeActive("paragraph"),
    enable: () => true,
  },
  {
    icon: "i i-m i-quote",
    command: () => editor.value!.setBlockType("blockquote"),
    active: () => editor.value!.isNodeActive("blockquote"),
    enable: () => true,
  },
  {
    icon: "i i-m i-bold",
    command: () => editor.value!.toggleMark("bold"),
    active: () => editor.value!.isMarkActive("bold"),
    enable: () => true,
  },
  {
    icon: "i i-m i-italic",
    command: () => editor.value!.toggleMark("italic"),
    active: () => editor.value!.isMarkActive("italic"),
    enable: () => true,
  },
  {
    icon: "i i-m i-strikethrough",
    command: () => editor.value!.toggleMark("del"),
    active: () => editor.value!.isMarkActive("del"),
    enable: () => true,
  },
  {
    icon: "i i-m i-code",
    command: () => editor.value!.toggleMark("code"),
    active: () => editor.value!.isMarkActive("code"),
    enable: () => true,
  },
  {
    icon: "i i-m i-format-clear",
    command: () => editor.value!.clearAllMark(),
    active: () => false,
    enable: () => editor.value!.hasSelection(),
  },
  {
    icon: "i i-m i-link",
    command: () => editor.value!.toggleMark("link", { href: "" }),
    active: () => false,
    enable: () => editor.value!.hasSelection(),
  },
] as EditorTool[];

const setupEditor = () => {
  if (!editorRef.value) return;

  editor.value = new LitePadEditor({
    mount: editorRef.value,
    content: noteContent.value,
    schema,
    keymap: concatKeymap(extraKeymap, {
      "Mod-k": () => {
        editor.value!.toggleMark("link", { href: "" });
        return true;
      },
      "Mod-f": () => {
        showSearchReplacePanel.value = !showSearchReplacePanel.value;
        return true;
      },
    }),
    autoFocus: true,
    onUpdate({ editor }) {
      noteContent.value = editor.getHTML();
      contentChanged.value = true;
    },
  });
};

const copySelection = (cut: boolean = false) => {
  const { dom, text } = editor.value!.serializeSelectionForClipboard();
  if (cut) editor.value!.deleteSelection();
  writeRichText(dom.innerHTML, text);
};

const paste = async (textOnly: boolean = false) => {
  const { text, html } = await readRichText();
  if (textOnly && text) {
    editor.value!.paste(text);
    return;
  }
  editor.value!.paste(html);
};

const saveNote = async () => {
  if (!noteTitle.value) {
    toast.add({ severity: "error", summary: "缺少笔记标题", life: 1000 });
    return;
  }

  await db.notes.update(noteId, {
    name: noteTitle.value,
    content: noteContent.value,
  });

  s.updateNote(noteId, {
    name: noteTitle.value,
  });

  tabs.setLabel(noteId, noteTitle.value!);

  titleChanged.value = false;
  contentChanged.value = false;

  toast.add({ severity: "success", summary: "保存成功", life: 1000 });
};

const editorMenuItems = computed<MenuItem[]>(() => {
  if (!editor.value) return [];

  const items: MenuItem[] = [];

  if (editor.value.hasSelection()) {
    items.push(
      {
        label: "复制",
        command() {
          copySelection();
        },
      },
      {
        label: "剪切",
        command() {
          copySelection(true);
        },
      }
    );
  }

  items.push(
    {
      label: "粘贴",
      command() {
        paste();
      },
    },
    {
      label: "粘贴纯文本",
      command() {
        paste(true);
      },
    }
  );

  return items;
});

watch(
  () => noteTitle.value,
  (_, lastTitle) => {
    if (!lastTitle) return;
    titleChanged.value = true;
  }
);

onUnmounted(() => {
  editor.value?.destroy();
  editor.value = null;
});
</script>

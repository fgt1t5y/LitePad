<template>
  <div
    v-show="show"
    class="EditorFloatMenu"
    :style="{ left: `${left}px`, bottom: `${bottom}px` }"
  >
    <button title="打开链接" :disabled="!displayHref.length" @click="openURL(displayHref)">
      <i class="i i-open-in-new"></i>
    </button>
    <InputText v-model="displayHref" ref="hrefInputRef" size="small" />
    <button title="确认修改" @click="onUpdateLinkClick(displayHref)">
      <i class="i i-check"></i>
    </button>
    <button title="取消超链接" @click="onUnlinkClick()">
      <i class="i i-link-off"></i>
    </button>
  </div>
</template>

<script setup lang="ts">
import type { Editor, LitePadEditor } from ".";

import { nextTick, ref } from "vue";
import { openURL } from "@/utils/helpers";

defineOptions({
  name: "EditorFloatMenu",
});

const props = defineProps<{
  editor: LitePadEditor;
}>();

const show = ref<boolean>(false);
const left = ref<number>(0);
const bottom = ref<number>(0);
const displayHref = ref<string>("");
const hrefInputRef = ref<any>();

const onUpdateLinkClick = (href: string) => {
  props.editor.setMarkAttributes("link", { href });

  show.value = false;
};

const onUnlinkClick = () => {
  props.editor.clearMark("link");

  show.value = false;
};

const updatePosition = (editor: Editor) => {
  const position = editor.getCoordPosition();

  bottom.value = position.bottom;

  if (position.left + 300 > document.body.clientWidth) {
    left.value = document.body.clientWidth - 310;
    return;
  }

  left.value = position.left;
};

props.editor.on("transaction", ({ editor }) => {
  if (!editor.isMarkActive("link")) {
    show.value = false;
    return;
  }

  displayHref.value = editor.getMarkAttributes("link").href || "";

  updatePosition(editor);

  show.value = true;

  nextTick(() => {
    if (!displayHref.value) {
      const input = hrefInputRef.value.$el as HTMLInputElement;
      input.focus();
    }
  });
});
</script>

<template>
  <div class="FloatPanel EditorSearch">
    <div class="FloatPanelHeader">
      <span>搜索与替换</span>
      <button title="关闭搜索与替换面板" @click="modelValue = false">
        <i class="i i-close"></i>
      </button>
    </div>
    <div class="FloatPanelBody">
      <div class="MatchingInfo">
        <span>
          <Checkbox v-model="enableReplace" input-id="enableReplace" binary />
          <label for="enableReplace">启用替换</label>
        </span>
        <span>匹配数目：{{ matchingCount }}</span>
      </div>
      <div class="SearchInfo">
        <InputText
          v-model="keyword"
          id="keywordInput"
          placeholder="搜索..."
          size="small"
          autocomplete="off"
        />
        <button
          title="上一个"
          :disabled="!keyword || matchingCount === 0"
          @click="editor.findPrev()"
        >
          <i class="i i-arrow-up3"></i>
        </button>
        <button
          title="下一个"
          :disabled="!keyword || matchingCount === 0"
          @click="editor.findNext()"
        >
          <i class="i i-arrow-down3"></i>
        </button>
      </div>
      <div v-show="enableReplace" class="SearchInfo">
        <InputText
          v-model="replace"
          id="replaceInput"
          placeholder="替换为..."
          size="small"
          autocomplete="off"
        />
        <button
          title="替换一项匹配"
          :disabled="!replace || matchingCount === 0"
          @click="replaceCurrent()"
        >
          <i class="i i-check"></i>
        </button>
        <button
          title="替换所有匹配"
          :disabled="!replace || matchingCount === 0"
          @click="editor.replaceAll()"
        >
          <i class="i i-check-all"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LitePadEditor } from ".";

import { onMounted, onUnmounted, ref, watchEffect } from "vue";
import debounce from "debounce";

defineOptions({
  name: "EditorFindAndReplace",
});

const props = defineProps<{
  editor: LitePadEditor;
}>();

const keyword = ref<string>("");
const replace = ref<string>("");
const matchingCount = ref<number>(0);
const enableReplace = ref<boolean>(false);

const modelValue = defineModel<boolean>({ default: false });

const _queryString = (keyword: string, replace?: string) => {
  if (enableReplace.value && replace) {
    props.editor.find(keyword, replace);
  } else {
    props.editor.find(keyword);
  }

  matchingCount.value = props.editor.getMatchCount();
};

const replaceCurrent = () => {
  props.editor.replaceCurrent();
  props.editor.findNext();
};

const updateMatchingCount = () => {
  if (!keyword.value) return;

  matchingCount.value = props.editor.getMatchCount();
};

const queryString = debounce(_queryString, 500);

watchEffect(() => {
  queryString(keyword.value, replace.value);
});

onUnmounted(() => {
  props.editor.clearFind();
  props.editor.off("update", updateMatchingCount);
});

onMounted(() => {
  props.editor.on("update", updateMatchingCount);
  const keywordInput = document.getElementById(
    "keywordInput"
  ) as HTMLInputElement;

  if (keywordInput) keywordInput.select();
});
</script>

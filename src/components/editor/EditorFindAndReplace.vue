<template>
  <div class="FloatPanel EditorSearch">
    <div class="FloatPanelHeader">
      <span>搜索与替换</span>
      <button title="关闭搜索与替换面板" @click="modelValue = false">
        <i class="i i-close"></i>
      </button>
    </div>
    <div class="FloatPanelBody">
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
          @click="findNextOrPrev(-1)"
        >
          <i class="i i-arrow-up3"></i>
        </button>
        <button
          title="下一个"
          :disabled="!keyword || matchingCount === 0"
          @click="findNextOrPrev(1)"
        >
          <i class="i i-arrow-down3"></i>
        </button>
      </div>
      <div class="MatchingInfo">
        <span>
          <Checkbox v-model="enableReplace" input-id="enableReplace" binary />
          <label for="enableReplace">启用替换</label>
        </span>
        <div>
          <span v-show="matchingIndex">第 {{ matchingIndex }} 个，</span>
          <span>共 {{ matchingCount }} 个</span>
        </div>
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
      <div class="SearchInfo">
        <span>
          <Checkbox v-model="caseSensitive" input-id="caseSensitive" binary />
          <label for="caseSensitive">区分大小写</label>
        </span>
        <span>
          <Checkbox v-model="regexp" input-id="regexp" binary />
          <label for="regexp">正则表达式</label>
        </span>
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
const matchingIndex = ref<number>(0);
const matchingCount = ref<number>(0);
const enableReplace = ref<boolean>(false);

const caseSensitive = ref<boolean>(false);
const regexp = ref<boolean>(false);

const modelValue = defineModel<boolean>({ default: false });

const _queryString = (
  keyword: string,
  replace: string,
  caseSensitive: boolean,
  regexp: boolean
) => {
  props.editor.find(keyword, replace, caseSensitive, regexp);

  matchingIndex.value = props.editor.getCurrentMatchIndex() + 1;
  matchingCount.value = props.editor.getMatchCount();
};

const findNextOrPrev = (dir: -1 | 1) => {
  if (dir > 0) props.editor.findNext();
  else props.editor.findPrev();

  props.editor.focus();

  matchingIndex.value = props.editor.getCurrentMatchIndex() + 1;
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
  queryString(keyword.value, replace.value, caseSensitive.value, regexp.value);
});

onUnmounted(() => {
  props.editor.clearFind();
  props.editor.off("update", updateMatchingCount);
  props.editor.focus();
});

onMounted(() => {
  props.editor.on("update", updateMatchingCount);
  const keywordInput = document.getElementById(
    "keywordInput"
  ) as HTMLInputElement;

  if (keywordInput) keywordInput.select();
});
</script>

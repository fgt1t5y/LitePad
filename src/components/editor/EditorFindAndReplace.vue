<template>
  <div class="FloatPanel EditorSearch">
    <div class="FloatPanelHeader">
      <span>搜索与替换</span>
      <button @click="modelValue = false">
        <i class="i i-close"></i>
      </button>
    </div>
    <div class="FloatPanelBody">
      <div class="SearchInfo">
        <InputText v-model="keyword" placeholder="搜索..." size="small" />
        <button :disabled="!keyword" @click="findPrev">
          <i class="i i-arrow-up3"></i>
        </button>
        <button :disabled="!keyword" @click="findNext">
          <i class="i i-arrow-down3"></i>
        </button>
      </div>
      <div class="MatchingInfo">
        <span>匹配到 {{ matchingCount }} 个项目</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { LitePadEditor } from ".";

import { ref, watch } from "vue";
import debounce from "debounce";

defineOptions({
  name: "EditorFindAndReplace",
});

const props = defineProps<{
  editor: LitePadEditor;
}>();

const modelValue = defineModel<boolean>({
  default: false,
  set(show) {
    if (!show) {
      props.editor.clearFind();
    }
  },
});

const keyword = ref<string>("");
const matchingCount = ref<number>(0);

const _queryString = (keyword: string) => {
  props.editor.find(keyword);

  matchingCount.value = props.editor.getMatchCount();
};

const findPrev = () => {
  props.editor.findPrev();
};

const findNext = () => {
  props.editor.findNext();
};

const queryString = debounce(_queryString, 500);

watch(
  () => keyword.value,
  (keyword) => {
    queryString(keyword);
  }
);
</script>

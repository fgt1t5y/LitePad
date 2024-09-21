<template>
  <Dialog
    v-model:visible="modelValue"
    header="创建笔记本"
    dismissable-mask
    modal
  >
    <InputText
      v-model="name"
      placeholder="笔记本名称"
      size="large"
      autofocus
      fluid
    />
    <Textarea
      v-model="description"
      placeholder="笔记本描述（可选）"
      :rows="5"
      auto-resize
      fluid
    />
    <template #footer>
      <Button severity="secondary" @click="closeModal">取消</Button>
      <Button :disabled="!name" @click="submit">创建</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";

defineOptions({
  name: "CreateNotebookModal",
});

const emits = defineEmits<{
  (e: "submit", name: string, description: string): void;
}>();

const name = ref<string>("");
const description = ref<string>("");

const [modelValue] = defineModel({ type: Boolean });

const submit = () => {
  emits("submit", name.value, description.value);
};

const closeModal = () => {
  name.value = "";
  description.value = "";
  modelValue.value = false;
};
</script>

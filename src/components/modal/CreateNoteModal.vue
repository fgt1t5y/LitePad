<template>
  <Dialog v-model:visible="modelValue" header="创建笔记本" modal>
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
      <Button :disabled="!name" @click="onCreateNotebookClick">创建</Button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { db } from "@/db";
import { useToast } from "primevue/usetoast";

defineOptions({
  name: "CreateNotebookModal",
});

const emits = defineEmits<{
  (e: "success", id: number): void;
}>();

const toast = useToast();

const name = ref<string>("");
const description = ref<string>("");

const [modelValue] = defineModel({ type: Boolean });

const closeModal = () => {
  name.value = "";
  description.value = "";
  modelValue.value = false;
};

const onCreateNotebookClick = () => {
  db.notebooks
    .add({
      name: name.value,
      description: description.value,
      created_at: new Date(),
      updated_at: new Date(),
    })
    .then((id) => {
      emits("success", id!);
      toast.add({
        severity: "success",
        summary: "创建笔记本成功",
        detail: name.value,
        life: 3000,
      });
      closeModal();
    })
    .catch(() => {
      toast.add({
        severity: "error",
        summary: "创建笔记本失败",
        life: 3000,
      });
    });
};
</script>

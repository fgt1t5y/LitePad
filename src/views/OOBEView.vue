<template>
  <div id="OOBEView">
    <Stepper value="welcome">
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="welcome">
          <div class="Step">
            <h2>欢迎使用 LitePad</h2>
            <h4>这是一款纯本地存储的笔记软件。</h4>
            <h4>这是你的第一次使用，你需要进行一些设置（比如创建笔记本）。</h4>
            <Button
              icon="pi pi-arrow-right"
              icon-pos="right"
              label="继续"
              @click="activateCallback('notebook')"
            ></Button>
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="notebook">
          <div class="Step">
            <h2>创建笔记本</h2>
            <h4>创建你的笔记本。这些设置可以后续在软件的设置界面中更改。</h4>
            <InputText
              v-model="notebookName"
              size="large"
              placeholder="笔记本名称"
            />
            <Textarea
              v-model="notebookDescription"
              placeholder="笔记本描述（可选）"
              auto-resize
              rows="5"
              cols="30"
            />
            <div id="Buttons">
              <Button
                icon="pi pi-arrow-left"
                label="后退"
                severity="secondary"
                @click="activateCallback('welcome')"
              ></Button>
              <Button
                icon="pi pi-arrow-right"
                icon-pos="right"
                label="继续"
                :disabled="notebookName === ''"
                @click="activateCallback('theme')"
              ></Button>
            </div>
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="theme">
          <div class="Step">
            <h2>设置主题</h2>
            <h4>设置你喜欢的主题模式。</h4>
            <SelectButton
              :options="themeModeList"
              option-label="name"
              option-value="value"
              :model-value="theme"
              @change="switchTo"
            />
            <div id="Buttons">
              <Button
                icon="pi pi-arrow-left"
                label="后退"
                severity="secondary"
                @click="activateCallback('notebook')"
              ></Button>
              <Button
                icon="pi pi-arrow-right"
                icon-pos="right"
                label="继续"
                :disabled="isPreparing"
                @click="prepare(activateCallback)"
              ></Button>
            </div>
          </div>
        </StepPanel>
        <StepPanel value="done">
          <div class="Step">
            <h2>配置完毕</h2>
            <h4>你现在可以开始使用 LitePad</h4>
            <Button
              icon="pi pi-arrow-right"
              icon-pos="right"
              label="开始使用"
              @click="$router.replace('/')"
            ></Button>
          </div>
        </StepPanel>
      </StepPanels>
    </Stepper>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTheme } from "@/utils/useTheme";
import { db, rest } from "@/db";
import { useShared } from "@/utils/useShared";
import { set } from "@/utils/helpers";

const { theme, switchTo } = useTheme();
const d = useShared();

const isPreparing = ref<boolean>(false);
const notebookName = ref<string>("");
const notebookDescription = ref<string>("");
const themeModeList = ref([
  {
    name: "跟随系统",
    value: "auto",
  },
  {
    name: "浅色",
    value: "light",
  },
  {
    name: "深色",
    value: "dark",
  },
]);

const prepare = (activateCallback: Function) => {
  isPreparing.value = true;
  let notebook: number;

  db.transaction("rw", db.notebooks, db.folders, db.notes, async () => {
    const notebook_id = await db.notebooks.add({
      name: notebookName.value,
      description: notebookDescription.value,
      ...rest(),
    });
    notebook = notebook_id || 1;

    await db.folders.add({
      notebook_id: notebook_id || 1,
      folder_id: undefined,
      name: "示例文件夹",
      type: "folder",
      ...rest(),
    });

    await db.notes.add({
      // 笔记id从10001开始计数，文件夹id从1开始计数
      id: 10001,
      notebook_id: notebook_id || 1,
      folder_id: undefined,
      title: "Welcome to LitePad!",
      type: "note",
      content: "<p>Welcome!</p>",
      labels: [],
      ...rest(),
    });
  })
    .then(() => {
      activateCallback("done");
      set("LP_OOBE_PASSED", "1");
      d.state.lastNotebook = notebook;
      d.saveState();
    })
    .catch((error) => {
      console.log(error);
    })
    .finally(() => {
      isPreparing.value = false;
    });
};
</script>

<style>
#OOBEView {
  height: 100vh;
  background-color: var(--p-primary-color);
  display: flex;
  flex-direction: column;
  justify-content: center;
  user-select: none;
}

#OOBEView #Buttons {
  display: flex;
  justify-content: end;
  gap: 16px;
}

#OOBEView .Step {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
}

#OOBEView .p-steppanels {
  max-width: 600px;
  margin: 0px auto;
}

#OOBEView h2 {
  margin: 0px;
}

#OOBEView h4 {
  margin: 0px;
  color: var(--p-text-muted-color);
}
</style>

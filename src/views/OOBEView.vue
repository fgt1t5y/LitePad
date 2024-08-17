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
                @click="activateCallback('password')"
              ></Button>
            </div>
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="password">
          <div class="Step">
            <h2>设置密码</h2>
            <h4>
              LitePad
              建议为你的笔记本设置一个密码，用于在启动或切换笔记本时验证访问者身份。此设置可以后续在软件的设置界面中更改。
            </h4>
            <Password
              :input-props="{ autocomplete: 'new-password' }"
              v-model="password"
              input-id="Password"
              placeholder="密码"
              promptLabel="检查密码复杂度"
              autofocus
              fluid
            />
            <Password
              :input-props="{ autocomplete: 'new-password' }"
              v-model="repeatPassword"
              input-id="RepeatPassword"
              placeholder="重复密码"
              promptLabel="检查密码复杂度"
              fluid
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
                :label="password ? '继续' : '跳过'"
                @click="checkPassword(activateCallback)"
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
                @click="activateCallback('password')"
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
import { encryptPassword } from "@/utils/password";
import { useTheme } from "@/services/theme";
import { db } from "@/db";
import { set } from "@/utils/helpers";

const { theme, switchTo } = useTheme();

const isPreparing = ref<boolean>(false);
const notebookName = ref<string>("");
const notebookDescription = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");
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

const checkPassword = (activateCallback: Function) => {
  if (!(password.value === repeatPassword.value)) {
    alert("两次密码不一致。");
    return;
  }

  activateCallback("theme");
};

const prepare = (activateCallback: Function) => {
  isPreparing.value = true;
  const { salt, encrypted } = encryptPassword(password.value);
  let notebook: number;

  db.transaction("rw", db.notebooks, db.folders, db.notes, async () => {
    const notebook_id = await db.notebooks.add({
      name: notebookName.value,
      description: notebookDescription.value,
      password: encrypted,
      password_salt: salt,
      created_at: new Date(),
      updated_at: new Date(),
    });
    notebook = notebook_id || 1;

    await db.folders.add({
      notebook_id: notebook_id || 1,
      folder_id: undefined,
      name: "示例文件夹",
      type: "folder",
      created_at: new Date(),
      updated_at: new Date(),
    });

    await db.notes.add({
      // 笔记id从10001开始计数，文件夹id从1开始计数
      id: 10001,
      notebook_id: notebook_id || 1,
      folder_id: undefined,
      title: "Welcome to LitePad!",
      type: "note",
      content: "<p>Welcome!</p>",
      preview: "Welcome",
      labels: [],
      created_at: new Date(),
      updated_at: new Date(),
    });
  })
    .then(() => {
      activateCallback("done");
      set("LP_OOBE_PASSED", "1");
      set("LP_LAST_NOTEBOOK", String(notebook));
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

#OOBEView #Spinner {
  height: 50px;
  width: 50px;
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
  color: var(--p-surface-500);
}
</style>

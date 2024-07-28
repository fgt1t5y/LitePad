<template>
  <div id="OOBEView">
    <Stepper value="1">
      <StepList>
        <Step value="1">欢迎</Step>
        <Step value="2">设置笔记本</Step>
        <Step value="3">设置密码</Step>
        <Step value="4">配置完成</Step>
      </StepList>
      <StepPanels>
        <StepPanel v-slot="{ activateCallback }" value="1">
          <div class="Step">
            <h2>欢迎使用 Litepad</h2>
            <h4>这是一款纯本地存储的笔记软件。</h4>
            <Button
              icon="pi pi-arrow-right"
              label="继续"
              @click="activateCallback('2')"
            ></Button>
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="2">
          <div class="Step">
            <h2>设置笔记本</h2>
            <h4>设置你的笔记本。此设置可以后续在软件的设置界面中更改。</h4>
            <InputText
              v-model="notebookName"
              size="large"
              placeholder="笔记本名称"
            />
            <div id="Buttons">
              <Button
                icon="pi pi-arrow-left"
                label="后退"
                severity="secondary"
                @click="activateCallback('1')"
              ></Button>
              <Button
                icon="pi pi-arrow-right"
                label="继续"
                @click="checkNotebookName(activateCallback)"
              ></Button>
            </div>
            <Button
              label="不设置笔记本"
              severity="secondary"
              text
              @click="activateCallback('3')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="3">
          <div class="Step">
            <h2>设置密码</h2>
            <h4>
              Litepad
              建议为你的笔记本设置一个密码，用于在启动时验证访问者身份。此设置可以后续在软件的设置界面中更改。
            </h4>
            <Password
              :input-props="{ autocomplete: 'new-password' }"
              v-model="password"
              input-id="Password"
              placeholder="密码"
              promptLabel="检查密码复杂度"
            />
            <Password
              :input-props="{ autocomplete: 'new-password' }"
              v-model="repeatPassword"
              input-id="RepeatPassword"
              placeholder="重复密码"
              promptLabel="检查密码复杂度"
            />
            <div id="Buttons">
              <Button
                icon="pi pi-arrow-left"
                label="后退"
                severity="secondary"
                @click="activateCallback('2')"
              ></Button>
              <Button
                icon="pi pi-arrow-right"
                label="继续"
                @click="checkPassword(activateCallback)"
              ></Button>
            </div>
            <Button
              label="不设置密码"
              severity="secondary"
              text
              @click="activateCallback('4')"
            />
          </div>
        </StepPanel>
        <StepPanel v-slot="{ activateCallback }" value="4">
          <div class="Step">
            <h2>配置完成</h2>
            <h4>Litepad 的初始配置已完成！你可以开始使用 Litepad 了！</h4>
            <Button
              icon="pi pi-arrow-right"
              label="开始"
              @click="checkPassword(activateCallback)"
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

const notebookName = ref<string>("");
const password = ref<string>("");
const repeatPassword = ref<string>("");

const checkNotebookName = (activateCallback: Function) => {
  if (!notebookName.value.trim()) {
    alert("请命名笔记本。");
    return;
  }

  activateCallback("3");
};

const checkPassword = (activateCallback: Function) => {
  if (!password.value || !repeatPassword.value) {
    alert("请设置密码或点击“不设置密码”");
    return;
  }

  if (!(password.value === repeatPassword.value)) {
    alert("两次密码不一致。");
    return;
  }

  activateCallback("4");
};
</script>

<style>
#OOBEView {
  margin: auto 30px;
}

#OOBEView #Buttons {
  display: flex;
  gap: 18px;
}

#OOBEView .Step {
  display: flex;
  gap: 18px;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

#OOBEView h2,
#OOBEView h4 {
  margin: 0px;
}
</style>

<template>
  <div id="SplashView">
    <ProgressSpinner strokeWidth="6" aria-label="应用加载中" />
  </div>
</template>

<script setup lang="ts"></script>

<style>
#SplashView {
  display: flex;
  height: 100vh;
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

#SplashView .p-progressspinner {
  height: 60px;
  width: 60px;
}
</style>

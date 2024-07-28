<template>
  <h2>Hello</h2>
  <button @click="addUser">Insert</button>
  <button @click="queryUsers">Query</button>
</template>

<script setup lang="ts">
import { db } from "@/db";

const addUser = async () => {
  const user = await db.table("users").add({
    name: "fgt1t5y",
  });

  console.log(user);
};

const queryUsers = async () => {
  const user = await db.table<{ id: number; name: string }>("users").toArray();
  console.log(user);
};
</script>

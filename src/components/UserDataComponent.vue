<script setup lang="ts">
import { onMounted, ref } from "vue";
import { UserDataParams } from "../utils/consts/UserDataParams.ts";
import { getNestedValue } from "../utils/functions/getNestedValue.ts";
import LOCAL_STORAGE_FIELDS from "../utils/consts/localStorageFields.ts";
import { API_LINKS } from "../utils/consts/apiLinks.ts";
import { type UserType } from "../utils/types/userType.ts";

import api from "../axios";

const userData = ref<UserType | null>(null);

const fetchUser = async () => {
  try {
    const USER_ID = String(localStorage.getItem(LOCAL_STORAGE_FIELDS.USER_ID));
    const response = await api.get(API_LINKS.USERS, {
      params: { id: USER_ID },
    });
    userData.value = response.data[0];
    console.log(userData.value);
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

onMounted(() => {
  fetchUser();
});
</script>

<template>
  <div class="flex flex-wrap justify-center gap-4 mb-4 mt-4">
    <template v-if="userData">
      <template v-for="value in UserDataParams" :key="value.key">
        <div
          class="flex gap-2 bg-gray-950 p-3 rounded-md shadow-md max-w-[100vw]"
          style="flex: 1 1 max-content"
        >
          <span class="font-bold">{{ value.text }}:</span>
          <span>{{ getNestedValue(userData, value.key) }}</span>
        </div>
      </template>
    </template>
  </div>
</template>

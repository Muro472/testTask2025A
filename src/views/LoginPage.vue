<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { PHONE_NUMBER_REGEX, USERNAME_REGEX } from "../utils/regex";
import { type UserType } from "../utils/types/userType.ts";
import api from "../axios";
import LOCAL_STORAGE_FIELDS from "../utils/consts/localStorageFields";
import { useToast } from "primevue/usetoast";
import { useRouter } from "vue-router";
import { ROUTER_NAMES } from "../router/routerParams.ts";
import { API_LINKS } from "../utils/consts/apiLinks.ts";

const router = useRouter();
const toast = useToast();

const username = ref("");
const phoneNumber = ref("");
const usernameFocused = ref(false);
const phoneNumberFocused = ref(false);
const errorsSeverity = ref("secondary");

const validatePhoneNumber = (number: string): boolean => {
  return PHONE_NUMBER_REGEX.test(number);
};

const validateUsername = (name: string): boolean => {
  return USERNAME_REGEX.test(name);
};

const showUsernameError = computed(() => {
  if (!usernameFocused.value) return false;

  if (usernameFocused.value && validateUsername(username.value)) return false;

  if (validateUsername(username.value)) return false;

  return true;
});

const showPhoneNumberError = computed(() => {
  if (!phoneNumberFocused.value) return false;

  if (
    phoneNumberFocused.value === true &&
    validatePhoneNumber(phoneNumber.value)
  )
    return false;

  if (validatePhoneNumber(phoneNumber.value)) return false;

  return true;
});

const handleSubmit = async () => {
  usernameFocused.value = true;
  phoneNumberFocused.value = true;

  if (showUsernameError.value || showPhoneNumberError.value) {
    errorsSeverity.value = "error";
    return;
  }

  const response = await api.get<UserType[]>(API_LINKS.USERS, {
    params: {
      username: username.value,
    },
  });

  const user = response.data.find(
    (user) =>
      user.phone.replace(/[^0-9+]/g, "") ===
      phoneNumber.value.replace(/[^0-9+]/g, "")
  );
  if (user) {
    localStorage.setItem(LOCAL_STORAGE_FIELDS.USER_ID, user.id.toString());
    router.push({ name: ROUTER_NAMES.MAIN_PAGE });
  } else {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "User not found. Please check your username and phone number.",
      life: 3000,
    });
  }
};

onMounted(() => {
  localStorage.removeItem(LOCAL_STORAGE_FIELDS.USER_ID);
});
</script>

<template>
  <Toast />
  <div
    class="bg-surface-50 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden"
  >
    <div class="w-full py-20 px-8 sm:px-20 md:w-[40rem]">
      <form>
        <label for="username" class="block text-xl font-medium mb-2">
          Username
        </label>
        <InputText
          id="username"
          type="text"
          placeholder="Username"
          class="w-full mb-1"
          v-model="username"
          @focus="usernameFocused = true"
        />
        <div class="ml-1 mb-7">
          <!-- @focus="usernameFocused = true" -->
          <Message
            v-show="showUsernameError"
            size="small"
            :severity="errorsSeverity"
            variant="simple"
          >
            Username cannot be empty.
          </Message>
        </div>

        <label for="phone" class="block font-medium text-xl mb-2">
          Phone Number
        </label>

        <InputText
          id="phone"
          type="text"
          placeholder="Phone number"
          class="w-full mb-1"
          v-model="phoneNumber"
          @focus="phoneNumberFocused = true"
        />
        <div class="ml-1 mb-7">
          <Message
            v-show="showPhoneNumberError"
            size="small"
            :severity="errorsSeverity"
            variant="simple"
          >
            Phone number can contain only digits or symbols.
          </Message>
        </div>

        <Button label="Sign In" class="w-full" @click="handleSubmit" />
      </form>
    </div>
  </div>

  <div
    class="absolute top-1 left-1 bg-green-400 p-2 rounded-md text-sm text-black"
  >
    <div>Kamren</div>
    <div>(254)954-1289</div>
  </div>
</template>

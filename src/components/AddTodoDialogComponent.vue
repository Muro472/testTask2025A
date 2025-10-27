<script setup lang="ts">
import { ref } from "vue";

defineProps<{
  modelValue: boolean;
}>();

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "createTask", value: string): void;
}>();

const taskTitle = ref("");

const closeDialog = () => {
  emit("update:modelValue", false);
};

const emitCreateTask = () => {
  emit("createTask", taskTitle.value);
  taskTitle.value = "";
};
</script>

<template>
  <Dialog
    v-bind="$attrs"
    :visible="modelValue"
    @update:visible="closeDialog"
    modal
    header="New Todo"
    :style="{ width: '25rem' }"
  >
    <div class="flex items-center gap-4 mb-8">
      <label for="text" class="font-semibold w-24">Text</label>
      <InputText
        id="text"
        class="flex-auto"
        autocomplete="off"
        v-model="taskTitle"
      />
    </div>
    <div class="flex justify-end gap-2">
      <Button
        type="button"
        label="Cancel"
        severity="secondary"
        @click="closeDialog"
      />

      <Button
        type="button"
        label="Save"
        @click="emitCreateTask"
        :disabled="taskTitle === ''"
      />
    </div>
  </Dialog>
</template>

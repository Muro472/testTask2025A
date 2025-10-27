<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import api from "../axios";
import { type TodoType } from "../utils/types/todoType";
import { API_LINKS } from "../utils/consts/apiLinks.ts";
import UserDataComponent from "../components/UserDataComponent.vue";
import LOCAL_STORAGE_FIELDS from "../utils/consts/localStorageFields.ts";
import AddTodoDialogComponent from "../components/AddTodoDialogComponent.vue";

const sortDirection = ref<"asc" | "desc">("desc");
const loaded = ref(false);
const currentPage = ref<number>(0);
const products = ref<TodoType[]>([]);
const sortParam = ref("");
const searchParam = ref("");
const favoriteTodos = ref<number[]>([]);
const userIdSearch = ref<number | null>(null);
const selectOptions = ref<string[]>([
  "All",
  "Completed",
  "Uncompleted",
  "Favorites",
]);
const selectedOption = ref(selectOptions.value[0]);

const createNewTaskOverlayShow = ref(false);

const isTodoFavorite = (todoId: number): boolean => {
  return favoriteTodos.value.includes(todoId);
};

const changeFavoriteStatus = (todoId: number) => {
  const index = favoriteTodos.value.indexOf(todoId);
  if (index === -1) {
    favoriteTodos.value.push(todoId);
  } else {
    favoriteTodos.value.splice(index, 1);
  }
  localStorage.setItem(
    LOCAL_STORAGE_FIELDS.FAVORITE_TODOS,
    JSON.stringify(favoriteTodos.value)
  );
};

const onUserIdSearch = () => {
  currentPage.value = 0;
  fetchTodos();
};

const fetchTodos = async ({
  additionalTodo,
  additionalQuery,
}: {
  additionalTodo?: TodoType;
  additionalQuery?: Record<string, any>;
} = {}) => {
  loaded.value = false;

  try {
    const params: Record<string, any> = {
      _limit: 10,
      _page: currentPage.value + 1,
    };

    if (sortParam.value) {
      params["_sort"] = sortParam.value;
      params["_order"] = sortDirection.value;
    }

    if (searchParam.value) {
      params["title_like"] = searchParam.value;
    }

    if (selectedOption.value === "Favorites") {
      params["id"] = favoriteTodos.value;
    }

    if (selectedOption.value === "Completed") {
      params["completed"] = true;
    }

    if (selectedOption.value === "Uncompleted") {
      params["completed"] = false;
    }

    if (userIdSearch.value !== null) {
      params["userId"] = userIdSearch.value;
    }

    if (additionalQuery) {
      Object.assign(params, additionalQuery);
    }

    const response = await api.get(API_LINKS.TODOS, { params });

    products.value = response.data;

    if (additionalTodo) {
      products.value.unshift(additionalTodo);
      products.value.pop();
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
  loaded.value = true;
};

const sortParamUpdate = (newSort: string) => {
  sortParam.value = newSort;
};

const sortDirectionUpdate = (newDirection: "asc" | "desc") => {
  sortDirection.value = newDirection;
};

watch([() => sortDirection.value, () => sortParam.value], async () => {
  currentPage.value = 0;
  await fetchTodos();
});

watch([() => searchParam.value], () => {
  currentPage.value = 0;
  update();
});

const changePageClick = (newPage: number) => {
  currentPage.value = newPage;
  fetchTodos();
};

function debounce<T extends (...args: any[]) => void>(fn: T, delay = 300) {
  let timeout: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = window.setTimeout(() => fn(...args), delay);
  };
}

const updateSelectedOption = (newOption: string) => {
  selectedOption.value = newOption;
  currentPage.value = 0;

  fetchTodos();
};

const update = debounce(() => {
  currentPage.value = 0;
  fetchTodos();
}, 500);

const createNewTodo = (taskTitle: string) => {
  createNewTaskOverlayShow.value = false;
  loaded.value = false;

  api
    .post(API_LINKS.TODOS, {
      title: taskTitle,
      completed: false,
      userId: Number(localStorage.getItem(LOCAL_STORAGE_FIELDS.USER_ID)),
    })
    .then((response) => {
      fetchTodos(response.data);
    });
};

onMounted(async () => {
  await fetchTodos();

  favoriteTodos.value = JSON.parse(
    localStorage.getItem(LOCAL_STORAGE_FIELDS.FAVORITE_TODOS) || "[]"
  ) as number[];

  loaded.value = true;
});
</script>

<template>
  <Toast />

  <div class="flex justify-center min-w-[100vw] overflow-hidden">
    <div class="w-full max-w-4xl">
      <!-- User info -->
      <UserDataComponent />

      <!-- Input -->
      <InputGroup class="w-full mb-4">
        <InputGroupAddon>
          <i class="pi pi-search" />
        </InputGroupAddon>
        <InputText type="text" placeholder="Search" v-model="searchParam" />
        <InputGroupAddon
          class="cursor-pointer"
          @click="createNewTaskOverlayShow = true"
        >
          <i class="pi pi-plus" />
        </InputGroupAddon>
      </InputGroup>

      <!-- Table -->
      <DataTable
        removableSort
        class="bg-transparent"
        tableStyle=""
        :value="products"
        @update:sort-field="sortParamUpdate"
        @update:sort-order="
          (order) => sortDirectionUpdate(order === 1 ? 'asc' : 'desc')
        "
        :lazy="true"
        :loading="!loaded"
      >
        <Column field="userId" header="" style="width: 10%">
          <template #header>
            <InputNumber
              v-model="userIdSearch"
              number
              size="small"
              placeholder="User id"
              @value-change="onUserIdSearch()"
            />
          </template>
        </Column>

        <Column field="title" header="Title" sortable style="width: 70%" />

        <Column field="completed" header="" style="width: 2dvb">
          <template #header>
            <Select
              v-model="selectedOption"
              :options="selectOptions"
              class="w-full"
              @update:modelValue="updateSelectedOption"
            />
          </template>

          <template #body="slotProps">
            <div class="flex gap-2 items-center justify-between">
              <div class="flex items-center gap-2">
                <i
                  :class="{
                    'pi pi-check-circle text-green-500':
                      slotProps.data.completed,
                    'pi pi-times-circle text-red-500':
                      !slotProps.data.completed,
                  }"
                ></i>
                <span>
                  {{ slotProps.data.completed ? "Completed" : "Uncompleted" }}
                </span>
              </div>
              <i
                @click="changeFavoriteStatus(Number(slotProps.data.id))"
                :class="{
                  'pi pi-star-fill cursor-pointer text-yellow-400':
                    isTodoFavorite(Number(slotProps.data.id)),
                  'pi pi-star cursor-pointer text-gray-500': !isTodoFavorite(
                    Number(slotProps.data.id)
                  ),
                }"
              ></i>
            </div>
          </template>
        </Column>
      </DataTable>

      <!-- Pagination -->
      <div
        class="flex items-center gap-4 border border-primary rounded-full w-full py-1 px-2 justify-between bg-transparent mt-4"
      >
        <Button
          icon="pi pi-chevron-left"
          rounded
          variant="text"
          @click="changePageClick(currentPage - 1)"
          :disabled="currentPage === 0"
        />

        <div class="text-color font-medium">
          <span> Page {{ currentPage + 1 }} </span>
        </div>

        <Button
          icon="pi pi-chevron-right "
          rounded
          variant="text"
          @click="changePageClick(currentPage + 1)"
          :disabled="currentPage === 19 || products.length < 10"
        />
      </div>
    </div>
  </div>
  <AddTodoDialogComponent
    v-model="createNewTaskOverlayShow"
    @create-task="createNewTodo"
  />
</template>

import { createApp } from "vue";
import "./assets/style.css";
import App from "./App.vue";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import router from "./router/index.ts";

import InitialRouterGuard from "./utils/functions/InitialRouterGuard.ts";

import ToastService from "primevue/toastservice";
import {
  InputText,
  Button,
  Message,
  Toast,
  DataTable,
  Paginator,
  Column,
  InputGroup,
  InputGroupAddon,
  Dialog,
  Checkbox,
  InputNumber,
  Select,
} from "primevue";

InitialRouterGuard();

const app = createApp(App);

app.component("Button", Button);
app.component("InputText", InputText);
app.component("Message", Message);
app.component("Toast", Toast);
app.component("DataTable", DataTable);
app.component("Paginator", Paginator);
app.component("Column", Column);
app.component("InputGroup", InputGroup);
app.component("InputGroupAddon", InputGroupAddon);
app.component("Dialog", Dialog);
app.component("Checkbox", Checkbox);
app.component("InputNumber", InputNumber);
app.component("Select", Select);

app.use(ToastService);
app.use(router);

app.use(PrimeVue, {
  theme: {
    preset: Aura,
  },
});

app.mount("#app");

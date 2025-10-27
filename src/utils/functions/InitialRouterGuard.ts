import LOCAL_STORAGE_FIELDS from "../consts/localStorageFields";
import { ROUTER_PATHS } from "../../router/routerParams";

const InitialRouterGuard = () => {
  const token = localStorage.getItem(LOCAL_STORAGE_FIELDS.USER_ID);
  if (!token && window.location.pathname !== ROUTER_PATHS.LOGIN_PAGE) {
    window.location.href = ROUTER_PATHS.LOGIN_PAGE;
  }
};
export default InitialRouterGuard;

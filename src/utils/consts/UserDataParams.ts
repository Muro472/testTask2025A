import type { NestedKeys } from "../types/nestedKeys";
import type { UserType } from "../types/userType";

type UserDataParamsType = {
  key: NestedKeys<UserType>;
  text: string;
}[];

export const UserDataParams: UserDataParamsType = [
  {
    key: "username",
    text: "User Name",
  },
  {
    key: "name",
    text: "Full Name",
  },
  {
    key: "company.name",
    text: "Workplace",
  },
  {
    key: "email",
    text: "Email",
  },
  {
    key: "phone",
    text: "Phone",
  },
  {
    key: "website",
    text: "Website",
  },
  {
    key: "address.city",
    text: "City",
  },
  {
    key: "address.street",
    text: "Street",
  },
];

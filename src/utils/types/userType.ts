interface UserAddressType {
  city: string;
  geo: {
    lat: string;
    lng: string;
  };
  street: string;
  suite: string;
  zipcode: string;
}

interface UserCompanyType {
  bs: string;
  catchPhrase: string;
  name: string;
}

interface UserType {
  address: UserAddressType;
  company: UserCompanyType;
  email: string;
  id: number;
  name: string;
  phone: string;
  username: string;
  website: string;
}

export type { UserType };

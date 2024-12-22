import { IconType } from "react-icons"

export type NavLink = {
  name: string,
  href: string,
  icon: IconType,
}


////========== Forms

export type DepostitFormState = {
  errors?: {
    amount?: string[];
  };
  message?: string | null;
};

export type WithdrawFormState = {
  errors?: {
    amount?: string[];
    address?: string[];
  };
  message?: string | null;
};


//========== DB

export type User = {
  id: number,
  tg_id: number,
  address: string,
  balance: number,
  reward: number,
}

export type Service = {
  id: number,
  name: string,
}

export type Action = {
  id: number,
  name: string,
  reward: number
}

export type Task = {
  id: number,
  service: string,
  action: string,
  link: string,
  price: number,
  count: number,
  done: number,
}
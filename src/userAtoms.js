import axios from "axios";
import { atom, selector } from "recoil";

export const currentUserIdState = atom({
  key: "currentUserIdState",
  default: 1,
});

export const currentUserNameQuery = selector({
  key: "currentUserNameQuery",
  get: async ({ get }) => {
    const path = "https://jsonplaceholder.typicode.com/users/";
    const response = await axios.get(`${path}${get(currentUserIdState)}`);
    return response.data.name;
  },
});

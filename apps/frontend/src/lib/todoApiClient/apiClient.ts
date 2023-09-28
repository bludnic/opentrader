import axios, { AxiosPromise } from "axios";
import { Todo } from "./types";

const client = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const todoApiClient = {
  getTodo(todoId: number): AxiosPromise<Todo[]> {
    return client.get(`/todos/${todoId}`);
  },
};

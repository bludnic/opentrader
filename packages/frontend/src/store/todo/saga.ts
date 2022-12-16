import axios, { AxiosResponse } from "axios";
import { todoApiClient } from "src/lib/todoApiClient/apiClient";
import { all, call, put, takeLatest } from "redux-saga/effects";
import { SagaIterator } from "redux-saga";
import {
  TODO_FETCH_REQUESTED,
  TodoDto,
  todoError,
  TodoFetchAction,
  todoSuccess,
} from "src/store/todo";

function* fetchTodo(action: TodoFetchAction): SagaIterator {
  const { todoId } = action.payload;

  try {
    const { data }: AxiosResponse<TodoDto> = yield call(
      [todoApiClient, "getTodo"],
      todoId
    );

    yield put(todoSuccess(data));
  } catch (err) {
    if (axios.isAxiosError(err) || err instanceof Error) {
      yield put(todoError(err));
    }
    console.log(err);
  }
}

export function* watchTodo(): SagaIterator {
  yield all([takeLatest(TODO_FETCH_REQUESTED, fetchTodo)]);
}

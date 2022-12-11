import {
    TODO_FETCH_REQUESTED,
    TODO_FETCH_SUCCEEDED,
    TODO_FETCH_FAILED,
    TODO_RESET_STATE,
    TodoActionTypes,
    TodoDto,
} from "./types";

export const todoFetch = (todoId: number): TodoActionTypes => ({
    type: TODO_FETCH_REQUESTED,
    payload: {
        todoId,
    },
});

export const todoSuccess = (todo: TodoDto): TodoActionTypes => ({
    type: TODO_FETCH_SUCCEEDED,
    payload: {
        todo,
    },
});

export const todoError = (err: Error): TodoActionTypes => ({
    type: TODO_FETCH_FAILED,
    payload: {
        err,
    },
});

export const todoResetState = (): TodoActionTypes => ({
    type: TODO_RESET_STATE,
});

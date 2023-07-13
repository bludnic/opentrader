import { Reducer } from "redux";

import {
    TODO_FETCH_FAILED,
    TODO_FETCH_REQUESTED,
    TODO_FETCH_SUCCEEDED,
    TODO_RESET_STATE,
    TodoActionTypes,
    TodoState,
    TodoStatus,
} from "./types";

const initialState: TodoState = {
    todo: null,
    status: TodoStatus.Idle,
    error: null,
};

export const todoReducer: Reducer<TodoState, TodoActionTypes> = (
    state = initialState,
    action
): TodoState => {
    switch (action.type) {
        case TODO_FETCH_REQUESTED: {
            return {
                ...state,
                todo: null,
                status: TodoStatus.Fetching,
                error: null,
            };
        }
        case TODO_FETCH_SUCCEEDED: {
            const { todo } = action.payload;

            return {
                ...state,
                todo,
                status: TodoStatus.Success,
                error: null,
            };
        }
        case TODO_FETCH_FAILED: {
            const { err } = action.payload;

            return {
                ...state,
                todo: null,
                status: TodoStatus.Error,
                error: err,
            };
        }
        case TODO_RESET_STATE: {
            return {
                ...initialState,
            };
        }
        default:
            return state;
    }
};

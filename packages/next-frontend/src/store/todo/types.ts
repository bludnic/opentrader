export type TodoDto = {
    userId: string;
    id: number;
    title: string;
    completed: false;
};

export enum TodoStatus {
    Idle = "Idle",
    Fetching = "Fetching",
    Success = "Success",
    Error = "Error",
}

export type TodoState =
    | TodoStateIdle
    | TodoStateFetching
    | TodoStateSuccess
    | TodoStateError;

type TodoStateIdle = {
    todo: null;
    status: TodoStatus.Idle;
    error: null;
};

type TodoStateFetching = {
    todo: null;
    status: TodoStatus.Fetching;
    error: null;
};

type TodoStateSuccess = {
    todo: TodoDto;
    status: TodoStatus.Success;
    error: null;
};

type TodoStateError = {
    todo: null;
    status: TodoStatus.Error;
    error: Error;
};

export const TODO_FETCH_REQUESTED = "todo/fetchRequested";
export const TODO_FETCH_SUCCEEDED = "todo/fetchSucceeded";
export const TODO_FETCH_FAILED = "todo/fetchFailed";
export const TODO_RESET_STATE = "todo/resetState";

export type TodoFetchAction = {
    type: typeof TODO_FETCH_REQUESTED;
    payload: {
        todoId: number;
    };
};

export type TodoSuccessAction = {
    type: typeof TODO_FETCH_SUCCEEDED;
    payload: {
        todo: TodoDto;
    };
};

export type TodoErrorAction = {
    type: typeof TODO_FETCH_FAILED;
    payload: {
        err: Error;
    };
};

export type TodoResetState = {
    type: typeof TODO_RESET_STATE;
};

export type TodoActionTypes =
    | TodoFetchAction
    | TodoSuccessAction
    | TodoErrorAction
    | TodoResetState;

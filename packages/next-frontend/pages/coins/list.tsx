import { NextPage } from "next";
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { TodoState, TodoStatus, todoFetch } from "src/store/todo";
import { useEffect } from "react";

const CoinsListNextPage: NextPage = () => {
  const todoState = useAppSelector<TodoState>((rootState) => rootState.todo);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(todoFetch(1));
  }, []);

  if (todoState.status === TodoStatus.Idle) {
    return <div>Idle</div>;
  }

  if (todoState.status === TodoStatus.Fetching) {
    return <div>Loading...</div>;
  }

  if (todoState.status === TodoStatus.Error) {
    return <div>Error: {todoState.error.message}</div>;
  }

  return <div>{JSON.stringify(todoState.todo)}</div>;
};

export default CoinsListNextPage;

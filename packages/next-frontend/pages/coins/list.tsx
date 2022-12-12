import { NextPage } from "next";
import { useAppSelector, useAppDispatch } from "src/store/hooks";
import { TodoState, TodoStatus, todoFetch } from "src/store/todo";
import { useEffect } from "react";
import {
  getStaticPropsCoinsList,
  GetStaticPropsCoinsListProps,
} from "src/utils/next/getStaticPropsCoinsList";

type Props = {} & GetStaticPropsCoinsListProps;

const CoinsListNextPage: NextPage<Props> = (props) => {
  const { coins } = props;
  const todoState = useAppSelector<TodoState>((rootState) => rootState.todo);
  const dispatch = useAppDispatch();

  console.log("coins", coins);

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

export const getStaticProps = getStaticPropsCoinsList;

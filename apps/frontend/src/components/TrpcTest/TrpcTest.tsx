import { ExchangeCode } from "@bifrost/types";
import { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "src/lib/trpc";

export const TrpcTest: NextPage = () => {
  const { isLoading, isError, data } = useQuery(["users"], () =>
    trpc.symbolsList.query(ExchangeCode.OKX),
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error</span>;
  }

  return <div>Hello world page {JSON.stringify(data)}</div>;
};

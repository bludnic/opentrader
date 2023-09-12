import { NextPage } from "next";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "src/lib/trpc";

export const TrpcTest: NextPage = () => {
  const { isLoading, isError, data } = useQuery(["users"], async () =>
    trpc.gridBot.getOne.query(1),
  );

  if (isLoading) {
    return <span>Loading...</span>;
  }

  if (isError) {
    return <span>Error</span>;
  }

  return (
    <div>
      Hello world page{" "}
      {JSON.stringify(
        data.settings.gridLines.map((gridLine) => {
          let str: string = "qwe";
        }),
      )}
    </div>
  );
};

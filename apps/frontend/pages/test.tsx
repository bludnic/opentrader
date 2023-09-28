import { NextPage } from "next";
import dynamic from "next/dynamic";

const TrpcTest = dynamic(
  () => import("src/components/TrpcTest"),
  {
    ssr: false,
  }
);

const TrpcTextNextPage: NextPage = () => {
  return (
    <div>
      <TrpcTest/>
    </div>
  );
};

export default TrpcTextNextPage;



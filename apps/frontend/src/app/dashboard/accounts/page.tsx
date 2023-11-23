import dynamic from "next/dynamic";
import React from "react";
import Loading from "src/components/accounts/loading";

const AccountsPage = dynamic(() => import("src/components/accounts/page"), {
  loading: Loading,
  ssr: false,
});

export default function Page() {
  return <AccountsPage />;
}

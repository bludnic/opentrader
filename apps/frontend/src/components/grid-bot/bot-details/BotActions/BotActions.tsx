import { FC, ReactNode } from "react";

type BotActionsProps = {
  children: ReactNode;
};

export const BotActions: FC<BotActionsProps> = ({ children }) => {
  return <>{children}</>;
};

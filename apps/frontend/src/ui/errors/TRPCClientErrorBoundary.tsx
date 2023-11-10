import React, { ReactNode } from "react";
import { TRPCErrorSheet } from "src/ui/errors/TRPCErrorSheet";
import { UnknownErrorSheet } from "src/ui/errors/UnknownErrorSheet";
import { isTRPCError } from "./utils/isTrpcError";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
  error?: unknown;
};

export class TRPCClientErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: unknown) {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log(error);
  }

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (!hasError) {
      return this.props.children;
    }

    if (isTRPCError(error)) {
      return <TRPCErrorSheet error={error.shape} />;
    }

    return <UnknownErrorSheet error={error} />;
  }
}

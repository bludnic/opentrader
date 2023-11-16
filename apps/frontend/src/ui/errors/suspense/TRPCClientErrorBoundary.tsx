import React, { ReactNode } from "react";
import { isTRPCError } from "src/ui/errors/utils/isTrpcError";
import { TRPCErrorSheet } from "./TRPCErrorSheet";
import { UnknownErrorSheet } from "./UnknownErrorSheet";

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
      return <TRPCErrorSheet error={error} />;
    }

    return <UnknownErrorSheet error={error} />;
  }
}

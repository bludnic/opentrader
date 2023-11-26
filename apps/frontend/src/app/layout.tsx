import { cache } from "@opentrader/exchanges";
import { PrismaCacheProvider } from "@opentrader/exchanges/server";
import { ThemeProvider } from "src/providers/ThemeProvider";
import { StoreProvider } from "src/providers/StoreProvider";
import { TrpcProvider } from "src/providers/TrpcProvider";
import { TRPCApiErrorProvider } from "src/ui/errors/api";
import { SnackbarProvider } from "src/ui/snackbar";
import { ConfirmationDialogProvider } from "src/ui/confirmation-dialog";

cache.setCacheProvider(new PrismaCacheProvider());

export const metadata = {
  title: "Opentrader",
  description: "Opensource Trading Bots",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <TRPCApiErrorProvider>
          <TrpcProvider>
            <StoreProvider>
              <SnackbarProvider>
                <ConfirmationDialogProvider>
                  <ThemeProvider>{children}</ThemeProvider>
                </ConfirmationDialogProvider>
              </SnackbarProvider>
            </StoreProvider>
          </TrpcProvider>
        </TRPCApiErrorProvider>
      </body>
    </html>
  );
}

import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import theme from "~/utils/theme";
import "react-big-calendar/lib/css/react-big-calendar.css";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster />
      <ChakraProvider theme={theme}>
        {/* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,@typescript-eslint/no-unsafe-member-access */}
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Component {...pageProps} />
      </ChakraProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

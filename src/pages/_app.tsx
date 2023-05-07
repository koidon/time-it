import { type AppType } from "next/app";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ChakraProvider, ColorModeScript } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import theme from "~/utils/theme";

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Toaster />
      <ChakraProvider theme={theme}>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <Component {...pageProps} />
      </ChakraProvider>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);

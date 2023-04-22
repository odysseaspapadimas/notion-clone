import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";

import { api } from "src/utils/api";

import "src/styles/globals.css";
import { Container, MantineProvider, createEmotionCache } from "@mantine/core";
import Header from "src/components/Header";

import { Montserrat } from "next/font/google"
import { useMemo } from "react";
import LanguageContext from "src/context/LanguageContext";
import { useLocalStorage } from "@mantine/hooks";

export const monsterrat = Montserrat({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],

})

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {

  const myCache = createEmotionCache({ key: 'mantine' });

  const [language, setLanguage] = useLocalStorage({ key: 'select-language', defaultValue: 'spanish' });
  const value = useMemo(
    () => ({ language, setLanguage }),
    [language, setLanguage]
  );

  return (
    <SessionProvider session={session}>
      <MantineProvider
        emotionCache={myCache}
        withGlobalStyles
        withNormalizeCSS
        theme={{
          /** Put your mantine theme override here */

          colorScheme: "dark",
          colors: {
            dark: [
              "#fff",
              "#A6A7AB",
              "#909296",
              "#5C5F66",
              "#373A40",
              "#2C2E33",
              "#25262B",
              "#1A1B1E",
              "#141517",
              "#101113",
            ],
          },
        }}
      >
        <div className={monsterrat.className}>
          <Header />
          <Container size="lg" py={36}>
            <LanguageContext.Provider value={value}>
              <Component {...pageProps} />
            </LanguageContext.Provider>
          </Container>
        </div>
      </MantineProvider>
    </SessionProvider>
  );
};

export default api.withTRPC(MyApp);

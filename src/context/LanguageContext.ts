import { createContext } from "react";
import type { Dispatch, SetStateAction } from "react";

type ThemeContextType = {
  language: string;
  setLanguage: Dispatch<SetStateAction<string>>;
};

const LanguageContext = createContext<ThemeContextType>({
  language: "spanish",
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setLanguage: () => {},
});
export default LanguageContext;

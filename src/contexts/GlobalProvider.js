import { createContext } from "react";
import { CssBaseline, ThemeProvider } from "@mui/material";
import BackendProvider from "./BackendProvider";
import { defaultTheme } from "../themes/defaultTheme";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <GlobalContext.Provider value={{}}>
                <BackendProvider>
                    {children}
                </BackendProvider>
            </GlobalContext.Provider>
        </ThemeProvider>
    );
}
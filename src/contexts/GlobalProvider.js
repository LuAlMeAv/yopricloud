import { createContext, useContext } from "react";
import { CssBaseline, IconButton, ThemeProvider } from "@mui/material";
import { Close } from "@mui/icons-material";
import BackendProvider from "./BackendProvider";
import { defaultTheme } from "../themes/defaultTheme";
import { closeSnackbar, SnackbarProvider } from "notistack";

const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
    return (
        <ThemeProvider theme={defaultTheme}>
            <CssBaseline />
            <GlobalContext.Provider value={{}}>
                <SnackbarProvider
                    action={closeAction}
                >
                    <BackendProvider>
                        {children}
                    </BackendProvider>
                </SnackbarProvider>
            </GlobalContext.Provider>
        </ThemeProvider>
    );
}

function closeAction(snackId) {
    return (
        <IconButton onClick={() => closeSnackbar(snackId)}>
            <Close />
        </IconButton>
    )
}

export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider.');
    }
    return context;
}
import { createTheme } from "@mui/material";

const mode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light";

export const defaultTheme = createTheme({
    palette: {
        mode
    }
})
import { BrowserRouter } from "react-router";
import LoginRoutes from "./LoginRoutes";
import { GlobalProvider } from "../contexts/GlobalProvider";

export default function MainRouter() {
    return (
        <BrowserRouter>
            <GlobalProvider>
                <LoginRoutes />
            </GlobalProvider>
        </BrowserRouter>
    )
}
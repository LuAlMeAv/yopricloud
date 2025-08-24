import { Route, Routes } from "react-router";
import Home from "../pages/Home";
import MiniDrawer from "../components/MiniDrawer";
import NotFound from "../pages/NotFound";
import Cloud from "../pages/Cloud";

export default function LoginRoutes() {
    return (
        <MiniDrawer>
            <Routes>
                <Route index element={<Home />} />
                <Route path="/root" element={<Cloud />} />
                <Route path="/root/*" element={<Cloud />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </MiniDrawer>
    )
}
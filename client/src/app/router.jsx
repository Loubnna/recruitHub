import { createBrowserRouter} from "react-router-dom";
import Home from "../pages/public/Home.jsx";

const router = createBrowserRouter([
    {
        path : "/",
        element : <Home />
    }
]);
export default router;

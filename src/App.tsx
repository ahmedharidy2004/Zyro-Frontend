import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import Games from "./Pages/Games/Games";
import ContactPage from "./Pages/Contact/ContactPage";
import Signup from "./Pages/Signup/signup";
import Login from "./Pages/Login/Login";
import UserProfile from "./Pages/UserProfile/UserProfile";
import ChangePasswordPage from "./Pages/ChangePassword/ChangePassword";
import ResetPassword from "./Pages/ResetPassword/ResetPassword";
import GamePage from "./Pages/Game/GamePage";
import CartPage from "./Pages/Cart/CartPage";
import OrderPlacement from "./Pages/OrderPlacement/OrderPlacement";
import MyOrders from "./Pages/MyOrders/MyOrders";
import NewsGrid from "./components/HomePage-Components/NewsGrid/NewsGrid";
import News from "./components/HomePage-Components/News/News";

function getLoggedInUser() {
    try {
        const storedUser = localStorage.getItem("zyroUser");
        return storedUser ? JSON.parse(storedUser) : null;
    } catch {
        return null;
    }
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const user = getLoggedInUser();

    if (!isLoggedIn || !user) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
                path="/games"
                element={
                    <ProtectedRoute>
                        <Games />
                    </ProtectedRoute>
                }
            />
            <Route path="/game/:id" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
            <Route path="/change-password" element={<ProtectedRoute><ChangePasswordPage /></ProtectedRoute>} />
            <Route path="/reset-password/:userId/:token" element={<ResetPassword />} />
            <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
            <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
            <Route path="/order-placement" element={<ProtectedRoute><OrderPlacement /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><MyOrders /></ProtectedRoute>} />
            <Route path="/news" element={<NewsGrid />} />
            <Route path="/news/:id" element={<News />} />
            <Route path="/support" element={<ContactPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
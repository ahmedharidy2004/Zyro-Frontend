import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import Games from "./Pages/Games/Games";
import ContactPage from "./Pages/Contact/ContactPage";
import AboutPage from "./Pages/About/AboutPage";
import Signup from "./Pages/Signup/signup";
import Login from "./Pages/Login/Login";

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
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
        </Routes>
    );
}

export default App;
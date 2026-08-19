import { Routes, Route } from "react-router-dom";
import HomePage from "./Pages/HomePage/HomePage";
import Games from "./Pages/Games/Games";
import ContactPage from "./Pages/Contact/ContactPage";
import AboutPage from "./Pages/About/AboutPage";

function App() {
    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/games" element={<Games />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
        </Routes>
    );
}

export default App;
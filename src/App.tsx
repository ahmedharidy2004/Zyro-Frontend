import { BrowserRouter as Router } from "react-router-dom";
import Footer from "./components/Footer/Footer.tsx";
import Navbar from "./components/Navbar/Navbar.tsx";

function App() {
  return (
    <Router>
      <Navbar />
      <Footer />
    </Router>
  );
}

export default App;
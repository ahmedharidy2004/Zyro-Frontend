import { Link } from "react-router-dom";
import "./Navbar.css";
import zyroLogo from "../../assets/zyro_logo.png";

type NavbarProps = {
    className?: string;
};

function Navbar({ className = "" }: NavbarProps) {
    return (
        <header className={`navbar ${className}`}>
            <Link to="/" className="navbar-logo">
                <img src={zyroLogo} alt="Zyro Logo" className="navbar-logo-image" />
            </Link>

            <nav>
                <ul className="navbar-list">
                    <li>
                        <Link to="/" className="active">Home</Link>
                    </li>
                    <li>
                        <Link to="/games">Games</Link>
                    </li>
                    <li>
                        <Link to="/categories">Categories</Link>
                    </li>
                    <li>
                        <Link to="/deals">Deals</Link>
                    </li>
                    <li>
                        <Link to="/about">About</Link>
                    </li>
                </ul>
            </nav>

            <div className="navbar-search-wrap">
                <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                <input
                    type="search"
                    placeholder="Search games..."
                    className="navbar-search"
                />
            </div>

            <Link to="/login" className="navbar-login">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
                Login
            </Link>

            <Link to="/cart" className="navbar-cart">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h8.6a2 2 0 0 0 2-1.6L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    <circle cx="9" cy="21" r="1.4" fill="currentColor"/>
                    <circle cx="18" cy="21" r="1.4" fill="currentColor"/>
                </svg>
                <span className="cart-badge">2</span>
            </Link>
        </header>
    );
}

export default Navbar;
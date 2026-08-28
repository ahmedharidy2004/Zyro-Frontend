import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { getGames } from "../../../services/api";
import type { Game } from "../../../types/game";
import "./Navbar.css";
import zyroLogo from "../../../assets/zyro_logo.png";

type NavbarProps = {
    className?: string;
};

function Navbar({ className = "" }: NavbarProps) {
    const [user, setUser] = useState<{ username?: string } | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

    // Search state
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<Game[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const [isDesktopDropdownOpen, setIsDesktopDropdownOpen] = useState(false);
    const [isMobileDropdownOpen, setIsMobileDropdownOpen] = useState(false);

    const allGamesCache = useRef<Game[] | null>(null);
    const desktopSearchRef = useRef<HTMLDivElement>(null);
    const mobileSearchRef = useRef<HTMLDivElement>(null);

    // Sync auth state
    useEffect(() => {
        const syncUser = () => {
            try {
                const storedUser = localStorage.getItem("zyroUser");
                const storedData = storedUser ? JSON.parse(storedUser) : null;
                const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
                setUser(isLoggedIn ? (storedData?.user ?? storedData) : null);
            } catch {
                setUser(null);
            }
        };

        syncUser();
        window.addEventListener("auth-state-change", syncUser);

        return () => {
            window.removeEventListener("auth-state-change", syncUser);
        };
    }, []);

    // Close mobile menu and dropdowns on route change
    useEffect(() => {
        setIsMenuOpen(false);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
    }, [location.pathname]);

    // Handle Escape key
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                if (isDesktopDropdownOpen || isMobileDropdownOpen) {
                    setIsDesktopDropdownOpen(false);
                    setIsMobileDropdownOpen(false);
                } else if (isMenuOpen) {
                    setIsMenuOpen(false);
                }
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isDesktopDropdownOpen, isMobileDropdownOpen, isMenuOpen]);

    // Handle Click Outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            if (desktopSearchRef.current && !desktopSearchRef.current.contains(target)) {
                setIsDesktopDropdownOpen(false);
            }
            if (mobileSearchRef.current && !mobileSearchRef.current.contains(target)) {
                setIsMobileDropdownOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Prevent body scroll when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isMenuOpen]);

    // Perform live search filtering
    useEffect(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            setSearchResults([]);
            setIsSearching(false);
            return;
        }

        setIsSearching(true);

        const timer = setTimeout(async () => {
            try {
                if (!allGamesCache.current) {
                    const games = await getGames();
                    allGamesCache.current = games;
                }

                const filtered = (allGamesCache.current || []).filter(
                    (game) =>
                        game.name.toLowerCase().includes(query) ||
                        game.genre.toLowerCase().includes(query) ||
                        (game.description && game.description.toLowerCase().includes(query))
                );

                setSearchResults(filtered.slice(0, 5));
            } catch {
                setSearchResults([]);
            } finally {
                setIsSearching(false);
            }
        }, 150);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    const closeMenu = () => {
        setIsMenuOpen(false);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
    };

    const toggleMenu = () => setIsMenuOpen((prev) => !prev);

    const handleSearchSubmit = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const trimmed = searchQuery.trim();
        if (trimmed) {
            closeMenu();
            navigate(`/games?search=${encodeURIComponent(trimmed)}`);
        }
    };

    const handleSelectGame = (gameId: string) => {
        closeMenu();
        setSearchQuery("");
        navigate(`/game/${gameId}`);
    };

    const handleClearSearch = () => {
        setSearchQuery("");
        setSearchResults([]);
        setIsDesktopDropdownOpen(false);
        setIsMobileDropdownOpen(false);
    };

    return (
        <>
            <header className={`navbar ${className}`}>
                <Link to="/" className="navbar-logo" onClick={closeMenu}>
                    <img src={zyroLogo} alt="Zyro Logo" className="navbar-logo-image" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="navbar-desktop-nav">
                    <ul className="navbar-list">
                        <li>
                            <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
                                Home
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/games" className={({ isActive }) => (isActive ? "active" : "")}>
                                Games
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/news" className={({ isActive }) => (isActive ? "active" : "")}>
                                News
                            </NavLink>
                        </li>
                        <li>
                            <NavLink to="/support" className={({ isActive }) => (isActive ? "active" : "")}>
                                Support
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Desktop Actions */}
                <div className="navbar-actions navbar-desktop-actions">
                    <div className="navbar-search-container" ref={desktopSearchRef}>
                        <form className="navbar-search-wrap" onSubmit={handleSearchSubmit} role="search">
                            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                                <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                            </svg>
                            <input
                                type="search"
                                placeholder="Search games..."
                                className="navbar-search"
                                value={searchQuery}
                                onChange={(e) => {
                                    setSearchQuery(e.target.value);
                                    setIsDesktopDropdownOpen(true);
                                }}
                                onFocus={() => {
                                    if (searchQuery.trim()) {
                                        setIsDesktopDropdownOpen(true);
                                    }
                                }}
                                autoComplete="off"
                                aria-label="Search games"
                            />
                            {searchQuery && (
                                <button
                                    type="button"
                                    className="navbar-search-clear"
                                    onClick={handleClearSearch}
                                    aria-label="Clear search"
                                >
                                    &times;
                                </button>
                            )}
                        </form>

                        {/* Desktop Search Dropdown */}
                        {isDesktopDropdownOpen && searchQuery.trim() && (
                            <div className="navbar-search-dropdown">
                                {isSearching ? (
                                    <div className="search-dropdown-message">
                                        <span className="search-spinner"></span>
                                        <span>Searching games...</span>
                                    </div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <div className="search-dropdown-header">
                                            <span>Matching Games</span>
                                        </div>
                                        <ul className="search-results-list">
                                            {searchResults.map((game) => (
                                                <li
                                                    key={game.id}
                                                    className="search-result-item"
                                                    onClick={() => handleSelectGame(game.id)}
                                                >
                                                    <img
                                                        src={game.imageURL}
                                                        alt={game.name}
                                                        className="search-result-thumb"
                                                    />
                                                    <div className="search-result-info">
                                                        <span className="search-result-title">{game.name}</span>
                                                        <span className="search-result-genre">{game.genre}</span>
                                                    </div>
                                                    <div className="search-result-price">
                                                        {game.hasDiscount ? (
                                                            <>
                                                                <span className="search-old-price">${game.price.toFixed(2)}</span>
                                                                <span className="search-sale-price">
                                                                    ${(game.price * game.discountRate).toFixed(2)}
                                                                </span>
                                                            </>
                                                        ) : (
                                                            <span>${game.price.toFixed(2)}</span>
                                                        )}
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                        <button
                                            type="button"
                                            className="search-dropdown-view-all"
                                            onClick={handleSearchSubmit}
                                        >
                                            View all results for "{searchQuery.trim()}" &rarr;
                                        </button>
                                    </>
                                ) : (
                                    <div className="search-dropdown-empty">
                                        <p>No games found matching "{searchQuery.trim()}"</p>
                                        <button
                                            type="button"
                                            className="search-dropdown-view-all"
                                            onClick={handleSearchSubmit}
                                        >
                                            Search in all games &rarr;
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {user ? (
                        <Link to="/profile">
                            <div className="navbar-user">
                                <span>Hi, {user.username || "Player"}</span>
                            </div>
                        </Link>
                    ) : (
                        <div className="navbar-auth-links">
                            <Link to="/login" className="navbar-login">
                                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.8"/>
                                    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                </svg>
                                Login
                            </Link>
                            <Link to="/signup" className="navbar-signup">
                                Sign up
                            </Link>
                        </div>
                    )}

                    {user && (
                        <Link to="/cart" className="navbar-cart" aria-label="Shopping cart">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h8.6a2 2 0 0 0 2-1.6L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="21" r="1.4" fill="currentColor"/>
                                <circle cx="18" cy="21" r="1.4" fill="currentColor"/>
                            </svg>
                        </Link>
                    )}
                </div>

                {/* Mobile Right Controls (Quick Cart + Hamburger Toggle) */}
                <div className="navbar-mobile-controls">
                    {user && (
                        <Link to="/cart" className="navbar-cart mobile-cart" aria-label="Shopping cart" onClick={closeMenu}>
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h8.6a2 2 0 0 0 2-1.6L22 8H6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                <circle cx="9" cy="21" r="1.4" fill="currentColor"/>
                                <circle cx="18" cy="21" r="1.4" fill="currentColor"/>
                            </svg>
                        </Link>
                    )}
                    <button
                        type="button"
                        className={`navbar-toggle-btn ${isMenuOpen ? "active" : ""}`}
                        onClick={toggleMenu}
                        aria-label="Toggle navigation menu"
                        aria-expanded={isMenuOpen}
                    >
                        <span className="burger-bar"></span>
                        <span className="burger-bar"></span>
                        <span className="burger-bar"></span>
                    </button>
                </div>
            </header>

            {/* Backdrop Overlay */}
            <div
                className={`navbar-backdrop ${isMenuOpen ? "active" : ""}`}
                onClick={closeMenu}
                aria-hidden="true"
            />

            {/* Slider Menu (Side Drawer) */}
            <aside className={`navbar-slider-menu ${isMenuOpen ? "open" : ""}`} aria-label="Mobile Navigation">
                <div className="navbar-drawer-header">
                    <Link to="/" className="navbar-drawer-logo" onClick={closeMenu}>
                        <img src={zyroLogo} alt="Zyro Logo" className="navbar-drawer-logo-img" />
                    </Link>
                    <button
                        type="button"
                        className="navbar-drawer-close"
                        onClick={closeMenu}
                        aria-label="Close navigation menu"
                    >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>

                {/* Mobile Drawer Search */}
                <div className="navbar-drawer-search-container" ref={mobileSearchRef}>
                    <form className="navbar-drawer-search" onSubmit={handleSearchSubmit} role="search">
                        <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8"/>
                            <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                        </svg>
                        <input
                            type="search"
                            placeholder="Search games..."
                            className="navbar-drawer-search-input"
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setIsMobileDropdownOpen(true);
                            }}
                            onFocus={() => {
                                if (searchQuery.trim()) {
                                    setIsMobileDropdownOpen(true);
                                }
                            }}
                            autoComplete="off"
                            aria-label="Search games"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                className="navbar-search-clear"
                                onClick={handleClearSearch}
                                aria-label="Clear search"
                            >
                                &times;
                            </button>
                        )}
                    </form>

                    {/* Mobile Search Dropdown */}
                    {isMobileDropdownOpen && searchQuery.trim() && (
                        <div className="navbar-search-dropdown">
                            {isSearching ? (
                                <div className="search-dropdown-message">
                                    <span className="search-spinner"></span>
                                    <span>Searching games...</span>
                                </div>
                            ) : searchResults.length > 0 ? (
                                <>
                                    <div className="search-dropdown-header">
                                        <span>Matching Games</span>
                                    </div>
                                    <ul className="search-results-list">
                                        {searchResults.map((game) => (
                                            <li
                                                key={game.id}
                                                className="search-result-item"
                                                onClick={() => handleSelectGame(game.id)}
                                            >
                                                <img
                                                    src={game.imageURL}
                                                    alt={game.name}
                                                    className="search-result-thumb"
                                                />
                                                <div className="search-result-info">
                                                    <span className="search-result-title">{game.name}</span>
                                                    <span className="search-result-genre">{game.genre}</span>
                                                </div>
                                                <div className="search-result-price">
                                                    {game.hasDiscount ? (
                                                        <>
                                                            <span className="search-old-price">${game.price.toFixed(2)}</span>
                                                            <span className="search-sale-price">
                                                                ${(game.price * game.discountRate).toFixed(2)}
                                                            </span>
                                                        </>
                                                    ) : (
                                                        <span>${game.price.toFixed(2)}</span>
                                                    )}
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                    <button
                                        type="button"
                                        className="search-dropdown-view-all"
                                        onClick={handleSearchSubmit}
                                    >
                                        View all results for "{searchQuery.trim()}" &rarr;
                                    </button>
                                </>
                            ) : (
                                <div className="search-dropdown-empty">
                                    <p>No games found matching "{searchQuery.trim()}"</p>
                                    <button
                                        type="button"
                                        className="search-dropdown-view-all"
                                        onClick={handleSearchSubmit}
                                    >
                                        Search in all games &rarr;
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Mobile Drawer Nav List */}
                <nav className="navbar-drawer-nav">
                    <ul className="navbar-drawer-list">
                        <li>
                            <NavLink
                                to="/"
                                end
                                className={({ isActive }) => `drawer-nav-item ${isActive ? "active" : ""}`}
                                onClick={closeMenu}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="drawer-icon">
                                    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                                    <polyline points="9 22 9 12 15 12 15 22"/>
                                </svg>
                                <span>Home</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/games"
                                className={({ isActive }) => `drawer-nav-item ${isActive ? "active" : ""}`}
                                onClick={closeMenu}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="drawer-icon">
                                    <rect x="2" y="6" width="20" height="12" rx="2"/>
                                    <path d="M6 12h4"/>
                                    <path d="M8 10v4"/>
                                    <circle cx="15" cy="11" r="1"/>
                                    <circle cx="17" cy="13" r="1"/>
                                </svg>
                                <span>Games</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/news"
                                className={({ isActive }) => `drawer-nav-item ${isActive ? "active" : ""}`}
                                onClick={closeMenu}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="drawer-icon">
                                    <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
                                    <path d="M18 14h-8"/>
                                    <path d="M15 18h-5"/>
                                    <path d="M10 6h8v4h-8V6Z"/>
                                </svg>
                                <span>News</span>
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/support"
                                className={({ isActive }) => `drawer-nav-item ${isActive ? "active" : ""}`}
                                onClick={closeMenu}
                            >
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="drawer-icon">
                                    <circle cx="12" cy="12" r="10"/>
                                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                                    <line x1="12" y1="17" x2="12.01" y2="17"/>
                                </svg>
                                <span>Support</span>
                            </NavLink>
                        </li>
                    </ul>
                </nav>

                {/* Mobile Drawer Auth/User Section */}
                <div className="navbar-drawer-footer">
                    {user ? (
                        <div className="drawer-user-box">
                            <div className="drawer-user-info">
                                <div className="drawer-avatar">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                        <circle cx="12" cy="8" r="4"/>
                                        <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" strokeLinecap="round"/>
                                    </svg>
                                </div>
                                <div className="drawer-user-text">
                                    <span className="drawer-user-welcome">Signed in as</span>
                                    <span className="drawer-user-name">{user.username || "Player"}</span>
                                </div>
                            </div>

                            <div className="drawer-user-links">
                                <Link to="/profile" className="drawer-user-btn" onClick={closeMenu}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="drawer-icon">
                                        <circle cx="12" cy="8" r="4"/>
                                        <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" strokeLinecap="round"/>
                                    </svg>
                                    <span>My Profile</span>
                                </Link>
                                <Link to="/my-orders" className="drawer-user-btn" onClick={closeMenu}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="drawer-icon">
                                        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/>
                                        <path d="M3 6h18"/>
                                        <path d="M16 10a4 4 0 0 1-8 0"/>
                                    </svg>
                                    <span>My Orders</span>
                                </Link>
                                <Link to="/cart" className="drawer-user-btn" onClick={closeMenu}>
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="drawer-icon">
                                        <path d="M3 3h2l2.4 12.2a2 2 0 0 0 2 1.8h8.6a2 2 0 0 0 2-1.6L22 8H6" strokeLinecap="round" strokeLinejoin="round"/>
                                        <circle cx="9" cy="21" r="1.4"/>
                                        <circle cx="18" cy="21" r="1.4"/>
                                    </svg>
                                    <span>Shopping Cart</span>
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="drawer-auth-box">
                            <Link to="/login" className="drawer-btn-login" onClick={closeMenu}>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                                    <circle cx="12" cy="8" r="4"/>
                                    <path d="M4 20c0-3.3 3.6-6 8-6s8 2.7 8 6" strokeLinecap="round"/>
                                </svg>
                                <span>Login</span>
                            </Link>
                            <Link to="/signup" className="drawer-btn-signup" onClick={closeMenu}>
                                <span>Sign up</span>
                            </Link>
                        </div>
                    )}
                </div>
            </aside>
        </>
    );
}

export default Navbar;
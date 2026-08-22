import Categories from "../../components/HomePage-Components/Categories/Categories";
import Features from "../../components/HomePage-Components/Features/Features";
import Hero from "../../components/HomePage-Components/Hero/Hero";
import TrendingGames from "../../components/HomePage-Components/TrendingGames/trendingGames";
import Footer from "../../components/Reusable-Components/Footer/Footer";
import Navbar from "../../components/Reusable-Components/Navbar/Navbar";

function HomePage() {
    return(
        <>
            <Navbar />
            <Hero />
            <TrendingGames />
            <Features />
            <Categories />
            <Footer />
        </>
    );
}

export default HomePage;
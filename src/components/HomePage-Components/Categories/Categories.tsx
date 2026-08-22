import React from "react";
import actionImage from "../../../assets/genres/Action.jpg";
import adventureImage from "../../../assets/genres/Adventure.jpg";
import puzzleImage from "../../../assets/genres/Puzzle.jpg";
import rpgImage from "../../../assets/genres/RPG.jpg";
import sportsImage from "../../../assets/genres/Sports.jpg";
import strategyImage from "../../../assets/genres/Strategy.jpg";
import "./Categories.css";

interface Category {
  name: string;
  image: string;
}

const categories: Category[] = [
  { name: "Action", image: actionImage },
  { name: "RPG", image: rpgImage },
  { name: "Strategy", image: strategyImage },
  { name: "Adventure", image: adventureImage },
  { name: "Puzzle", image: puzzleImage },
  { name: "Sports", image: sportsImage },
];

const Categories: React.FC = () => {
  return (
    <section className="categories" aria-labelledby="categories-heading">
      <div className="categories__header">
        <div className="categories__eyebrow">
          <span className="categories__eyebrow-line" aria-hidden="true" />
          <span>Categories</span>
          <span className="categories__eyebrow-line" aria-hidden="true" />
        </div>
        <h2 id="categories-heading" className="categories__title">
          Discover all
          <br />
          categories you <span className="categories__title-accent">love</span>
        </h2>
      </div>

      <div className="categories__grid">
        {categories.map((category) => (
          <button
            key={category.name}
            type="button"
            className="category-card"
          >
            <img
              className="category-card__image"
              src={category.image}
              alt=""
              aria-hidden="true"
            />
            <span className="category-card__name">{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
import React from "react";
import { Swords, Shield, Castle, Compass, Puzzle, Trophy } from "lucide-react";
import "./Categories.css";

interface Category {
  name: string;
  icon: React.ReactNode;
}

const ICON_SIZE = 26;

const categories: Category[] = [
  { name: "Action", icon: <Swords size={ICON_SIZE} strokeWidth={1.8} /> },
  { name: "RPG", icon: <Shield size={ICON_SIZE} strokeWidth={1.8} /> },
  { name: "Strategy", icon: <Castle size={ICON_SIZE} strokeWidth={1.8} /> },
  { name: "Adventure", icon: <Compass size={ICON_SIZE} strokeWidth={1.8} /> },
  { name: "Puzzle", icon: <Puzzle size={ICON_SIZE} strokeWidth={1.8} /> },
  { name: "Sports", icon: <Trophy size={ICON_SIZE} strokeWidth={1.8} /> },
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
            <span className="category-card__icon">{category.icon}</span>
            <span className="category-card__name">{category.name}</span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default Categories;
import React from "react";
import { Truck, Users, Rocket, Handshake, BookOpen } from "lucide-react";
import "./About.css";

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  isPresent?: boolean;
}

const milestones: Milestone[] = [
  {
    year: "2017",
    title: "Founded",
    description: "Small team unites.",
    icon: <Users size={20} strokeWidth={1.8} />,
  },
  {
    year: "2018",
    title: "Beta Launch",
    description: "First 1,000 core users.",
    icon: <Rocket size={20} strokeWidth={1.8} />,
  },
  {
    year: "2021",
    title: "Major Partnerships",
    description: "Key deals with independent publishers.",
    icon: <Handshake size={20} strokeWidth={1.8} />,
  },
  {
    year: "",
    title: "Expanding & Curating",
    description: "Focused catalog depth.",
    icon: <BookOpen size={20} strokeWidth={1.8} />,
    isPresent: true,
  },
];

const About: React.FC = () => {
  return (
    <section className="about" aria-labelledby="about-heading">
      <div className="about__grid">
        <div className="about__mission">
          <h2 id="about-heading" className="about__heading">
            Our Origin &amp; Mission
          </h2>

          <blockquote className="about__paragraph">
            <strong>Why we exist.</strong> We saw a broken digital game
            market: slow deliveries, inflated pricing, and uncurated
            catalogs. We created Zyro to solve these problems.
          </blockquote>

          <blockquote className="about__paragraph">
            Our mission is clear: to provide{" "}
            <strong>instant game delivery</strong>, transparent{" "}
            <strong>fair prices</strong>, and a{" "}
            <strong>strictly curated catalog</strong>. We're gamers who
            built the platform the platform we always wanted.
          </blockquote>
        </div>

        <div className="about__tagline">
          <p className="about__tagline-line">Play.</p>
          <p className="about__tagline-line about__tagline-line--buy">
            Buy.
            <span className="about__tagline-icon">
              <Truck size={26} strokeWidth={2} />
            </span>
          </p>
          <p className="about__tagline-line about__tagline-line--win">Win.</p>
        </div>
      </div>

      <div className="about__milestones">
        <h3 className="about__milestones-heading">Milestones &amp; Journey</h3>

        <ol className="milestones">
          {milestones.map((milestone) => (
            <li className="milestone" key={milestone.year}>
              <span className="milestone__icon">{milestone.icon}</span>
              <div className="milestone__body">
                <span className="milestone__year">
                  {milestone.year}
                  {milestone.isPresent && (
                    <span className="milestone__badge">Present</span>
                  )}
                </span>
                <span className="milestone__title">
                  {milestone.title.toUpperCase()}
                </span>
                <span className="milestone__description">
                  {milestone.description}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};

export default About;
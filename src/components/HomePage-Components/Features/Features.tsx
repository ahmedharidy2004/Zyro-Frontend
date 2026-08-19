import React from "react";
import "./Features.css";

type Feature = {
  icon: React.ReactNode;
  title: string;
  description: string;
};

const GamepadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="6" y1="12" x2="10" y2="12" />
    <line x1="8" y1="10" x2="8" y2="14" />
    <circle cx="15" cy="13" r="1" fill="currentColor" stroke="none" />
    <circle cx="18" cy="11" r="1" fill="currentColor" stroke="none" />
    <path d="M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a2 2 0 0 0 2 2c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 8.828 15h6.344a2 2 0 0 1 1.414.586L18 17c.5.5 1 1 2 1a2 2 0 0 0 2-2c0-1.544-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.152A4 4 0 0 0 17.32 5Z" />
  </svg>
);

const TagIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42Z" />
    <circle cx="7.5" cy="7.5" r="1.5" fill="currentColor" stroke="none" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1Z" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

const BoltIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
  </svg>
);

const HeadsetIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1v-6Zm0 0a9 9 0 1 1 18 0m0 0h-3a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h2a1 1 0 0 0 1-1v-6Z" />
    <path d="M21 19v1a3 3 0 0 1-3 3h-4" />
  </svg>
);

const GiftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="8" width="18" height="4" rx="1" />
    <path d="M12 8v13M19 12v7a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1v-7" />
    <path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" />
  </svg>
);

const features: Feature[] = [
  {
    icon: <GamepadIcon />,
    title: "Huge Game Collection",
    description:
      "From AAA titles to indie gems, explore a massive library of games for every type of gamer.",
  },
  {
    icon: <TagIcon />,
    title: "Best Prices",
    description:
      "We offer competitive prices and exclusive discounts so you can game more for less.",
  },
  {
    icon: <ShieldCheckIcon />,
    title: "Secure Checkout",
    description:
      "Your data and payments are always protected with top-notch security and privacy.",
  },
  {
    icon: <BoltIcon />,
    title: "Instant Delivery",
    description:
      "Get your games instantly after purchase and jump right into the action.",
  },
  {
    icon: <HeadsetIcon />,
    title: "24/7 Support",
    description:
      "Our support team is here for you anytime, any day. We've got your back!",
  },
  {
    icon: <GiftIcon />,
    title: "Rewards & Benefits",
    description:
      "Earn points with every purchase and unlock rewards, offers, and special perks.",
  },
];

const Features: React.FC = () => {
  return (
    <section className="zf-section" aria-labelledby="zf-heading">
      <div className="zf-container">
        <div className="zf-header">
          <div className="zf-eyebrow">
            <span className="zf-eyebrow-line" aria-hidden="true" />
            <span className="zf-eyebrow-text">Features</span>
            <span className="zf-eyebrow-line" aria-hidden="true" />
          </div>
          <h2 id="zf-heading" className="zf-heading">
            Why Gamers Choose Zyro
          </h2>
          <p className="zf-subheading">
            We&apos;re more than just a store — we&apos;re your ultimate gaming partner.
            <br />
            Here&apos;s what makes Zyro the best place to play.
          </p>
        </div>

        <div className="zf-grid">
          {features.map((feature) => (
            <div className="zf-card" key={feature.title}>
              <div className="zf-icon-wrap">
                <span className="zf-icon" aria-hidden="true">
                  {feature.icon}
                </span>
              </div>
              <h3 className="zf-card-title">{feature.title}</h3>
              <p className="zf-card-desc">{feature.description}</p>
              <span className="zf-card-underline" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
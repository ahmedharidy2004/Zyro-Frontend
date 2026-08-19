import React, { useState } from "react";
import { Mail, Clock, MapPin } from "lucide-react";
import "./Contact.css";

interface ContactFormState {
  fullName: string;
  email: string;
  orderNumber: string;
  subject: string;
  message: string;
}

const SUBJECT_OPTIONS = ["General Inquiry", "Order Status", "Technical Support"];

const Contact: React.FC = () => {
  const [form, setForm] = useState<ContactFormState>({
    fullName: "",
    email: "",
    orderNumber: "",
    subject: SUBJECT_OPTIONS[0],
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Hook up to your submission endpoint here.
    console.log("Contact form submitted:", form);
  };

  return (
    <section className="contact" aria-labelledby="contact-heading">
      <div className="contact__header">
        <div className="contact__eyebrow">Contact Us</div>
        <h2 id="contact-heading" className="contact__title">
          Get in <span className="contact__title-accent">touch</span>
        </h2>
        <p className="contact__subtitle">
          Have questions, feedback, or need support? Our team is here to help!
        </p>
      </div>

      <div className="contact__panels">
        <div className="contact-panel contact-panel--form">
          <h3 className="contact-panel__heading">Send Us a Message</h3>

          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="contact-form__field">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="orderNumber">
                  Order Number <span className="contact-form__optional">(Optional)</span>
                </label>
                <input
                  id="orderNumber"
                  name="orderNumber"
                  type="text"
                  value={form.orderNumber}
                  onChange={handleChange}
                />
              </div>
              <div className="contact-form__field">
                <label htmlFor="subject">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                >
                  {SUBJECT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="contact-form__submit">
              Submit Message
            </button>
          </form>
        </div>

        <div className="contact-panel contact-panel--details">
          <h3 className="contact-panel__heading">Contact Details</h3>

          <ul className="contact-details">
            <li className="contact-details__item">
              <span className="contact-details__icon">
                <Mail size={18} strokeWidth={1.8} />
              </span>
              <span>support@zyrogamestore.com</span>
            </li>
            <li className="contact-details__item">
              <span className="contact-details__icon">
                <Clock size={18} strokeWidth={1.8} />
              </span>
              <span>
                Support Hours:
                <br />
                Monday - Friday, 9 AM - 6 PM EST
              </span>
            </li>
            <li className="contact-details__item">
              <span className="contact-details__icon">
                <MapPin size={18} strokeWidth={1.8} />
              </span>
              <span>
                Zyro Game Store,
                <br />
                101 Pixel Lane,
                <br />
                Neo-Veridia, NV 90210
              </span>
            </li>
          </ul>

          <h3 className="contact-panel__heading contact-panel__heading--social">
            Connect With Us
          </h3>
          <div className="contact-social">
            <a
              href="https://facebook.com"
              className="contact-social__link"
              aria-label="Facebook"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M13.5 21v-7.5h2.5l.4-3H13.5V8.5c0-.87.24-1.46 1.5-1.46h1.6V4.36C16.3 4.25 15.4 4.16 14.36 4.16c-2.24 0-3.77 1.37-3.77 3.88V10.5H8.1v3h2.49V21h2.91Z" />
              </svg>
            </a>
            <a
              href="https://instagram.com"
              className="contact-social__link"
              aria-label="Instagram"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="12" cy="12" r="3.4" stroke="currentColor" strokeWidth="1.6" />
                <circle cx="16.4" cy="7.6" r="0.9" fill="currentColor" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              className="contact-social__link"
              aria-label="YouTube"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="m10 15 5.2-3-5.2-3v6Zm11.6-8.42c.24.9.4 2.1.4 3.42v1.9c0 1.32-.16 2.52-.4 3.42-.24.87-.9 1.5-1.75 1.7C18.4 17.5 12 17.5 12 17.5s-6.4 0-7.85-.48a2.3 2.3 0 0 1-1.75-1.7C2.16 14.52 2 13.32 2 12v-1.9c0-1.32.16-2.52.4-3.42.24-.87.9-1.52 1.75-1.72C5.6 4.5 12 4.5 12 4.5s6.4 0 7.85.46c.85.2 1.5.85 1.75 1.72Z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
import { useState } from "react";

export default function FaqSection({ t }) {
  const items = t.faqItems || [];
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="faq-section container" id="faq" aria-labelledby="faq-title">
      <div className="faq-shell">
        <header className="faq-header">
          <p className="faq-kicker">{t.faqKicker}</p>
          <h2 id="faq-title">{t.faqTitle}</h2>
          <p className="faq-lead">{t.faqLead}</p>
        </header>

        <div className="faq-grid">
          {items.map((item) => {
            const isOpen = openId === item.id;
            return (
              <article
                key={item.id}
                className={`faq-item${isOpen ? " open" : ""}`}
              >
                <button
                  type="button"
                  className="faq-question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-panel-${item.id}`}
                  id={`faq-button-${item.id}`}
                  onClick={() => toggle(item.id)}
                >
                  <span>{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                <div
                  className="faq-answer"
                  id={`faq-panel-${item.id}`}
                  role="region"
                  aria-labelledby={`faq-button-${item.id}`}
                  hidden={!isOpen}
                >
                  <p>{item.answer}</p>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

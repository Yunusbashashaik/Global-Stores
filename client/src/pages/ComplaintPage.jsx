import { Link } from "react-router-dom";
import ComplaintForm from "../components/ComplaintForm.jsx";

export default function ComplaintPage({ t }) {
  return (
    <main className="complaint-page">
      <section className="complaint-section container">
        <p className="complaint-back">
          <Link to="/">← {t.backToHome}</Link>
        </p>
        <h1 className="complaint-page-title">{t.complaintTitle}</h1>
        <p className="complaint-page-lead">{t.complaintLead}</p>
        <ComplaintForm t={t} />
      </section>
    </main>
  );
}

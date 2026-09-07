export default function OwnerBlock({ label, text }) {
  if (!text) return null;
  return (
    <section className="owner-block">
      {label ? <p className="owner-block-label">{label}</p> : null}
      <p className="modal-owners">{text}</p>
    </section>
  );
}

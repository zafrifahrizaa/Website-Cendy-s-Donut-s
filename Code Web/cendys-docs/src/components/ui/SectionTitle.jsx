export default function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-3xl md:text-4xl font-display font-bold text-choco-900">{title}</h2>
      {subtitle && <p className="text-choco-600 mt-2">{subtitle}</p>}
    </div>
  );
}

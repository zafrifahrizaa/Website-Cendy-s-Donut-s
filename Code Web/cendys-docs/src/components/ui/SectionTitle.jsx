export default function SectionTitle({ title, subtitle, className = "" }) {
  return (
    <div className={`mb-6 sm:mb-10 ${className}`}>
      <h2 className="text-4xl sm:text-5xl md:text-7xl leading-[1.05] sm:leading-[0.95] text-choco-900">{title}</h2>
      {subtitle && <p className="text-choco-600 mt-3 sm:mt-4 max-w-md text-sm sm:text-[15px] leading-relaxed md:inline-block">{subtitle}</p>}
    </div>
  );
}

/**
 * Tanda plus mini di keempat sudut container (ala layout arsitektur / editorial index).
 * Parent wajib `relative`. `inside` menaruh tanda di dalam sudut; default menempel di tepi luar.
 */
export default function CornerMarks({ inside = false, className = "text-brand-500" }) {
  const o = inside ? '10px' : '-6px';
  const pos = [
    { top: o, left: o },
    { top: o, right: o },
    { bottom: o, left: o },
    { bottom: o, right: o },
  ];
  return (
    <>
      {pos.map((style, i) => (
        <svg
          key={i}
          aria-hidden="true"
          width="12"
          height="12"
          viewBox="0 0 12 12"
          className={`absolute pointer-events-none ${className}`}
          style={style}
        >
          <path d="M6 0v12M0 6h12" stroke="currentColor" strokeWidth="1" fill="none" />
        </svg>
      ))}
    </>
  );
}


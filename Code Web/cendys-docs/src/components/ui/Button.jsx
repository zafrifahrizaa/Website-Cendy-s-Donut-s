export default function Button({ children, onClick, className = "", variant = "primary", ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-5 py-3 font-medium text-[13px] uppercase tracking-[0.14em] rounded-none border transition-all duration-200 select-none touch-manipulation min-h-[44px] active:scale-[0.98]";
  const variants = {
    primary: "bg-brand-500 text-cream-50 border-brand-500 hover:bg-choco-900 hover:border-choco-900 active:bg-choco-900 active:border-choco-900",
    secondary: "bg-transparent text-choco-900 border-choco-900 hover:bg-choco-900 hover:text-cream-50 active:bg-choco-900 active:text-cream-50",
    whatsapp: "bg-wa-500 text-cream-50 border-wa-500 hover:bg-wa-600 hover:border-wa-600 active:bg-wa-600 active:border-wa-600",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

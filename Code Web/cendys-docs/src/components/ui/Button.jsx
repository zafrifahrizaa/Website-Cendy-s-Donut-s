export default function Button({ children, onClick, className = "", variant = "primary", ...props }) {
  const baseStyle = "inline-flex items-center justify-center px-4 py-2 font-medium rounded-xl transition-colors";
  const variants = {
    primary: "bg-brand-500 text-white hover:bg-brand-600",
    secondary: "bg-cream-100 text-choco-900 hover:bg-cream-50",
    whatsapp: "bg-wa-500 text-white hover:bg-wa-600",
  };
  return (
    <button onClick={onClick} className={`${baseStyle} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
}

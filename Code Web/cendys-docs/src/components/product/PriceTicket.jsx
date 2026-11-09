import PriceDisplay from './PriceDisplay';

/**
 * Modul harga bergaya kupon / struk butik:
 * stub kiri berisi nomor produk + harga, stub kanan (opsional) berisi aksi.
 */
export default function PriceTicket({ price, code, children, className = "" }) {
  return (
    <div className={`ticket flex items-stretch justify-between ${className}`}>
      <div className="flex flex-col justify-center px-4 py-2 min-w-0">
        {code && (
          <span className="font-mono text-[8px] sm:text-[9px] uppercase tracking-[0.2em] text-choco-600 mb-0.5">
            {code}
          </span>
        )}
        <PriceDisplay price={price} />
      </div>
      {children && <div className="ticket-stub flex items-center px-2.5">{children}</div>}
    </div>
  );
}


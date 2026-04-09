"use client";

import { useRef } from "react";

// ======================================================
// HorizontalCarousel
// Componente base de carrossel horizontal reutilizável.
// Foco em mobile:
// - scroll nativo com snap suave
// - toque natural no celular
// - controles opcionais para desktop/tablet
// ======================================================
export default function HorizontalCarousel({
  children,
  className = "",
  trackClassName = "",
  itemClassName = "min-w-[82%] sm:min-w-[360px]",
  ariaLabel = "Carrossel horizontal",
  showControls = true,
}) {
  const trackRef = useRef(null);

  // ====================================================
  // Move o carrossel por uma fração da largura visível
  // para manter navegação consistente em telas diferentes.
  // ====================================================
  function scrollByStep(direction) {
    const node = trackRef.current;
    if (!node) return;

    const amount = Math.max(Math.round(node.clientWidth * 0.86), 260);
    node.scrollBy({
      left: direction * amount,
      behavior: "smooth",
    });
  }

  return (
    <div className={`relative ${className}`}>
      {/* Controles discretos, opcionais e pensados para telas maiores */}
      {showControls ? (
        <>
          <button
            type="button"
            onClick={() => scrollByStep(-1)}
            aria-label="Voltar no carrossel"
            className="
              absolute left-1 top-1/2 z-20 hidden -translate-y-1/2 rounded-full
              border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold
              text-slate-700 shadow-sm backdrop-blur transition hover:bg-white
              sm:inline-flex
            "
          >
            ‹
          </button>

          <button
            type="button"
            onClick={() => scrollByStep(1)}
            aria-label="Avançar no carrossel"
            className="
              absolute right-1 top-1/2 z-20 hidden -translate-y-1/2 rounded-full
              border border-slate-200 bg-white/90 px-3 py-2 text-sm font-semibold
              text-slate-700 shadow-sm backdrop-blur transition hover:bg-white
              sm:inline-flex
            "
          >
            ›
          </button>
        </>
      ) : null}

      {/* Trilha com rolagem horizontal suave e snap */}
      <div
        ref={trackRef}
        aria-label={ariaLabel}
        className={`
          flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2
          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden
          ${trackClassName}
        `}
      >
        {Array.isArray(children)
          ? children.map((child, index) => (
              <div
                key={index}
                className={`snap-start shrink-0 ${itemClassName}`}
              >
                {child}
              </div>
            ))
          : (
            <div className={`snap-start shrink-0 ${itemClassName}`}>
              {children}
            </div>
          )}
      </div>
    </div>
  );
}

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ======================================================
  // Configuracao para build mobile com Capacitor:
  // - output: "export" gera pasta "out" com index.html final.
  // - images.unoptimized evita quebra de export estatico com next/image.
  // Mantemos essa base para rodar no Android sem quebrar o projeto web.
  // ======================================================
  output: "export",
  images: {
    unoptimized: true,
  },
  // trailingSlash ajuda no roteamento estatico em alguns cenarios.
  // Mantido como opcional seguro para export mobile.
  trailingSlash: true,
};

export default nextConfig;

import type { CapacitorConfig } from "@capacitor/cli";

// ======================================================
// Configuração do Capacitor para o Fitelligence
// ------------------------------------------------------
// - webDir: aponta para build estático do Next (out)
// - androidScheme: força HTTP (evita bloqueio HTTPS → HTTP)
// - allowMixedContent: garante comunicação com API local
// ======================================================

const config: CapacitorConfig = {
  appId: "com.fitelligence.app",
  appName: "Fitelligence",

  // Pasta gerada pelo Next com output: "export"
  webDir: "out",

  

  // ======================================================
  // 🔥 CORREÇÃO CRÍTICA (resolve "Failed to fetch")
  // ------------------------------------------------------
  // Força o app Android a rodar em HTTP (não HTTPS)
  // evitando bloqueio de requisições para API local
  // ======================================================
  server: {
    androidScheme: "http",
  },

  // ======================================================
  // Configuração Android
  // ======================================================
  android: {
    // Permite comunicação HTTP (API local)
    allowMixedContent: true,
  },
};

export default config;
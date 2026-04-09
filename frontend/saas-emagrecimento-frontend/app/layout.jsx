import "./globals.css";
import Providers from "../src/providers/Providers";

export const metadata = {
  title: "Fitelligence",
  description: "Plataforma inteligente de evolução física com IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

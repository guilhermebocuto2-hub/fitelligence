import "./globals.css";
import Providers from "../src/providers/Providers";

export const metadata = {
  title: "Fitelligence",
  description: "Plataforma inteligente de evoluï¿½ï¿½o fï¿½sica com IA",
};

export default function RootLayout({ children }) {
  return (
    <html lang="pt-BR" className="dark" suppressHydrationWarning>
      <head>
        <meta charSet="UTF-8" />
        <script
          dangerouslySetInnerHTML={{
            __html: 'console.log("Encoding UTF-8 ativo");',
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('fitelligence-theme');if(t==='light'){document.documentElement.classList.remove('dark');}else{document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}


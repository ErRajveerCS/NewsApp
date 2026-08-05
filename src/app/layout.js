import "./globals.css";

export const metadata = {
  title: "The Daily Wire Desk",
  description: "Breaking news, business, technology, sports and more.",
  other: {
    "color-scheme": "light",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();`,
          }}
        />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          "--font-display": "'Iowan Old Style', 'Palatino Linotype', Georgia, serif",
          "--font-body": "'Inter', ui-sans-serif, system-ui, sans-serif",
          "--font-mono": "'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace",
        }}
      >
        {children}
      </body>
    </html>
  );
}

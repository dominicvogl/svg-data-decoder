// app/layout.js
import './globals.css';

export const metadata = {
    title: 'SVG Konverter',
    description: 'Konvertiere Data URL SVGs in normales SVG Format',
};

export default function RootLayout({ children }) {
    return (
        <html lang="de" data-theme="light">
        <body>
        {children}
        </body>
        </html>
    );
}
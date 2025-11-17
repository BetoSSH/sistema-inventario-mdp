import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BiolabLC - Laboratorio de Análisis Clínicos | 25 Años de Experiencia",
  description: "Laboratorio clínico líder con 25 años de experiencia en análisis médicos. Ofrecemos servicios profesionales de diagnóstico con tecnología de punta y atención personalizada.",
  keywords: ["BiolabLC", "laboratorio clínico", "análisis clínicos", "diagnóstico médico", "laboratorio de análisis", "salud", "exámenes médicos"],
  authors: [{ name: "BiolabLC" }],
  icons: {
    icon: "/biolab-logo.png",
  },
  openGraph: {
    title: "BiolabLC - Laboratorio de Análisis Clínicos",
    description: "25 años de experiencia en análisis clínicos profesionales. Reserva tu cita hoy.",
    url: "https://biolablc.com",
    siteName: "BiolabLC",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BiolabLC - Laboratorio de Análisis Clínicos",
    description: "25 años de experiencia en análisis clínicos profesionales",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}

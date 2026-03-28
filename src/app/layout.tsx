import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PedidoFácil — Gerencie suas encomendas",
  description: "Sistema de gerenciamento de encomendas para quem vende pelo Instagram. Cadastre pedidos, acompanhe status e nunca perca uma entrega.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}

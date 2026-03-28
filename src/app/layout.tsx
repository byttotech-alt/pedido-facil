import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "@/components/Sidebar";
import "./globals.css";

export const metadata: Metadata = {
  title: "PedidoFácil — Gerencie suas encomendas",
  description: "Sistema de gerenciamento de encomendas para SaaS.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const storeName = user?.user_metadata?.store_name || '';

  return (
    <html lang="pt-BR">
      <body>
        {user ? (
          <div className="app-shell">
            <Sidebar storeName={storeName} />
            <main className="app-main">{children}</main>
          </div>
        ) : (
          children
        )}
      </body>
    </html>
  );
}

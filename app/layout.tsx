import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">

        <div className="flex">

          <Sidebar />

          <div className="flex-1">

            <Navbar />

            <main className="p-8">
              {children}
            </main>

          </div>

        </div>

      </body>
    </html>
  );
}
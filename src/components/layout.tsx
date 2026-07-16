import { useEffect, useState } from 'react';
import { useData } from '@context/data';
import { useNavigate } from 'react-router-dom';
import { routes } from '@/utils/routesEnum';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@components/ui/sidebar';
import { AppSidebar } from '@components/sidebar';
import { ThemeToggle } from '@components/ThemeToggle';
import { X } from 'lucide-react';


export default function Layout({ children }: { children: React.ReactNode }) {
  const { sync_metadata, datasets } = useData();
  const navigate = useNavigate();
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    
    const bannerDismissed = localStorage.getItem('bannerDismissed');
    if (!bannerDismissed) {
      setShowBanner(true);
    }
    sync_metadata();
  }, []);

  const hideBanner = () => {
    setShowBanner(false);
    localStorage.setItem('bannerDismissed', 'true');
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset className="flex min-h-dvh flex-col">
        {showBanner && (
          <div className="flex items-center justify-between gap-3 border-b bg-amber-300 p-1 text-sm text-black">
            <div className="flex flex-1 items-center justify-center gap-1">
              <span>Trabalho em andamento. Veja como </span>
              <button
                type="button"
                className="cursor-pointer text-blue-500 hover:text-blue-700"
                onClick={() => navigate(routes.contribuidores)}
              >
                Contribuir
              </button>
            </div>
            <button
              type="button"
              className="rounded-md hover:bg-black/10 hover:text-black hover:cursor-pointer"
              aria-label="Fechar aviso"
              onClick={hideBanner}
            >
              <X/>
            </button>
          
          </div>
        )}
        <div className="flex items-center justify-between p-2 border-b">
          <SidebarTrigger />
          <ThemeToggle />
        </div>

        <main className="flex flex-1 h-screen">
          {children}
        </main>

        <footer className="text-muted-foreground text-sm flex flex-col items-center py-2">
          <p>
            {new Date().getFullYear()} ABC da Amazônia wiki - by{" "}
            <a
              className="text-foreground hover:text-primary transition cursor-pointer"
              onClick={() => navigate(routes.contribuidores)}
            >
              alanmarinho
              {datasets.episodios?.meta?.github?.contributors_count > 1 &&
                ` e +${datasets.episodios.meta.github.contributors_count - 1} colaboradores`
              }
            </a>
          </p>
        </footer>

      </SidebarInset>
    </SidebarProvider>
  );
}
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader } from "lucide-react";

import { useData } from "@/context/data";
import { useEpisodiosFiltrados } from "@context/episodios_filtrados";

import { EpisodioDestaque } from "@components/episodio_destaque";
import Page404 from "@pages/404Page";
import { Button } from "@components/ui/button";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";


export default function EpisodioPage() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const { datasets } = useData();
  const { defineEpisodioAtual, getNavegacaoEpisodios } = useEpisodiosFiltrados();

  const episodios = datasets.episodios?.episodes ?? [];

  const episodio = episodios.find(
    (e: any) => e.slug === slug
  );

  useEffect(() => {
    if (episodio) {
      defineEpisodioAtual(episodio);
    }
  }, [episodio]);

  if (!datasets.episodios) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!episodio) {
    return <Page404 />;
  }
  const { atual, anterior, proximo } = getNavegacaoEpisodios({ slug: episodio.slug });


  return (
    <div className="flex flex-col flex-1 p-2 pl-5 pr-5">
      <Helmet>
        <title>ABC da Amazônia wiki - {episodio.titulo}</title>
        <meta
          name="description"
          content={`Assista ao episódio "${episodio.titulo}".  ${episodio.videos[0]?.transcricao.slice(0, 160)}...`}
        />
      </Helmet>
      <div className="flex items-center justify-between gap-4 pb-2">
        <Button
          type="button"
          onClick={() => navigate(`/episodios/${anterior}`)}
          disabled={!anterior}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:opacity-50 hover:cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
          Anterior
        </Button>

        <Button
          type="button"
          disabled={!proximo}
          onClick={() => navigate(`/episodios/${proximo}`)}
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm hover:opacity-50 hover:cursor-pointer disabled:opacity-50 disabled:hover:bg-transparent disabled:hover:cursor-not-allowed"
        >
          Próximo
          <ChevronRight size={16} />
        </Button>

      </div>
      <EpisodioDestaque episodio={episodio} />


    </div>
  );
}
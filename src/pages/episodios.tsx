import { useEffect, useMemo, useState } from "react";
import { TEpisodioStatus, useData, EEpisodioStatus } from "@/context/data";
import { EpisodioCard } from "@components/episodio_card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { routes } from "@utils/routesEnum";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { useEpisodiosFiltrados, EFiltro } from "@context/episodios_filtrados";
import { useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
const paginacao = 8


export default function EpisodiosPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const status = searchParams.get("status_episodios");
  const { episodiosFiltrados,
    search,
    setSearch,
    viewMode,
    setViewMode,
    setStatusEpisodios,
    statusEpisodios,
    usandoBuscaGlobal,
    allEpisodios,
    searchSource,
    setSearchSource
  } = useEpisodiosFiltrados();

  const [page, setPage] = useState(1);

  const statusDisponiveis = useMemo(() => {
    const lista = [];

    if (allEpisodios.some((e) => e.status === "completo")) {
      lista.push({
        value: "completo",
        label: EFiltro.completo,
      });
    }

    if (allEpisodios.some((e) => e.status === "parcial")) {
      lista.push({
        value: "parcial",
        label: EFiltro.parcial,
      });
    }

    if (allEpisodios.some((e) => e.status === "incompleto")) {
      lista.push({
        value: "incompleto",
        label: EFiltro.incompleto,
      });
    }

    if (allEpisodios.some((e) => e.status === "perdido")) {
      lista.push({
        value: "perdido",
        label: EFiltro.perdido,
      });
    }

    return lista;
  }, [allEpisodios]);

  const paginaAtual = useMemo(() => {
    const inicio = (page - 1) * paginacao;

    return episodiosFiltrados.slice(
      inicio,
      inicio + paginacao
    );

  }, [episodiosFiltrados, page]);

  const agrupados = useMemo(() => {
    const grupos: Record<string, any[]> = {};

    episodiosFiltrados
      .sort((a: any, b: any) =>
        a.titulo.localeCompare(b.titulo)
      )
      .forEach((episodio: any) => {

        const letra = episodio.titulo
          .charAt(0)
          .toUpperCase();

        if (!grupos[letra]) {
          grupos[letra] = [];
        }

        grupos[letra].push(episodio);
      });

    return grupos;
  }, [episodiosFiltrados]);

  useEffect(() => {
    if (status) {
      setStatusEpisodios(status as EEpisodioStatus);
    }
  }, [status]);

  useEffect(() => {
    setPage(1);
  }, [episodiosFiltrados]);

  return (
    <div className="flex flex-1 flex-col gap-6 p-10 pb-0">
      <Helmet>
        <title>ABC da Amazônia wiki - Episódios</title>
        <meta
          name="description"
          content="Lista de episódios do ABC da Amazônia. Assista, consulte transcrições, datas, informações e ajude a preservar esse patrimônio audiovisual."
        />
      </Helmet>

      <div className="flex gap-3">

        <Input
          placeholder="Buscar episódio..."
          value={searchSource === "episodios" ? search : ""}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchSource("episodios");
            setPage(1);
          }}
        />
        {statusDisponiveis.length > 0 && (
          <Select
            value={statusEpisodios}
            onValueChange={(value: EEpisodioStatus) => {
              setStatusEpisodios(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="todos">
                Todos os episódios
              </SelectItem>

              {statusDisponiveis.map((item) => (
                <SelectItem
                  key={item.value}
                  value={item.value}
                >
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Button
          variant={
            viewMode === "abc"
              ? "default"
              : "outline"
          }
          onClick={() => setViewMode("abc")}
        >
          ABC
        </Button>
        <Button
          variant={
            viewMode === "lista"
              ? "default"
              : "outline"
          }
          onClick={() => setViewMode("lista")}
        >
          Lista
        </Button>


      </div>
      {usandoBuscaGlobal && (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 p-3 text-sm dark:border-yellow-800 dark:bg-yellow-950">
          Nenhum episódio foi encontrado em{" "}
          <strong>{EFiltro[statusEpisodios]}</strong>. Exibindo resultados de todos os episódios mapeados, inconsistencias podem estar presentes.
        </div>
      )}


      {viewMode === "lista" && (

        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

            {paginaAtual.map((episodio: any) => (
              <EpisodioCard
                key={episodio.slug}
                episodio={episodio}
              />
            ))}

          </div>

          <div className="flex justify-center gap-3">

            <Button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Anterior
            </Button>

            <span className="flex items-center">
              {page} / {Math.ceil(episodiosFiltrados.length / paginacao)}
            </span>

            <Button
              disabled={
                page >= Math.ceil(
                  episodiosFiltrados.length / paginacao
                )
              }
              onClick={() => setPage(page + 1)}
            >
              Próxima
            </Button>

          </div>
        </>

      )}


      {viewMode === "abc" && (

        <div className="space-y-8">

          {Object.entries(agrupados).map(
            ([letra, itens]) => (

              <section key={letra}>

                <h2 className="text-3xl font-bold border-b mb-4">
                  {letra}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

                  {itens.map((episodio: any) => (

                    <EpisodioCard
                      key={episodio.slug}
                      episodio={episodio}
                    />

                  ))}

                </div>

              </section>

            ))}
          {agrupados && Object.keys(agrupados).length === 0 && (
            <div className="flex flex-col items-center justify-center gap-4 py-20">

              <p className="text-muted-foreground">
                Nenhum episódio encontrado.
              </p>
              <div className="text-center leading-snug">
                <span>
                  Lembre-se de que alguns episódios podem ainda não estar mapeados, incompletos ou perdidos.
                </span>
                <br />
                <span>
                  Se você tiver informações adicionais, considere <strong className="text-primary hover:underline hover:cursor-pointer" onClick={() => navigate(routes.colaboracao)}>contribuir</strong> para o acervo.
                </span>
              </div>
            </div>
          )}

        </div>

      )}

    </div>
  );
}
import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { EEpisodioStatus, IEpisodio, useData } from '@context/data';

type TViewMode = "lista" | "abc";
export enum EFiltro {
    completo = "Completos",
    incompleto = "Incompletos",
    parcial = "Parciais",
    perdido = "Perdidos",
    todos = "Todos"
}
type SearchSource = "sidebar" | "episodios" | null;
// ----------------
interface contextEpisodiosFiltrados {
    episodiosFiltrados: IEpisodio[];
    viewMode: TViewMode;
    setViewMode: (viewMode: TViewMode) => void;
    getNavegacaoEpisodios: ({ slug }: { slug?: string }) => {
        atual: IEpisodio | null;
        anterior: string | null;
        proximo: string | null;
    };
    search: string;
    setSearch: (search: string) => void;
    filterEpisodios: () => void;
    statusEpisodios: EEpisodioStatus;
    setStatusEpisodios: (status: EEpisodioStatus) => void;
    usandoBuscaGlobal: boolean;
    allEpisodios: IEpisodio[];
    defineEpisodioAtual: (slug: string) => void;
    episodioAtual: IEpisodio | null;
    searchSource: SearchSource;
    setSearchSource: (source: SearchSource) => void;
}
export const episodiosFiltradosContext = createContext<contextEpisodiosFiltrados>({} as contextEpisodiosFiltrados);
export const useEpisodiosFiltrados = () => {
    return useContext(episodiosFiltradosContext);
};

export const EpisodiosFiltradosContext = ({ children }: { children: ReactNode }) => {
    const { datasets } = useData();
    const [episodiosFiltrados, setEpisodiosFiltrados] = useState<IEpisodio[]>([]);
    const [allEpisodios, setAllEpisodios] = useState<IEpisodio[]>([]);
    const [statusEpisodios, setStatusEpisodios] = useState<EEpisodioStatus>("completo");
    const [viewMode, setViewMode] = useState<TViewMode>("abc");
    const [search, setSearch] = useState("");
    const [searchSource, setSearchSource] =useState<SearchSource>(null);
    const [episodioAtual, setEpisodioAtual] = useState<IEpisodio | null>(null);
    const [usandoBuscaGlobal, setUsandoBuscaGlobal] = useState(false);
    // ----------------


    function filterEpisodios() {
        let lista = [...allEpisodios];
        if (statusEpisodios !== "todos") {
            lista = lista.filter((ep) => ep.status === statusEpisodios);
        }
        if (search.trim()) {
            const busca = search.toLowerCase();
            const filtrados =
                lista.filter((ep) => ep.titulo.toLowerCase().includes(busca));
            if (filtrados.length > 0) {
                lista = filtrados;
            } else {
                lista = allEpisodios.filter((ep) => ep.titulo.toLowerCase().includes(busca));
            }
        }
        lista.sort((a, b) => a.titulo.localeCompare(b.titulo));
        const usandoBuscaGlobal =
            search.trim() !== "" &&
            statusEpisodios !== "todos" &&
            lista.some((ep: any) => ep.status !== statusEpisodios);
        setEpisodiosFiltrados(lista);
        setUsandoBuscaGlobal(usandoBuscaGlobal);
    }

    function defineEpisodioAtual(slug: string) {
        if (slug) {
            const ep = allEpisodios.find((ep) => ep.slug === slug) ?? null;
            setEpisodioAtual(ep);
        }
    }

    const getNavegacaoEpisodios = ({ slug }: { slug?: string }) => {
        const episodios = allEpisodios.filter(
            (ep) => ep.status === "completo"
        );

        const slugAtual = episodioAtual?.slug ?? slug;

        const atualIndex = slugAtual
            ? episodios.findIndex((ep) => ep.slug === slugAtual)
            : -1;

        return {
            atual: episodioAtual,
            anterior: atualIndex > 0 ? episodios[atualIndex - 1].slug : null,
            proximo: atualIndex >= 0 && atualIndex < episodios.length - 1 ? episodios[atualIndex + 1].slug : null,
        };
    };

    useEffect(() => {
        if (allEpisodios.length > 0) {
            filterEpisodios();
        }

    }, [
        allEpisodios,
        search,
        statusEpisodios
    ]);

    useEffect(() => {
        const completos = datasets.episodios?.episodes ?? [];
        const mapeados = datasets.episodios_mapeados?.items ?? [];

        const completosMap = new Map(
            completos.map((ep: any) => [ep.slug, ep])
        );

        setAllEpisodios(
            mapeados.map((item: any) => ({
                ...item,
                ...(completosMap.get(item.slug) ?? {}),
            }))
        );
    }, [datasets]);
    // -----------------------
    const value = {
        episodiosFiltrados,
        getNavegacaoEpisodios,
        viewMode,
        setViewMode,
        search,
        setSearch,
        filterEpisodios,
        statusEpisodios,
        setStatusEpisodios,
        usandoBuscaGlobal,
        allEpisodios,
        defineEpisodioAtual,
        episodioAtual,
        searchSource,
        setSearchSource
    };
    return <episodiosFiltradosContext.Provider value={value}>{children}</episodiosFiltradosContext.Provider>;
};
import { useEffect, useMemo, useState } from "react";
import { useData } from "@context/data";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { routes } from "@utils/routesEnum";
import { Helmet } from "react-helmet-async";

interface GithubUser {
    login: string;
    name: string | null;
    avatar_url: string;
    html_url: string;
    bio: string | null;
}

const POR_PAGINA = 6;

export default function ContribuidoresPage() {
    const { datasets } = useData();
    const navigate = useNavigate();

    const [contributors, setContributors] = useState<GithubUser[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);

    useEffect(() => {
        const loadContributors = async () => {
            const users =
                datasets.episodios?.meta?.github?.contributors ?? [];

            const data = await Promise.all(
                users.map(async (username: string) => {
                    const response = await fetch(
                        `https://api.github.com/users/${username}`
                    );

                    if (!response.ok) return null;

                    return response.json();
                })
            );

            setContributors(data.filter(Boolean));
        };

        loadContributors();
    }, [datasets]);

    const filtrados = useMemo(() => {
        const busca = search.trim().toLowerCase();

        if (!busca) return contributors;

        return contributors.filter((user) =>
            user.login.toLowerCase().includes(busca) ||
            user.name?.toLowerCase().includes(busca) ||
            user.bio?.toLowerCase().includes(busca)
        );
    }, [contributors, search]);

    useEffect(() => {
        setPage(1);
    }, [search]);

    const totalPaginas = Math.max(
        1,
        Math.ceil(filtrados.length / POR_PAGINA)
    );

    const paginaAtual = useMemo(() => {
        const inicio = (page - 1) * POR_PAGINA;

        return filtrados.slice(
            inicio,
            inicio + POR_PAGINA
        );
    }, [filtrados, page]);

    return (
        <div className="flex flex-1 flex-col gap-8 p-10">
            <Helmet>
                <title>ABC da Amazônia wiki - Contribuidores</title>
                <meta
                    name="description"
                    content="Lista de contribuidores da ABC da Amazônia. Conheça as pessoas que ajudam a construir este projeto colaborativo."
                />
            </Helmet>
            <div className="flex flex-col gap-4">
                <div className="text-center">
                    <h1 className="text-4xl font-bold">
                        Contribuidores
                    </h1>

                    <p className="mt-2 text-muted-foreground">
                        Pessoas que ajudam a construir a ABC da Amazônia Wiki
                    </p>
                    <p>Torne-se um contribuidor também! Acesse <strong onClick={() => navigate(routes.colaboracao)} className="text-blue-500 hover:cursor-pointer hover:underline">
                        Colaboração
                    </strong> e contribua.</p>
                </div>

                <Input
                    placeholder="Buscar colaborador..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="mx-auto max-w-md"
                />
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {paginaAtual.map((user) => (
                    <a
                        key={user.login}
                        href={user.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-col items-center rounded-xl border p-6 text-center transition hover:shadow-lg"
                    >
                        <img
                            src={user.avatar_url}
                            alt={user.login}
                            className="mb-4 h-24 w-24 rounded-full"
                        />

                        <h2 className="text-xl font-semibold">
                            {user.name ?? user.login}
                        </h2>

                        <span className="text-sm text-muted-foreground">
                            @{user.login}
                        </span>

                        {user.bio && (
                            <p className="mt-3 text-sm">
                                {user.bio}
                            </p>
                        )}
                    </a>
                ))}
            </div>

            {filtrados.length === 0 && (
                <>
                    <p className="text-center text-muted-foreground">
                        Nenhum colaborador encontrado.
                    </p>
                    <div className="text-center leading-snug">
                        <span>
                            O colaborador <strong>"{search}"</strong> deveria existir?
                        </span>
                        <br />
                        <span>Se sim, entre em contato com <a className="text-blue-500 hover:underline" href="https://github.com/alanmarinho" target="_blank" rel="noopener noreferrer">@alanmarinho</a>, informando quem e onde colaborou para que ele(a) possa ser adicionado(a).</span>
                    </div>
                </>
            )}

            {totalPaginas > 1 && (
                <div className="flex justify-center gap-3">
                    <Button
                        variant="outline"
                        disabled={page === 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Anterior
                    </Button>

                    <span className="flex items-center text-sm text-muted-foreground">
                        Página {page} de {totalPaginas}
                    </span>

                    <Button
                        variant="outline"
                        disabled={page === totalPaginas}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Próxima
                    </Button>
                </div>
            )}
        </div>
    );
}
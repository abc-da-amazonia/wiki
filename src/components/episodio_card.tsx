import { Copy, TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { routes } from "@utils/routesEnum";
import { useEpisodiosFiltrados } from "@context/episodios_filtrados";
import { useEffect, useState } from "react";

interface EpisodioCardProps {
    episodio: any;
}

export function EpisodioCard({ episodio }: EpisodioCardProps) {
    const navigate = useNavigate();

    const { setSearch, setSearchSource } = useEpisodiosFiltrados();

    const [videoDisponivel, setVideoDisponivel] = useState<boolean | null>(null);
    const [videoAtual, setVideoAtual] = useState<any>(null);

    const videos = episodio.videos ?? [];

    async function copiarTranscricao() {
        if (!videoAtual?.transcricao) return;

        await navigator.clipboard.writeText(videoAtual.transcricao);
    }

    function toTitleCase(text: string) {
        return text
            .toLocaleLowerCase("pt-BR")
            .replace(/(^|\s)\S/g, (char) =>
                char.toLocaleUpperCase("pt-BR")
            );
    }

    function youtubeId(url: string) {
        return url.match(
            /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/
        )?.[1];
    }

    function youtubeEmbed(url: string) {
        const id = youtubeId(url);

        return id
            ? `https://www.youtube.com/embed/${id}`
            : null;
    }


    useEffect(() => {
        let cancelado = false;

        async function verificarVideos() {
            setVideoDisponivel(null);
            setVideoAtual(null);

            if (!videos.length) {
                setVideoDisponivel(false);
                return;
            }

            for (const video of videos) {

                if (!video.url) continue;

                try {

                    const response = await fetch(
                        `https://www.youtube.com/oembed?url=${encodeURIComponent(video.url)}&format=json`
                    );


                    if (response.ok) {

                        if (!cancelado) {
                            setVideoAtual(video);
                            setVideoDisponivel(true);
                        }

                        return;
                    }

                } catch {
                    continue;
                }
            }

            if (!cancelado) {
                setVideoDisponivel(false);
            }
        }

        verificarVideos();


        return () => {
            cancelado = true;
        };

    }, [episodio.slug]);


    return (
        <div className="rounded-lg border p-4 space-y-3">

            <div className="flex items-center justify-between gap-2">

                <h3 className="font-semibold text-lg line-clamp-1">
                    {toTitleCase(episodio.titulo)}
                </h3>

                {episodio.status && (
                    <Button
                        size="sm"
                        onClick={() => {
                            navigate(`/episodios/${episodio.slug}`);
                            setSearch("");
                            setSearchSource(null);
                        }}
                    >
                        Detalhes
                    </Button>
                )}

            </div>


            {videoDisponivel !== false ? (

                videoDisponivel === null ? (

                    <div className="aspect-video flex items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                        Verificando vídeo...
                    </div>

                ) : (

                    <>
                        <div className="aspect-video overflow-hidden rounded-md bg-muted">

                            <iframe
                                src={youtubeEmbed(videoAtual.url) ?? ""}
                                title={episodio.titulo}
                                className="h-full w-full"
                                allowFullScreen
                            />

                        </div>


                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={copiarTranscricao}
                        >
                            <Copy className="mr-2 h-4 w-4" />
                            Copiar transcrição
                        </Button>
                    </>

                )

            ) : (

                <div className="rounded-md border bg-muted/40 p-4 text-sm">

                    <div className="mb-2 flex items-center gap-2 font-medium">

                        <TriangleAlert className="h-4 w-4" />

                        {episodio.status === "perdido"
                            ? "Episódio perdido"
                            : "Vídeo indisponível"}

                    </div>


                    {episodio.status === "perdido" ? (

                        <>
                            <p className="text-muted-foreground">
                                Este episódio é considerado <strong>perdido</strong>.
                                Até o momento não foi localizada nenhuma gravação conhecida.
                            </p>

                            <p className="mt-3 text-muted-foreground">
                                Caso possua uma gravação ou saiba onde encontrar uma fonte,
                                sua colaboração é muito importante.
                            </p>
                        </>

                    ) : (

                        <>
                            <p className="text-muted-foreground">
                                Nenhuma das fontes de vídeo cadastradas está disponível.
                            </p>

                            <p className="mt-3 text-muted-foreground">
                                O vídeo pode ter sido removido, tornado privado ou bloqueado
                                pelo proprietário.
                            </p>

                            <p className="mt-3 text-muted-foreground">
                                Caso encontre outra fonte, contribua adicionando a informação
                                ao projeto.
                            </p>

                            <p className="mt-3">
                                Acesse{" "}
                                <strong
                                    onClick={() => navigate(routes.colaboracao)}
                                    className="text-blue-500 hover:cursor-pointer hover:underline"
                                >
                                    Colaboração
                                </strong>{" "}
                                para ajudar.
                            </p>
                        </>

                    )}

                </div>

            )}

        </div>
    );
}
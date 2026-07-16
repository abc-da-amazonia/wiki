import { Badge } from "@/components/ui/badge";
import {
    Calendar,
    Check,
    ChevronLeft,
    ChevronRight,
    Clock,
    Copy,
    FileText,
    Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { IEpisodio, EEpisodioStatus } from "@context/data";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useEpisodiosFiltrados } from "@context/episodios_filtrados";
import { Button } from "@components/ui/button";

export interface EEpisodiosFilter {
    episodios_status: EEpisodioStatus | "todos";
    viewMode: "lista" | "abc";
    episodios_fitrados: IEpisodio[];
}

function youtubeEmbed(url: string) {
    const id = url.match(
        /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&]+)/,
    )?.[1];

    return id
        ? `https://www.youtube.com/embed/${id}`
        : null;
}

export function EpisodioDestaque({
    episodio,
}: {
    episodio: IEpisodio;
}) {
    const [videoAtual, setVideoAtual] = useState(0);
    const [copiado, setCopiado] = useState(false);
    const [videoDisponivel, setVideoDisponivel] = useState<boolean | null>(null);
    const [primeiroLoad, setPrimeiroLoad] = useState(true);

    const video = episodio.videos[videoAtual];

    const embed =
        video?.tipo === "youtube"
            ? youtubeEmbed(video.url)
            : null;

    async function copiar() {
        if (!video?.transcricao) return;

        await navigator.clipboard.writeText(
            video.transcricao,
        );

        setCopiado(true);

        setTimeout(() => {
            setCopiado(false);
        }, 1800);
    }

    const badgeColor = {
        completo: "bg-emerald-600",
        parcial: "bg-yellow-500",
        perdido: "bg-red-600",
        incompleto: "bg-muted-foreground",
    }[episodio.status];




   useEffect(() => {
    let cancelado = false;

    async function verificarVideo() {
        setVideoDisponivel(null);

        if (!video || video.tipo !== "youtube") {
            setVideoDisponivel(false);
            return;
        }

        try {
            const res = await fetch(
                `https://www.youtube.com/oembed?url=${encodeURIComponent(
                    video.url
                )}&format=json`
            );

            if (cancelado) return;

            if (res.ok) {
                setVideoDisponivel(true);
                return;
            }

        } catch {}

        if (cancelado) return;
        if (!primeiroLoad) {setVideoDisponivel(false); return;};


        if (videoAtual < episodio.videos.length - 1) {
            setVideoAtual((v) => v + 1);
        } else {
            setVideoDisponivel(false);
        }
    }

    verificarVideo();
    setPrimeiroLoad(false);


    return () => {
        cancelado = true;
    };

}, [videoAtual, episodio.videos]);

useEffect(() => {
    let cancelado = false;

    async function verificarVideoInicial() {
        if (!video || video.tipo !== "youtube") {
            setVideoDisponivel(false);
            return;
        }

        try {
            const res = await fetch(
                `https://www.youtube.com/oembed?url=${encodeURIComponent(
                    video.url
                )}&format=json`
            );

            if (!cancelado) {
                setVideoDisponivel(res.ok);
            }

        } catch {
            if (!cancelado) {
                setVideoDisponivel(false);
            }
        }
    }

    verificarVideoInicial();

    return () => {
        cancelado = true;
    };

}, [episodio]);
    return (
        <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border bg-background">

            <div className="border-b p-6 pb-0 h-min-max">

                <div className="flex items-start justify-between gap-4">

                    <div>

                        <h1 className="text-3xl font-bold">
                            {episodio.titulo}
                        </h1>

                        <div className="mt-2 mb-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>{episodio.slug}</span>
                            <span>•</span>
                            <span>Ano {episodio.ano}</span>
                            <span>•</span>
                            <span>Duração {video.duracao}s</span>
                        </div>

                    </div>

                    <Badge className={badgeColor}>
                        {episodio.status}
                    </Badge>

                </div>
            </div>

            <div className="grid min-h-0 flex-1 gap-6 overflow-hidden p-6 lg:grid-cols-[70%_30%]">

                <div className="flex min-h-0 flex-col gap-4">

                    {episodio.videos.length > 1 && (

                        <div className="flex items-center justify-between rounded-lg border p-3">

                            <div className="flex items-center gap-2">

                                <button
                                    onClick={() =>
                                        setVideoAtual((v) =>
                                            Math.max(0, v - 1)
                                        )
                                    }
                                    disabled={videoAtual === 0}
                                    className="rounded-md border p-2 disabled:opacity-30"
                                >
                                    <ChevronLeft size={18} />
                                </button>

                                <span className="font-semibold">
                                    {videoAtual + 1}/{episodio.videos.length}
                                </span>

                                <button
                                    onClick={() =>
                                        setVideoAtual((v) =>
                                            Math.min(
                                                episodio.videos.length - 1,
                                                v + 1,
                                            )
                                        )
                                    }
                                    disabled={
                                        videoAtual ===
                                        episodio.videos.length - 1
                                    }
                                    className="rounded-md border p-2 disabled:opacity-30"
                                >
                                    <ChevronRight size={18} />
                                </button>

                            </div>

                            <div className="flex gap-2">

                                {episodio.videos.map((_, i) => (

                                    <button
                                        key={i}
                                        onClick={() =>
                                            setVideoAtual(i)
                                        }
                                        className={`h-2 rounded-full transition-all ${i === videoAtual
                                            ? "w-8 bg-primary"
                                            : "w-2 bg-muted"
                                            }`}
                                    />

                                ))}

                            </div>

                        </div>

                    )}

                    {videoDisponivel === null ? (
                        <div className="flex flex-1 items-center justify-center rounded-xl border">
                            Verificando vídeo...
                        </div>
                    ) : videoDisponivel && embed ? (
                        <div className="flex-1 overflow-hidden rounded-xl border">
                            <iframe
                                src={embed}
                                title={episodio.titulo}
                                allowFullScreen
                                className="h-full w-full"
                            />
                        </div>
                    ) : (
                        <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-xl border text-muted-foreground">
                            <p>Vídeo indisponível :(</p>
                            <p>Possivelmente o vídeo foi removido ou não está público. </p>

                            {videoAtual < episodio.videos.length - 1 && (
                                <Button
                                    onClick={() => setVideoAtual((v) => v + 1)}
                                >
                                    Tentar próxima fonte
                                </Button>
                            )}
                        </div>
                    )}

                </div>

                <div className="flex h-full min-h-0 flex-col rounded-xl border">

                    <div className="flex items-center justify-between border-b p-4">

                        <div>

                            <h2 className="font-semibold">
                                Transcrição
                            </h2>
                            {episodio.videos.length > 1 && (
                                <p className="text-sm text-muted-foreground">
                                    Vídeo {videoAtual + 1} de{" "}
                                    {episodio.videos.length}
                                </p>
                            )}


                        </div>

                        <button
                            type="button"
                            onClick={copiar}
                            className={`
                                flex items-center gap-2
                                rounded-lg border
                                px-3 py-2
                                text-sm
                                transition-all
                                ${copiado
                                    ? "border-green-600 bg-green-600 text-white"
                                    : "hover:bg-muted"
                                }
                            `}
                        >
                            {copiado ? (
                                <>
                                    <Check size={16} />
                                    Copiado
                                </>
                            ) : (
                                <>
                                    <Copy size={16} />
                                    Copiar
                                </>
                            )}
                        </button>

                    </div>

                    <div className="min-h-0 flex-1 overflow-y-auto p-5">

                        {video?.transcricao ? (

                            <pre className="whitespace-pre-wrap font-sans leading-7">
                                {video.transcricao}
                            </pre>

                        ) : (

                            <div className="flex h-full items-center justify-center text-muted-foreground">

                                Nenhuma transcrição disponível.

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </div>
    );

}
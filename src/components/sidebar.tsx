import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    Home,
    Search,
    Users,
    Star,
    Sparkles,
    Film,
    Handshake,
    Info,
} from 'lucide-react';


import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import { Field, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarFooter,
} from '@/components/ui/sidebar';

import { routes } from '@/utils/routesEnum';
import { useData } from '@/context/data';
import { ProgressMapeamento } from './progress_mapeamento';
import { useEpisodiosFiltrados } from '@context/episodios_filtrados';

export function AppSidebar() {
    const navigate = useNavigate();
    const { datasets } = useData();
    const { search, setSearch, episodiosFiltrados, setSearchSource, searchSource } = useEpisodiosFiltrados()

    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const episodios = datasets.episodios?.items ?? [];


    const destaque = useMemo(() => {
        return episodios.slice(0, 5);
    }, [episodios]);

    const items = datasets.episodios_mapeados?.items ?? [];

    const completos = items.filter(
        (item: any) => item.status === "completo"
    ).length;

    const parciais = items.filter(
        (item: any) => item.status === "parcial"
    ).length;

    const incompletos = items.filter(
        (item: any) => !item.exists || item.status === "perdido"
    ).length;

    const perdidos = items.filter(
        (item: any) => item.status === "perdido"
    ).length;

    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setSearchSource(null);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);
    return (
        <Sidebar>
            <SidebarHeader className="border-b">
                <div
                    className="flex items-center gap-3 p-4 cursor-pointer"
                    onClick={() => navigate(routes.home)}
                >
                    <img
                        src="/logo.jpg"
                        className="h-14 w-14 rounded-lg object-cover"
                    />

                    <div>
                        <h1 className="font-bold text-md">
                            ABC da Amazônia
                        </h1>

                        <p className="text-xs text-muted-foreground">
                            Wiki
                        </p>
                    </div>
                </div>

            </SidebarHeader>

            <SidebarContent>

                <SidebarGroup className="p-3">

                    <div ref={wrapperRef} className="relative">


                        <Field>
                            <ButtonGroup>
                                <Input
                                    value={searchSource === "sidebar" ? search : ""}
                                    onFocus={() => setSearchSource("sidebar")}
                                    onChange={(e) => { setSearch(e.target.value); setSearchSource("sidebar"); }} id="input-button-group" placeholder="Buscar episódio..." />
                            </ButtonGroup>
                        </Field>

                        {search && searchSource === "sidebar" && (
                            <div className="absolute z-50 mt-2 w-full rounded-lg border bg-background shadow-lg">

                                {episodiosFiltrados.length > 0 ? (
                                    episodiosFiltrados.map((ep) => (
                                        <button
                                            key={ep.slug}
                                            onClick={() => {
                                                setSearch("");
                                                setSearchSource(null);
                                                navigate(`/episodios/${ep.slug}`);
                                            }}
                                            className="flex w-full items-center justify-between px-4 py-3 text-left  hover:bg-muted "
                                        >
                                            <span>{ep.titulo}</span>

                                            <span className="text-xs text-muted-foreground">
                                                {ep.status}
                                            </span>
                                        </button>
                                    ))
                                ) : (
                                    <div className="px-4 py-3 text-sm text-muted-foreground">
                                        Nenhum episódio encontrado.
                                    </div>
                                )}

                            </div>
                        )}

                    </div>

                </SidebarGroup>

                <SidebarGroup>

                    <p className="px-3 mb-2 text-xs uppercase text-muted-foreground">
                        Navegação
                    </p>
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => navigate(routes.home)}
                            className={`flex hover:cursor-pointer rounded-2xl items-center gap-3 px-3 py-2 rounded-mdtransition
                            ${isActive(routes.home)
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }
                        `}
                        >
                            <Home size={18} />
                            <span>Início</span>
                        </button>
                        <button
                            onClick={() => navigate(routes.episodios)}
                            className={`flex hover:cursor-pointer rounded-2xl items-center gap-3 px-3 py-2 rounded-mdtransition
                            ${isActive(routes.episodios)
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }
                        `}
                        >
                            <Film size={18} />
                            <span>Episódios</span>
                        </button>

                        <button
                            onClick={() => navigate(routes.contribuidores)}
                            className={`flex hover:cursor-pointer rounded-2xl items-center gap-3 px-3 py-2 rounded-mdtransition
                            ${isActive(routes.contribuidores)
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }
                        `}
                        >
                            <Users size={18} />
                            <span>Contribuidores</span>
                        </button>
                        <button
                            onClick={() => navigate(routes.colaboracao)}
                            className={`flex hover:cursor-pointer rounded-2xl items-center gap-3 px-3 py-2 rounded-mdtransition
                            ${isActive(routes.colaboracao)
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }
                        `}
                        >
                            <Handshake size={18} />
                            <span>Colaboração</span>
                        </button>
                        <button
                            onClick={() => navigate(routes.sobre)}
                            className={`flex hover:cursor-pointer rounded-2xl items-center gap-3 px-3 py-2 rounded-mdtransition
                            ${isActive(routes.sobre)
                                    ? "bg-primary text-primary-foreground"
                                    : "hover:bg-muted"
                                }
                        `}
                        >
                            <Info size={18} />
                            <span>Sobre</span>
                        </button>
                    </div>
                </SidebarGroup>

                <SidebarGroup>

                    {/* <p className="px-3 mb-2 flex items-center gap-2 text-xs uppercase text-muted-foreground">
                        <Star size={14} />
                        Em destaque
                    </p> */}

                    {destaque.map((ep: any) => (
                        <button
                            key={ep.id}
                            onClick={() => navigate(`/episodio/${ep.slug}`)}
                            className=" w-full text-left px-3 py-2 rounded-md hover:bg-muted">
                            {ep.titulo}
                        </button>
                    ))}

                </SidebarGroup>

            </SidebarContent>

            <SidebarFooter className="border-t p-4">

                <div className="space-y-1 text-xs text-muted-foreground">

                    <div className="flex items-center justify-between">
                        <span>Episódios</span>
                        <strong>{datasets.episodios?.meta?.total ?? 0}/{completos + parciais + incompletos}</strong>
                    </div>

                    <ProgressMapeamento completos={completos} parciais={parciais} incompletos={incompletos} perdidos={perdidos} />
                </div>
            </SidebarFooter>

        </Sidebar>
    );
}
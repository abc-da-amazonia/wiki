import { routes } from "@utils/routesEnum";
import { useNavigate } from "react-router-dom";

interface ProgressMapeamentoProps {
    completos: number;
    parciais: number;
    incompletos: number;
    perdidos: number;
}

export function ProgressMapeamento({
    completos,
    parciais,
    incompletos,
    perdidos,
}: ProgressMapeamentoProps) {
    const total = completos + parciais + incompletos + perdidos;

    const completosPct = total ? (completos / total) * 100 : 0;
    const parciaisPct = total ? (parciais / total) * 100 : 0;
    const incompletosPct = total ? (incompletos / total) * 100 : 0;
    const perdidosPct = total ? (perdidos / total) * 100 : 0;

    const navigate = useNavigate();

    return (
        <div className="space-y-2">
            <div className="flex h-4 overflow-hidden rounded-full border bg-muted">
                <div
                    className="bg-emerald-500 transition-all"
                    style={{ width: `${completosPct}%` }}
                    title={`${completosPct.toFixed(1)}% Completos`}
                />

                <div
                    className="bg-yellow-400 transition-all"
                    style={{ width: `${parciaisPct}%` }}
                    title={`${parciaisPct.toFixed(1)}% Parciais`}
                />
                <div
                    className="bg-red-400 transition-all"
                    style={{ width: `${perdidosPct}%` }}
                    title={`${perdidosPct.toFixed(1)}% Perdidos`}
                />

                <div
                    className="bg-muted-foreground/20 transition-all"
                    style={{ width: `${incompletosPct}%` }}
                    title={`${incompletosPct.toFixed(1)}% Incompletos`}
                />
            </div>
            <div className="flex items-center gap-1 flex-wrap text-xs text-muted-foreground">
                {completos > 0 && (
                    <span
                        onClick={() => navigate(`${routes.episodios}?status_episodios=completo`)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/10 hover:bg-emerald-500/20 cursor-pointer"
                        title="Completos"
                    >
                        <span className="h-2 w-2 rounded-full bg-emerald-500" />
                        {completos} completos
                    </span>
                )}

                {parciais > 0 && (
                    <span
                        onClick={() => navigate(`${routes.episodios}?status_episodios=parcial`)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-yellow-400/10 hover:bg-yellow-400/20 cursor-pointer"
                        title="Parciais"
                    >
                        <span className="h-2 w-2 rounded-full bg-yellow-400" />
                        {parciais} parciais
                    </span>
                )}

                {incompletos > 0 && (
                    <span
                        onClick={() => navigate(`${routes.episodios}?status_episodios=incompleto`)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-muted hover:bg-secondary/50 cursor-pointer"
                        title="Incompletos"
                    >
                        <span className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                        {incompletos} incompletos
                    </span>
                )}

                {perdidos > 0 && (
                    <span
                        onClick={() => navigate(`${routes.episodios}?status_episodios=perdido`)}
                        className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-red-400/10 hover:bg-red-400/20 cursor-pointer"
                        title="Perdidos"
                    >
                        <span className="h-2 w-2 rounded-full bg-red-400" />
                        {perdidos} perdidos
                    </span>
                )}
            </div>
        </div>
    );
}
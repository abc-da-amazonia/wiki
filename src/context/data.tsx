import { createContext, useContext, useState, type ReactNode } from 'react';
import { data_config } from '@utils/config';

interface IEpisodioVideo {
    tipo: string;
    duracao: number;
    url: string;
    transcricao: string;
}

export type TEpisodioStatus = 'completo' | 'incompleto' | 'parcial' | 'perdido';

export interface IEpisodio {
    titulo: string;
    slug: string;
    ano: number;
    status: TEpisodioStatus;
    versao: number;
    ativo: boolean;
    videos: IEpisodioVideo[];
}

interface IMetadataFile {
    file_name: string;
    url: string;
    format: string;
    hash: string;
    generated_at: string;
    generated_timestamp: number;
    size: number;
}

interface IMetadata {
    meta: {
        format: 'manifest';
        build_version: string;
        generated_at: string;
        generated_timestamp: number;
        total_files: number;
        hash: string;
    };
    files: Record<string, IMetadataFile>;
}

interface ISyncResult {
    updated: string[];
    changed: boolean;
}


export type EEpisodioStatus = TEpisodioStatus | "todos";



// ------------------------------------------

interface contextData {
    sync_metadata: () => Promise<void>;
    datasets: Record<string, any>;
    metadata: IMetadata | null;
}
export const dataContext = createContext<contextData>({} as contextData);
export const useData = () => {
    return useContext(dataContext);
};

export const DataContext = ({ children }: { children: ReactNode }) => {
    const [datasets, setDatasets] = useState<Record<string, any>>({});
    const [metadata, setMetadata] = useState<IMetadata | null>(null);

    const _get_remote_metadata = async (): Promise<IMetadata | null> => {
        try {
            const response = await fetch(
                `${data_config.base_url}/${data_config.endpoints.metadata}`,
                {
                    method: "GET",
                    cache: "no-cache",
                }
            );

            if (!response.ok) {
                console.error('Erro ao buscar metadata:', response.statusText);
                return null;
            }

            const data: IMetadata = await response.json();
            setMetadata(data);
            return data;
        } catch (err) {
            console.error('Erro ao chamar a API de metadata:', err);
            return null;
        }
    };

    const _get_local_metadata = (): IMetadata | null => {
        try {
            const metadata = localStorage.getItem('metadata');
            return metadata ? JSON.parse(metadata) : null;
        } catch (err) {
            console.error('Erro ao buscar metadata local:', err);
            return null;
        }
    }

    const _compare_metadata = (
        remote: IMetadata | null,
        local: IMetadata | null
    ): ISyncResult => {
        try {
            if (!remote) {
                return {
                    updated: [],
                    changed: false,
                };
            }

            if (!local) {
                return {
                    updated: Object.keys(remote.files),
                    changed: true,
                };
            }

            if (remote.meta.hash === local.meta.hash) {
                return {
                    updated: [],
                    changed: false,
                };
            }

            const updated: string[] = [];

            for (const [key, remoteFile] of Object.entries(remote.files)) {
                const localFile = local.files[key];

                if (!localFile || localFile.hash !== remoteFile.hash) {
                    updated.push(key);
                }
            }

            return {
                updated,
                changed: updated.length > 0,
            };
        } catch (err) {
            console.error("Erro ao comparar metadata:", err);

            return {
                updated: [],
                changed: false,
            };
        }
    };

    const _load_datasets = async (metadata: IMetadata) => {
        try {
            const loaded: Record<string, any> = {};

            for (const [key, file] of Object.entries(metadata.files)) {

                let json: any;

                const local = localStorage.getItem(file.file_name);

                if (local) {
                    json = JSON.parse(local);
                } else {
                    const response = await fetch(file.url);

                    if (!response.ok) {
                        throw new Error(`Erro ao baixar ${file.file_name}`);
                    }

                    json = await response.json();

                    localStorage.setItem(
                        file.file_name,
                        JSON.stringify(json)
                    );
                }

                loaded[key] = json;
            }
            setDatasets(loaded);
            _save_local_metadata(metadata);

        } catch (err) {
            console.error("Erro ao carregar datasets:", err);
        }
    };

    const _save_local_metadata = (metadata: IMetadata) => {
        try {
            localStorage.setItem(
                "metadata",
                JSON.stringify(metadata)
            );
        } catch (err) {
            console.error("Erro ao salvar metadata local:", err);
        }
    };

    const _update_datasets = async (
        remote: IMetadata,
        local: IMetadata | null
    ) => {
        const updated: Record<string, any> = {};

        for (const [key, file] of Object.entries(remote.files)) {

            const localFile = local?.files[key];

            if (!localFile || localFile.hash !== file.hash) {

                const response = await fetch(file.url);

                if (!response.ok) continue;

                const json = await response.json();

                localStorage.setItem(
                    file.file_name,
                    JSON.stringify(json)
                );

                updated[key] = json;
            }
        }

        if (Object.keys(updated).length) {
            setDatasets(prev => ({
                ...prev,
                ...updated,
            }));
        }
        _save_local_metadata(remote);
        setMetadata(remote);
    };

    const sync_metadata = async () => {
        try {
            const remote_metadata = await _get_remote_metadata();
            const local_metadata = _get_local_metadata();

            if (!remote_metadata) {
                console.error('Não foi possível obter a metadata remota.');
                return;
            }

            if (!local_metadata) {
                await _load_datasets(remote_metadata);
                return;
            }

            const { updated, changed } = await _compare_metadata(
                remote_metadata,
                local_metadata
            );

            if (!changed) {
                await _load_datasets(local_metadata);
                return;
            }

            await _update_datasets(
                remote_metadata,
                local_metadata
            );

        } catch (err) {
            console.error('Erro ao sincronizar metadata:', err);
        }
    };

    const value = {
        sync_metadata,
        datasets,
        metadata
    };
    return <dataContext.Provider value={value}>{children}</dataContext.Provider>;
};
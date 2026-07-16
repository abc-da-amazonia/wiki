import { useMemo, useState } from "react";
import { IEpisodio, useData } from "@context/data";
import { Button } from "@/components/ui/button";
import { ExternalLink, GitPullRequest, FileCode2 } from "lucide-react";
import { FaGithub } from "react-icons/fa"
import { data_config } from "@utils/config";
import { Helmet } from "react-helmet-async";

export default function ContribuicaoPage() {
    const { datasets } = useData();
    const [episodio, setEpisodio] = useState<IEpisodio | null>(null);

    const exemplo = useMemo(() => {
        let episodio = datasets.episodios?.episodes?.find(
            (ep: any) => ep.slug === "pato-no-tucupi" && ep.status === "completo"
        );

        if (!episodio) {
            episodio = datasets.episodios?.episodes?.find(
                (ep: any) => ep.status === "completo"
            );
        };
        if (!episodio) return "";
        setEpisodio(episodio);

        return `titulo: ${episodio.titulo}
slug: ${episodio.slug}
ano: ${episodio.ano}
status: ${episodio.status}
versao: ${episodio.versao}
ativo: true
videos:
  - tipo: ${episodio.videos?.[0]?.tipo ?? "youtube"}
    duracao: ${episodio.videos?.[0]?.duracao ?? 0}
    url: ${episodio.videos?.[0]?.url ?? ""}
    transcricao: |
${(episodio.videos?.[0]?.transcricao ?? "")
                .split("\n")
                .slice(0, 8)
                .map((l: string) => `      ${l}`)
                .join("\n")}
`;
    }, [datasets]);

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-10 p-10">
            <Helmet>
                <title>ABC da Amazônia wiki - Colabore</title>
                <meta
                    name="description"
                    content="Contribua com o acervo da ABC da Amazônia Wiki. Ajude a preservar esse patrimônio audiovisual."
                />
            </Helmet>

            <header className="space-y-4 text-center">
                <h1 className="text-4xl font-bold">
                    Contribua com o acervo
                </h1>

                <p className="mx-auto max-w-3xl text-muted-foreground">
                    A ABC da Amazônia Wiki é um projeto aberto. Toda informação,
                    transcrição, correção ou episódio encontrado ajuda a preservar
                    esse material e melhora a qualidade do acervo para todos.
                    Se você já utiliza Git e GitHub, contribuir leva poucos minutos.
                </p>
            </header>

            <section className="rounded-xl border p-8">
                <h2 className="mb-6 text-2xl font-semibold">
                    Fluxo de contribuição
                </h2>

                <div className="space-y-6">

                    <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                            1
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Clone do <a className="underline hover:cursor-pointer" href={`${data_config.repo_url}`} target="_blank" rel="noopener noreferrer">repositório de dados</a>
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Faça um clone do projeto, todas as informações da Wiki são geradas a partir desse repositório.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                            2
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Crie ou edite um episódio
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Cada episódio é um arquivo YAML. Basta criar um
                                novo arquivo ou editar um existente preenchendo
                                seus metadados e a transcrição.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                            3
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Commit + Pull Request
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                Abra um Pull Request com sua alteração apartir de uma nova branch. Após a
                                revisão e aprovação, o pipeline atualizará o
                                dataset utilizado pela Wiki.
                            </p>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">
                            4
                        </div>

                        <div>
                            <h3 className="font-semibold">
                                Crédito automático
                            </h3>

                            <p className="text-sm text-muted-foreground">
                                As contribuições são lidas diretamente pelo GitHub. Assim que seu PR
                                for aceito, seu usuário passa a aparecer automaticamente na página
                                de colaboradores do projeto.
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-4">

                        <div>
                            <p className="text-sm text-muted-foreground">
                                Informações detalhadas sobre o fluxo de contribuição podem ser encontradas no guia de <strong><a className="hover:underline hover:cursor-pointer" href={`${data_config.repo_url}/blob/main/docs/contribuicao.md`} target="_blank" rel="noopener noreferrer">Pull Request</a></strong> do repositório.
                            </p>
                        </div>
                    </div>

                </div>
            </section>

            <section className="rounded-xl border p-8">
                <div className="mb-5 flex items-center gap-3">
                    <FileCode2 className="h-6 w-6" />
                    <h2 className="text-2xl font-semibold">
                        Estrutura do arquivo
                    </h2>
                </div>

                <p className="mb-5 text-sm text-muted-foreground">
                    Os episódios são descritos em arquivos YAML. Abaixo está um exemplo
                    real gerado a partir do dataset atual do episódio (<strong><a className="hover:underline hove:cursor-pointer" href={`${data_config.repo_url}/tree/main/src/episodios/${episodio?.slug}-${episodio?.versao}.yaml`} target="_blank" rel="noopener noreferrer">{episodio?.slug}</a></strong>).
                </p>


                <pre className="overflow-x-auto rounded-lg bg-muted p-5 text-sm leading-6">
                    <code>{exemplo}</code>
                </pre>

                <div className="mt-5 mb-5 rounded-lg border border-blue-500/30 bg-blue-500/10 p-4 text-sm">
                    Apenas os primeiros trechos da transcrição foram exibidos
                    neste exemplo. O arquivo do episódio deve conter a
                    transcrição completa, tal como narrada.
                </div>
                <p className="mb-5 text-sm text-muted-foreground">Um episódio marcado com status "completo" não siginifica necessariamente que ele está 100% correto. Erros podem ser corrigidos a qualquer momento.</p>
                <p className="mb-5 text-sm text-muted-foreground">Quanto mais fontes de vídeos encontrar, melhor! Liste quantas encontrar, com links para os vídeos e suas respectivas transcrições.</p>
                <p className="mb-5 text-sm text-muted-foreground">Por hora, estamos coletando apenas episódios com vídeos hospedados na plataforma YouTube, caso encontre episódios em outras plataformas,
                    por favor, adicione-o a <strong><a className="hover:underline hover:cursor-pointer" href={`${data_config.repo_url}/blob/main/src/mapeamento/episodios_mapeados.txt`} target="_blank" rel="noopener noreferrer">lista de episódios mapeados</a></strong> *acaso
                    ainda não presentes lá* e no comentário da PR informe onde o encontrou que iremos verificar a viabilidade de listagem da nova fonte.</p>
            </section>

            <section className="rounded-xl border p-8">
                <h2 className="mb-4 text-2xl font-semibold">
                    Boas práticas
                </h2>

                <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                    <li>Utilize slugs estáveis e em kebab-case.</li>
                    <li>Mantenha a transcrição exatamente como narrada.</li>
                    <li>Corrija apenas informações verificáveis.</li>
                    <li>Evite alterar episódios sem necessidade.</li>
                    <li>Execute a bateria de testes antes de um Pull Request.</li>
                    <li>Um PR pequeno é mais fácil de revisar.</li>
                </ul>
            </section>

            <div className="flex justify-center gap-4">
                <Button size="lg">
                    <FaGithub className="mr-2 h-5 w-5" />
                    <a
                        href={data_config.repo_url}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Repositório de dados
                    </a>
                </Button>

                <Button
                    variant="outline"
                    size="lg"
                >
                    <GitPullRequest className="mr-2 h-5 w-5" />
                    <a
                        href={`${data_config.repo_url}/blob/main/README.md`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Guia de Pull Request
                    </a>
                </Button>
            </div>

        </div>
    );
}
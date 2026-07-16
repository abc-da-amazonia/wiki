import { Helmet } from "react-helmet-async";

export default function SobrePage() {
    return (
        <div className="mx-auto flex max-w-5xl flex-1 flex-col gap-8 p-10">
            <Helmet>
                <title>ABC da Amazônia wiki - Sobre</title>
                <meta
                    name="description"
                    content="Saiba mais sobre o projeto ABC da Amazônia Wiki. Nossa missão é preservar e facilitar o acesso às informações da série."
                />
            </Helmet>

            <div>
                <h1 className="text-4xl font-bold">
                    Sobre o projeto
                </h1>

                <p className="mt-3 text-muted-foreground">
                    A <strong>ABC da Amazônia Wiki</strong> é um projeto
                    colaborativo criado com o objetivo de preservar,
                    documentar e facilitar o acesso às informações da série
                    <strong> <a className="text-primary hover:underline" href="https://g1.globo.com/Amazonia/0,,MUL1603095-16052,00.html" target="_blank" rel="noopener noreferrer">ABC da Amazônia</a></strong>. Nosso foco é reunir
                    metadados, transcrições e referências para auxiliar
                    pesquisadores, estudantes e fãs interessados no conteúdo.
                </p>
            </div>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">
                    Projeto sem fins lucrativos
                </h2>

                <p className="text-muted-foreground leading-7">
                    Este projeto é desenvolvido de forma independente por
                    voluntários e não possui qualquer finalidade comercial.
                    Não vendemos acesso ao conteúdo, não exibimos publicidade
                    relacionada ao acervo e não buscamos obter lucro com o
                    material catalogado.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">
                    Direitos autorais
                </h2>

                <p className="text-muted-foreground leading-7">
                    Todos os direitos sobre os episódios, imagens, logotipos,
                    marcas e demais elementos audiovisuais pertencem aos seus
                    respectivos titulares, no caso, a <strong><a className="text-primary hover:underline" href="https://g1.globo.com/Amazonia/0,,MUL1603095-16052,00.html" target="_blank" rel="noopener noreferrer">Rede Globo de Televisão</a></strong>.
                </p>

                <p className="text-muted-foreground leading-7">
                    A Wiki não reivindica autoria sobre esse material. Nosso
                    objetivo é apenas organizar informações públicas,
                    documentar o acervo e facilitar sua consulta.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">
                    Armazenamento de conteúdo
                </h2>

                <p className="text-muted-foreground leading-7">
                    A ABC da Amazônia Wiki não hospeda nem distribui episódios,
                    vídeos ou qualquer mídia protegida por direitos autorais.
                    Quando existe um vídeo disponível, ele é apenas
                    incorporado utilizando os mecanismos oficiais da própria
                    plataforma onde foi publicado.
                </p>

                <p className="text-muted-foreground leading-7">
                    O projeto armazena somente informações descritivas,
                    metadados e transcrições produzidas colaborativamente pela
                    comunidade, em ambiente totalmente público, transparente e rastreável no <strong><a className="text-primary hover:underline" href="https://github.com/abc-da-amazonia/dados" target="_blank" rel="noopener noreferrer">repositório de dados</a></strong> do projeto.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">
                    Colaboração
                </h2>

                <p className="text-muted-foreground leading-7">
                    Todo o conteúdo disponível no projeto pode ser revisado,
                    corrigido e ampliado pela comunidade através do <strong><a className="text-primary hover:underline" href="https://github.com/abc-da-amazonia/dados" target="_blank" rel="noopener noreferrer">repositório de dados</a></strong>. As contribuições passam por revisão antes de
                    serem publicadas, garantindo maior qualidade e
                    consistência das informações.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-2xl font-semibold">
                    Remoção de conteúdo
                </h2>

                <p className="text-muted-foreground leading-7">
                    Caso você represente o titular de direitos de algum
                    conteúdo e entenda que determinada informação não deveria
                    estar disponível neste projeto, entre em contato com um administrador através
                    dos contatos disponíveis no <a className="text-primary hover:underline" href="https://github.com/abc-da-amazonia/dados" target="_blank" rel="noopener noreferrer">
                        <strong>repositório do projeto</strong>
                    </a> para que o caso seja analisado.
                    Havendo fundamento, o conteúdo será atualizado ou removido
                    o mais rapidamente possível.
                </p>
            </section>

        </div>
    );
}
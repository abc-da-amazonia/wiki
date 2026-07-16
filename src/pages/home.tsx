import { ArrowRight, Film, Leaf, PlayCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { routes } from '@/utils/routesEnum';
import { useNavigate } from 'react-router-dom';
import { Helmet } from "react-helmet-async";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <main className="container mx-auto max-w-6xl px-6 py-10">
      <Helmet>
        <title>ABC da Amazônia wiki</title>
        <meta
          name="description"
          content="Acervo colaborativo dos episódios do ABC da Amazônia. Assista, consulte transcrições, datas, informações e ajude a preservar esse patrimônio audiovisual."
        />
      </Helmet>

      <section className="space-y-6 text-center">

        <h1 className="text-5xl font-extrabold tracking-tight">
          ABC da Amazônia
        </h1>

        <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
          Uma coleção de boletins produzidos pela TV Globo que,
          durante décadas, apresentou ao público brasileiro a
          riqueza da Amazônia por meio de vídeos curtos sobre sua
          fauna, flora, povos tradicionais, cultura e curiosidades.
        </p>

        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate(routes.episodios)}>
            Explorar episódios
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </section>


      <section className="mt-16 grid gap-6 md:grid-cols-3">

        <Card className="p-6">
          <Leaf className="mb-4 h-8 w-8 text-green-600" />

          <h2 className="mb-2 text-xl font-semibold">
            Educação Ambiental
          </h2>

          <p className="text-muted-foreground">
            Cada episódio apresenta um tema em aproximadamente um
            minuto, tornando acessíveis conhecimentos sobre a
            biodiversidade, os rios, as florestas, os animais e os
            povos da Amazônia.
          </p>
        </Card>

        <Card className="p-6">
          <PlayCircle className="mb-4 h-8 w-8 text-blue-600" />

          <h2 className="mb-2 text-xl font-semibold">
            Um marco da televisão
          </h2>

          <p className="text-muted-foreground">
            Os boletins ficaram conhecidos pela narrativa marcante,
            belas imagens e linguagem simples, tornando-se uma das
            produções ambientais mais lembradas da televisão
            brasileira.
          </p>
        </Card>

        <Card className="p-6">
          <Film className="mb-4 h-8 w-8 text-amber-600" />

          <h2 className="mb-2 text-xl font-semibold">
            Acervo preservado
          </h2>

          <p className="text-muted-foreground">
            Este projeto organiza e preserva episódios, vídeos e
            transcrições, facilitando pesquisas e permitindo que
            novas gerações conheçam esse patrimônio audiovisual.
          </p>
        </Card>

      </section>


      <section className="mt-16 rounded-xl border bg-muted/30 p-8">

        <h2 className="mb-4 text-3xl font-bold">
          Um patrimônio da memória brasileira
        </h2>

        <div className="space-y-4 text-muted-foreground leading-8">

          <p>
            O <strong>ABC da Amazônia</strong> surgiu como uma série
            de boletins de aproximadamente um minuto produzidos pela
            editoria responsável pela cobertura da Amazônia na TV
            Globo. Os vídeos eram exibidos entre programas e também
            integraram o universo do <strong>Globo Rural</strong>,
            levando milhões de brasileiros a conhecer espécies,
            paisagens, tradições e curiosidades da maior floresta
            tropical do planeta.
          </p>

          <p>
            Muito antes da internet popularizar o acesso ao
            conhecimento, esses pequenos documentários ajudaram a
            despertar o interesse pela conservação ambiental e pela
            diversidade cultural da Amazônia. Sua narrativa
            característica e a qualidade das imagens fizeram com que
            a série se tornasse lembrada por diversas gerações de
            telespectadores.
          </p>

          <p>
            Em 2009, o projeto foi ampliado e passou a integrar o
            núcleo <strong>Globo Natureza</strong>. Em 2011, a marca
            deixou de focar exclusivamente na Amazônia e passou a
            abordar todos os biomas brasileiros, mantendo a proposta
            de divulgar ciência, biodiversidade e sustentabilidade.
          </p>

          <p>
            Este acervo busca reunir esses episódios históricos,
            preservando um importante registro da televisão
            brasileira e da divulgação científica sobre a Amazônia.
          </p>

        </div>

        <div className="flex justify-center gap-4">
          <Button size="lg" onClick={() => navigate(routes.episodios)}>
            Explorar episódios
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

      </section>

    </main>
  );
}
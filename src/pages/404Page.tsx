import { routes } from '@/utils/routesEnum';
import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';

export default function Page404() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-10">
      <Helmet>
        <title>ABC da Amazônia wiki - 404</title>
        <meta
          name="description"
          content="ABC da Amazônia wiki - Página não encontrada"
        />
      </Helmet>
      <h1 className="text-4xl">
        404 - Página não encontrada
      </h1>

      <button
        onClick={() => navigate(routes.home)}
        className="text-1xl hover:cursor-pointer"
      >
        voltar para Home
      </button>
    </div>
  );
}
import { Routes, Route } from 'react-router-dom';
import Page404 from '@pages/404Page';
import Layout from '@components/layout';
import HomePage from '@pages/home';
import ContribuidoresPage from '@pages/contribuidores';
import EpisodiosPage from '@pages/episodios';
import EpisodioPage from '@pages/episodio';
import ContribuicaoPage from '@pages/contribiuicao';
import SobrePage from '@pages/sobre';

function App() {
  return (
    <>
      <Routes>
        <Route
          path={'/'}
          element={
            <Layout>
              <HomePage />
            </Layout>
          }
        />
        <Route
          path={'/contribuidores'}
          element={
            <Layout>
              <ContribuidoresPage />
            </Layout>
          }
        />
        <Route
          path={'/episodios'}
          element={
            <Layout>
              <EpisodiosPage />
            </Layout>
          }
        />
        <Route
          path={'/colaboracao'}
          element={
            <Layout>
              <ContribuicaoPage />
            </Layout>
          }
        />
        <Route
            path="/episodios/:slug"
            element={
                <Layout>
                    <EpisodioPage />
                </Layout>
            }
        />
        <Route
            path="/sobre"
            element={
                <Layout>
                    <SobrePage />
                </Layout>
            }
        />
        <Route path="*" element={<Layout><Page404 /></Layout>} />
      </Routes>
    </>
  );
}

export default App;
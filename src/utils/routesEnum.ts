export const routes = {
  home: '/',
  contribuidores: '/contribuidores',
  episodios: '/episodios',
  parciais: '/episodios/parciais',
  incompletos: '/episodios/incompletos',
  perdidos: '/episodios/perdidos',
  colaboracao: '/colaboracao',
  sobre: '/sobre',
} as const;

export type Routes = (typeof routes)[keyof typeof routes];
import { createServer } from 'miragejs';

export function MockServer({ environment = 'development' }) {
  return createServer({
    environment,
    models: {},
    factories: {},
    seeds(/* server */) {},
    routes() {
      // this.namespace = 'api';
      // this.get('/test', () => {
      //   return { data: 'test' };
      // });

      this.passthrough('https://jsonplaceholder.typicode.com/**');
      this.passthrough('https://cors-anywhere.stroyco.eu/**');
      this.passthrough('https://api-olympics.stroyco.eu/**');
      // https://api-olympics.stroyco.eu/
      // Ajoutez cette ligne pour permettre à toutes les autres requêtes de passer
      this.passthrough();
    },
  });
}

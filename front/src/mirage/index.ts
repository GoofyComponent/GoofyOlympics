import { createServer } from 'miragejs';

export function MockServer({ environment = 'development' }) {
  return createServer({
    environment,
    models: {},
    factories: {},
    seeds(/* server */) {},
    routes() {
      this.namespace = 'api';
      this.get('/test', () => {
        return { data: 'test' };
      });
      this.get('/login', () => {
        return { data: 'test' };
      });
      this.passthrough('https://cors-anywhere.stroyco.eu/**');
      this.passthrough('https://api-olympics.stroyco.eu/**');
      this.passthrough('https://api.mapbox.com/**');
      this.passthrough('https://events.mapbox.com/**');
      this.passthrough('https://api.maptiler.com/**');
      this.passthrough('https://data.paris2024.org/**');
      this.passthrough('https://restcountries.com/**');
      this.passthrough('https://api.goofyolympics.com/**');
      //Passtrough everything else
      this.passthrough();
    },
  });
}

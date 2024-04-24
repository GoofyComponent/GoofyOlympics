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
    },
  });
}

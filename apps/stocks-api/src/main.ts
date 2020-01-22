/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/
import { Server } from 'hapi';
const H2o2 = require('@hapi/h2o2');
import { environment } from './environments/environment';

const init = async () => {
  const server = new Server({
    port: 3333,
    host: 'localhost'
  });

  await server.register(H2o2);

  const stockData = async (symbol, period) => {
    let res = '';
    await server.inject(`/proxy/stock/${symbol}/chart/${period}`).then(response => {
      res = response.payload;
    });
    return res;
  };

  server.method('getData', stockData, {
    cache: {
      expiresIn: 5 * 60 * 1000,
      generateTimeout: 2000
    }
  });

  server.route({
    method: 'GET',
    path: '/beta/stock/{symbol}/chart/{period}',
    handler: (request, h) => {
      return server.methods.getData(request.params.symbol, request.params.period);
    }
  });

  server.route({
    method: 'GET',
    path: '/proxy/stock/{symbol}/chart/{period}',
    options: {
      handler: {
        proxy: {
          uri: 'https://sandbox.iexapis.com/beta/stock/{symbol}/chart/{period}?token=' + environment.apiSecretToken,
          passThrough: true,
          xforward: true
        }
      }
    }
  });

  server.route({
    method: '*',
    path: '/{any*}',
    handler: function (request, h) {
      return { statusCode: '404', statusMessage: '404 Error! Page Not Found!' };
    }
  });

  await server.start();
  console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', err => {
  console.log(err);
  process.exit(1);
});

init();

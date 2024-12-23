const path = require("path");

// Require the fastify framework and instantiate it
const fastify = require("fastify")({
  // set this to true for detailed logging:
  logger: false,
});

// Setup our static files
fastify.register(require("@fastify/static"), {
  root: path.join(__dirname, "public"),
  prefix: "/", // optional: default '/'
  decorateReply: false,
  setHeaders: (res, path, stat) => {
    if (path.endsWith('.wasm')) {
      res.setHeader('Content-Type', 'application/wasm');
    } else if (path.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
    }
  }
});

// fastify-formbody lets us parse incoming forms
fastify.register(require("@fastify/formbody"));

// point-of-view is a templating manager for fastify
fastify.register(require("@fastify/view"), {
  engine: {
    handlebars: require("handlebars"),
  },
});

// Our main GET home page route, pulls from src/pages/index.hbs
fastify.get('/', async (request, reply) => {
  return reply.view('/src/pages/index.hbs', {
    wasmUrl: 'https://9ydcnqxnmzwwmxs6.public.blob.vercel-storage.com/gotranslate-zlI0nya5XLmJkPb0F1jhhVexC0SiVE.wasm'
  })
})

// A POST route to handle form submissions
fastify.post("/", function (request, reply) {
  let params = {
    greeting: "Hello Form!",
  };
  // request.body.paramName <-- a form post example
  return reply.view("/src/pages/index.hbs", params);
});

// Run the server and report out to the logs
fastify.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);

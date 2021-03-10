const util = require('util');
const grpc = require('@grpc/grpc-js');
const server = require('fastify')();
const loader = require('@grpc/proto-loader');
const pkg_definition = loader.loadSync(__dirname + '/receta.proto');
const receta = grpc.loadPackageDefinition(pkg_definition).receta;
const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 3000;
const TARGET = process.env.TARGET || 'localhost:4000';

const cliente = new receta.ServicioReceta(TARGET, grpc.credentials.createInsecure());

const obtenerMetaData = util.promisify(cliente.obtenerMetaData.bind(cliente));
const obtenerReceta = util.promisify(cliente.obtenerReceta.bind(cliente));

server.get('/', async () => {

    const [meta, receta] = await Promise.all(
        obtenerMetaData({}),
        obtenerReceta({id: 42})
    );
    return{
        pid_cliente : process.pid,
        metadata_server: meta, 
        receta
    }

});

server.listen(PORT, HOST, () => {
    console.log(`Cliente escuchando en: ${HOST}:${PORT}/`)
});



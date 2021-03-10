//npm install @grpc/grpc-js
//npm install @grpc/proto-loader

const grpc = require('@grpc/grpc-js');
const loader = require('@grpc/proto-loader');

const pkg_definition = loader.loadSync(__dirname + "/receta.proto");
const receta = grpc.loadPackageDefinition(pkg_definition).receta;

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || 4000;
const server = new grpc.Server();

server.addService(receta.ServicioReceta.service, {

    obtenerMetaData: (call, cb) => {
        cb(null, {
            pid : process.pid
        });
    }, 
    obtenerReceta: (call, cb) => {

        if(call.request.id !== 42) {
            return cb(new Error(`No se encontro receta: ${call.request.id}`));
        }

        cb(null, {

            id: 42,
            nombre: "Tacos de pollo",
            pasos: "Toma una tortilla y échale pollo",
            ingredientes: [
                {id: 1, nombre: "Pollo", cantidad: "100 grs"},
                {id: 2, nombre: "Tortillas", cantidad: "2 piezas"}
            ]

        });
    }

});

server.bindAsync(`${HOST}:${PORT}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
    if(err) throw err;
    server.start();
    console.log(`Server iniciado en: http://${HOST}:${PORT}/`);
});



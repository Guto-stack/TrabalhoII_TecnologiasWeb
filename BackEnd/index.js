import Fastify from "fastify"
import cors from "@fastify/cors"
import { periodoRoutes } from "./src/routes/periodos.js"
import { arvoreRoutes } from "./src/routes/arvore.js"
import { estatisticasRoutes } from "./src/routes/estatisticas.js"

// Instancia o Fastify com logs ativados
const fastify = Fastify({
    logger: true
})

// Registra configs do CORS 
await fastify.register(cors, {
    origin: "*", //MUDEI AQUI PRA FUNCIONAR NO MEU PC, QLQR COISA SO VOLTAR PRA FRONTEND_URL
    methods: ["GET", "POST", "PUT", "DELETE"]
})

// Registra rotas da API
await fastify.register(periodoRoutes)
await fastify.register(arvoreRoutes)
await fastify.register(estatisticasRoutes)

// Inicializa server Fastify
const startFastify = async () => {
    try{
        await fastify.listen({port: 3333, host: "0.0.0.0"})
    } catch(err){
        fastify.log.error(err)
        process.exit(1)
    }
}

startFastify()
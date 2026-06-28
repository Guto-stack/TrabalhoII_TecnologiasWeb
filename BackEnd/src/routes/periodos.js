import { prisma } from "../lib/prisma.js"

export async function periodoRoutes(fastify, options){
    // Rota GET /periodos
    fastify.get("/periodos", async (request, reply) => {
        try{
            const periodos = await prisma.periodo_geologico.findMany({
                orderBy: {
                    inicio_ma: "desc"
                }
            })

            return periodos
        }catch(error){
            fastify.log.error(error)
            return reply.status(500).send({error: "Erro ao buscar os períodos geológicos."})
        }
    })
}
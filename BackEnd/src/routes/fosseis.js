import { prisma } from '../lib/prisma.js'

export async function fossilRoutes(fastify, options){
  fastify.get('/fosseis/:periodoId', async (request, reply) => {
    try {
      const {periodoId} = request.params
      const idPeriodoInt = parseInt(periodoId, 10)

      if(isNaN(idPeriodoInt)){
        return reply.status(400).send({error: 'ID do período inválido.'})
      }

      const fosseis = await prisma.fossil.findMany({
        where: {
          latitude: { not: null },
          longitude: { not: null },
          especie_dinossauro: {
            id_periodo: idPeriodoInt
          }
        },
        include: {
          especie_dinossauro: true
        }
      })

      return fosseis

    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({error: 'Erro ao buscar dados dos fósseis.'})
    }
  })
}
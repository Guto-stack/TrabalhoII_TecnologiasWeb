import { prisma } from "../lib/prisma.js"

export async function estatisticasRoutes(fastify, options) {
  fastify.get("/estatisticas", async (request, reply) => {
    try {
      // Busca todos os períodos para estruturar a navegação por eras
      const periodos = await prisma.periodo_geologico.findMany({
        orderBy: { inicio_ma: "desc" }
      })

      const relatorioPorPeriodo = await Promise.all(
        periodos.map(async (periodo) => {
          // Busca as espécies deste período junto com seus clados e fósseis
          const especiesDoPeriodo = await prisma.especie_dinossauro.findMany({
            where: { id_periodo: periodo.id_periodo },
            include: { 
              clado: true,
              fossil: true
            }
          })

          // Agrupa as espécies por Clado dentro DENTRO deste período específico
          const cladosMap = {}
          especiesDoPeriodo.forEach(esp => {
            if (!esp.clado) return
            const cladoId = esp.id_clado
            
            if (!cladosMap[cladoId]) {
              cladosMap[cladoId] = {
                cladoName: esp.clado.nome_clado,
                nivelTaxonomico: esp.clado.nivel_taxonomico,
                totalEspecies: 0,
                somaPeso: 0, countPeso: 0,
                somaAlt: 0, countAlt: 0,
                somaComp: 0, countComp: 0,
                dietas: []
              }
            }

            const c = cladosMap[cladoId]
            c.totalEspecies++
            if (esp.peso_estimado_kg > 0) { c.somaPeso += esp.peso_estimado_kg; c.countPeso++; }
            if (esp.altura_m > 0) { c.somaAlt += Number(esp.altura_m); c.countAlt++; }
            if (esp.comprimento_m > 0) { c.somaComp += Number(esp.comprimento_m); c.countComp++; }
            if (esp.dieta) c.dietas.push(esp.dieta)
          })

          //  monta uma tabela para os dados de cada periodo
          const tabelaClados = Object.values(cladosMap).map(c => {
            const dietaLider = c.dietas.sort((a,b) => 
              c.dietas.filter(v => v===a).length - c.dietas.filter(v => v===b).length
            ).pop() || "Desconhecida"

            return {
              cladoName: c.cladoName,
              nivelTaxonomico: c.nivelTaxonomico,
              totalEspecies: c.totalEspecies,
              pesoMedio: c.countPeso > 0 ? Math.round(c.somaPeso / c.countPeso) : 0,
              alturaMedia: c.countAlt > 0 ? Number((c.somaAlt / c.countAlt).toFixed(2)) : 0,
              comprimentoMedio: c.countComp > 0 ? Number((c.somaComp / c.countComp).toFixed(1)) : 0,
              dietaDominante: dietaLider
            }
          })

          // Top 3 Maiores especies da era com contagem de fósseis
          const topGigantesPeriodo = especiesDoPeriodo
            .filter(esp => esp.comprimento_m > 0)
            .sort((a, b) => b.comprimento_m - a.comprimento_m)
            .slice(0, 3)
            .map(d => ({
              id: d.id_especie,
              nomeCientifico: d.nome_cientifico,
              nomePopular: d.nome_popular || "Desconhecido",
              comprimento: d.comprimento_m,
              altura: d.altura_m,
              peso: d.peso_estimado_kg,
              clado: d.clado?.nome_clado || "N/A",
              totalFosseis: d.fossil.length // Cruzamento com a tabela fossil
            }))

          return {
            id_periodo: periodo.id_periodo,
            nome_periodo: periodo.nome_periodo,
            inicio_ma: periodo.inicio_ma,
            fim_ma: periodo.fim_ma,
            tabelaClados,
            topGigantes: topGigantesPeriodo
          }
        })
      )

      return relatorioPorPeriodo
    } catch (error) {
      fastify.log.error(error)
      return reply.status(500).send({ error: "Erro ao computar estatísticas." })
    }
  })
}
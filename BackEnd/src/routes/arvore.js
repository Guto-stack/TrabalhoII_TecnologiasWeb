import { prisma } from "../lib/prisma.js"

export async function arvoreRoutes(fastify, options){
    fastify.get("/arvore/:periodoId", async (request, reply) => {
        try{
            const {periodoId} = request.params
            const idPeriodoInt = parseInt(periodoId, 10)

            if(isNaN(idPeriodoInt)){
                return reply.status(400).send({error: "Id do período inválido."})
            }

            // Busca as espécies do período especificado
            const especies = await prisma.especie_dinossauro.findMany({
                where: {id_periodo: idPeriodoInt},
                include: {fossil: true} // Traz dados de fossil junto
            })

            if(especies.length === 0){
                return {nodes: [], edges: []}
            }

            // Carrega todos os clados para resolver as ancestralidades em memória
            const todosClados = await prisma.clado.findMany()
            const cladosMap = new Map(todosClados.map(c => [c.id_clado, c]))

            const nodes = []
            const edges = []

            // Conjuntos para garantir que não haja duplicatas na árvore
            const cladosInseridos = new Set()
            const conexoesInseridas = new Set()

            // Processa os cards das espécies
            especies.forEach(especie => {
                // Adiciona a espécie como um nó
                nodes.push({
                    id: `especie-${especie.id_especie}`,
                    type: "customCard",
                    position: {x: 0, y: 0},
                    data: {
                        nomeCientifico: especie.nome_cientifico,
                        nomePopular: especie.nome_popular,
                        dieta: especie.dieta,
                        altura: especie.altura_m,
                        comrimento: especie.comprimento_m,
                        peso: especie.peso_estimado_kg,
                        descricao: especie.descricao,
                        descoberta: especie.ano_descoberta,
                        imagem: especie.url_imagem,
                        idEspecie: especie.id_especie
                    }
                })

                // Conecta a espécie ao seu clado direto
                if(especie.id_clado){
                    edges.push({
                        id: `edge-esp-${especie.id_especie}-clado-${especie.id_clado}`,
                        source: `clado-${especie.id_clado}`,
                        target: `especie-${especie.id_especie}`,
                        type: "step"
                    })
                    
                    // Sobe a árvore de clados
                    let idCladoAtual = especie.id_clado

                    while(idCladoAtual){
                        const clado = cladosMap.get(idCladoAtual)
                        if(!clado) break

                        if(!cladosInseridos.has(clado.id_clado)){
                            cladosInseridos.add(clado.id_clado)

                            // Adiciona o clado como um nó
                            nodes.push({
                                id: `clado-${clado.id_clado}`,
                                type: "customCard",
                                position: {x: 0, y: 0},
                                data: {
                                    nome: clado.nome_clado,
                                    nivel: clado.nivel_taxonomico,
                                    descricao: clado.descricao
                                }
                            })
                        }

                        if(clado.id_ancestral){
                            const chaveConexao = `${clado.id_ancestral}->${clado.id_clado}`

                            if(!conexoesInseridas.has(chaveConexao)){
                                conexoesInseridas.add(chaveConexao)

                                // Conecta o clado ao seu clado direto
                                edges.push({
                                    id: `edge-clado-${clado.id_ancestral}-clado-${clado.id_clado}`,
                                    source: `clado-${clado.id_ancestral}`,
                                    target: `clado-${clado.id_clado}`,
                                    type: "step"
                                })
                            }
                        }

                        // Avança de clado na hierarquia
                        idCladoAtual = clado.id_ancestral
                    }
                }
            })

            return {nodes, edges}
        } catch(error){
            fastify.log.error(error)
            return reply.status(500).send({error: "Erro ao gerar o grafo da árvore evolutiva."})
        }
    })
}
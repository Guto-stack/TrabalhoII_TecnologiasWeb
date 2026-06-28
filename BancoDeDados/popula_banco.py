import os
import csv
import psycopg2
from dotenv import load_dotenv

load_dotenv()

descricoes_clados = {
    # RAIZ
    "Dinosauria": "Um clado diversificado de répteis arcossauros que dominaram a Terra durante a Era Mesozoica.",
    
    # ORDENS
    "Ornithischia": "Dinossauros com 'quadril de pássaro'. Grupo herbívoro diversificado, muitos com armaduras, chifres ou bicos complexos.",
    "Saurischia": "Dinossauros com 'quadril de lagarto'. Inclui os gigantes pescoçudos (saurópodes) e todos os terópodes carnívoros.",
    
    # SUBORDENS
    "Marginocephalia": "Herbívoros caracterizados por uma franja óssea ou espessamento na parte de trás do crânio (inclui ceratopsídeos e paquicefalossauros).",
    "Ornithopoda": "Herbívoros bípedes ou quadrúpedes facultativos, famosos por seus bicos e complexo sistema de mastigação.",
    "Sauropodomorpha": "Herbívoros de pescoço longo e cabeça pequena. Evoluíram para se tornarem os maiores animais terrestres de todos os tempos.",
    "Theropoda": "Predadores predominantemente bípedes, caracterizados por ossos ocos e três dedos funcionais. Linhagem ancestral das aves.",
    "Thyreophora": "Dinossauros encouraçados. Possuíam placas ósseas, espinhos ou densos escudos dérmicos espalhados pelo corpo para defesa.",
    
    # FAMÍLIAS
    "Abelisauridae": "Predadores do hemisfério sul caracterizados por focinhos curtos e robustos, ornamentações cranianas e braços extremamente atrofiados.",
    "Allosauridae": "Grandes predadores de topo do Jurássico, com cristas ósseas sobre os olhos e mandíbulas projetadas para infligir ferimentos profundos.",
    "Alvarezsauridae": "Pequenos e ágeis terópodes emplumados com patas dianteiras curtas e uma única garra forte, adaptada possivelmente para cavar cupinzeiros.",
    "Ankylosauridae": "Dinossauros pesadamente blindados com espessas osteodermas e uma clava óssea massiva na ponta da cauda para defesa.",
    "Brachiosauridae": "Gigantescos saurópodes com as pernas dianteiras mais longas que as traseiras, proporcionando uma postura semelhante à das girafas.",
    "Camarasauridae": "Saurópodes robustos de pescoço mais curto, com crânios em forma de caixa e dentes grandes em formato de colher.",
    "Carcharodontosauridae": "Alguns dos maiores predadores terrestres já existentes, com dentes finos e serrilhados semelhantes aos de tubarões para rasgar carne.",
    "Ceratopsidae": "Grandes herbívoros quadrúpedes conhecidos por seus elaborados escudos ósseos no pescoço (gorgueiras) e chifres faciais proeminentes.",
    "Ceratosauridae": "Terópodes primitivos que possuíam chifres no focinho e, em muitos casos, escudos ósseos (osteodermas) ao longo das costas.",
    "Cetiosauridae": "Uma família de saurópodes basais e primitivos, com vértebras sólidas e muito pesadas em comparação com os grupos avançados posteriores.",
    "Coelophysidae": "Predadores ágeis, esguios e velozes do Triássico e início do Jurássico, cujos fósseis sugerem caça e vivência em bandos.",
    "Compsognathidae": "Pequenos dinossauros carnívoros, leves e rápidos, que se alimentavam de insetos e pequenos vertebrados.",
    "Dicraeosauridae": "Saurópodes de pescoço relativamente curto com espinhas neurais altas e bifurcadas nas costas, formando uma 'vela' em algumas espécies.",
    "Dilophosauridae": "Terópodes basais notáveis por possuírem cristas duplas, finas e paralelas no topo do crânio.",
    "Diplodocidae": "Saurópodes extremamente alongados, com pescoços muito compridos, crânios estreitos e caudas em formato de chicote.",
    "Dromaeosauridae": "Raptores ágeis e inteligentes, cobertos por penas e equipados com uma garra letal em forma de foice em cada pé.",
    "Dryosauridae": "Herbívoros ornitópodes de pequeno a médio porte, rápidos corredores de floresta com grandes olhos e pernas longas.",
    "Guaibasauridae": "Grupo primitivo sul-americano de transição, com características que misturam as de terópodes e sauropodomorfos basais.",
    "Hadrosauridae": "Conhecidos como dinossauros 'bico de pato', formavam vastas manadas herbívoras e possuíam cristas cranianas para vocalização.",
    "Herrerasauridae": "Entre os dinossauros mais antigos conhecidos; predadores bípedes basais com mandíbulas de dupla articulação.",
    "Heterodontosauridae": "Família de ornitísquios basais com dentição complexa e diferenciada, incluindo dentes semelhantes a caninos na frente da mandíbula.",
    "Huayangosauridae": "Estegossauros primitivos que possuíam crânios mais curtos e altos e ainda retinham dentes na frente da mandíbula superior.",
    "Hypsilophodontidae": "Pequenos, ágeis e velozes dinossauros herbívoros bípedes que prosperaram fugindo da megafauna predatória.",
    "Iguanodontidae": "Grandes ornitópodes herbívoros capazes de andar em duas ou quatro patas, com polegares em forma de espinho afiado para defesa.",
    "Mamenchisauridae": "Saurópodes asiáticos notórios por possuírem pescoços extraordinariamente longos, chegando a compor mais da metade de todo o corpo.",
    "Massospondylidae": "Prosaurópodes (sauropodomorfos basais) comuns no início do Jurássico, frequentemente desenvolvendo garras curvas nos polegares.",
    "Megalosauridae": "Grandes terópodes predadores que dominaram as ilhas e litorais da Europa durante o Jurássico, com braços muito fortes.",
    "Metriacanthosauridae": "Predadores do Jurássico e Cretáceo Inferior com espinhas neurais elevadas que formavam corcovas musculares nas costas.",
    "Nemegtosauridae": "Titanossauros asiáticos tardios conhecidos principalmente por seus crânios bem preservados e dentes em formato de pino.",
    "Nodosauridae": "Dinossauros blindados cobertos por placas ósseas e grandes espinhos projetados lateralmente, mas que não possuíam a clava na cauda.",
    "Ornithomimidae": "Dinossauros parecidos com avestruzes, bípedes extremamente velozes, com bicos sem dentes e dietas predominantemente onívoras.",
    "Oviraptoridae": "Dinossauros exóticos emplumados, com bicos desdentados muito fortes em formato de papagaio e, frequentemente, altas cristas no crânio.",
    "Pachycephalosauridae": "Herbívoros bípedes famosos pelos crânios extremamente espessos e abobadados, usados em disputas de cabeçadas e exibições intraespecíficas.",
    "Piatnitzkysauridae": "Terópodes basais sul-americanos do Jurássico Médio, representando os ancestrais primitivos da linhagem dos alossauros e megalossauros.",
    "Pisanosauridae": "Representantes da base da árvore dos ornitísquios, compreendendo pequenos e primitivos herbívoros do Triássico.",
    "Plateosauridae": "Sauropodomorfos primitivos grandes e corpulentos, os primeiros herbívoros na história terrestre a atingir tamanhos gigantescos.",
    "Rebbachisauridae": "Titanossauriformes com focinhos largos e dentes em bateria, muitos apresentando espinhas neurais muito elevadas nas costas.",
    "Riojasauridae": "Sauropodomorfos robustos e massivos, cuja constituição física pesada forçou o retorno à locomoção exclusivamente quadrúpede.",
    "Saltasauridae": "Titanossauros avançados que revolucionaram a paleontologia ao comprovar a presença de osteodermas ósseas (blindagem) na pele de saurópodes.",
    "Scelidosauridae": "Dinossauros primitivos encouraçados do Jurássico Inferior, representando formas transicionais ancestrais de todos os anquilossauros.",
    "Spinosauridae": "Predadores especializados de focinhos longos, com dietas baseadas em peixes e grandes presas aquáticas, muitos possuindo velas nas costas.",
    "Stegosauridae": "Família clássica de estegossauros com pescoços curtos, cabeças minúsculas e placas ósseas dorsais altamente vascularizadas.",
    "Therizinosauridae": "Bizarros dinossauros herbívoros com barrigas proeminentes e braços longos terminados nas maiores garras em forma de foice já documentadas.",
    "Titanosauridae": "O último e mais diversificado grupo de saurópodes, espalhado por todos os continentes e abrigando os maiores animais terrestres que já existiram.",
    "Troodontidae": "Dinossauros semelhantes a aves com grandes cérebros e enormes globos oculares, sugerindo alta inteligência, agilidade e hábitos noturnos.",
    "Tyrannosauridae": "Superpredadores do Cretáceo Superior com cabeças massivas, braços atrofiados de dois dedos e as mordidas mais letais e esmagadoras da história terrestre.",
    "Vulcanodontidae": "Uma das primeiras e mais basais famílias de saurópodes verdadeiros, marcando a transição morfológica completa para o andar sobre quatro patas em pilares."
}

def obter_ou_criar_clado(cursor, nome, nivel, id_ancestral):
    if not nome or nome == "":
        return None
        
    cursor.execute("SELECT id_clado FROM clado WHERE nome_clado = %s;", (nome,))
    resultado = cursor.fetchone()
    if resultado:
        return resultado[0]
        
    descricao = descricoes_clados.get(nome, f"Clado do grupo {nome}.")
    
    cursor.execute("""
        INSERT INTO clado (nome_clado, nivel_taxonomico, descricao, id_ancestral) 
        VALUES (%s, %s, %s, %s) RETURNING id_clado;
    """, (nome, nivel, descricao, id_ancestral))
    
    return cursor.fetchone()[0]

def popular_banco():
    conexao = None
    try:
        conexao = psycopg2.connect(
            host="127.0.0.1",
            port=5433,                  
            database="paleotree_db",
            user="postgres",
            password=os.getenv("SENHA_BANCO")
        )
        cursor = conexao.cursor()
        print("Conectado ao banco 'paleotree_db'. Iniciando Povoamento...\n")

        periodos = {
            "Triássico": {"inicio": 252.0, "fim": 201.3},
            "Jurássico": {"inicio": 201.3, "fim": 145.0},
            "Cretáceo": {"inicio": 145.0, "fim": 66.0}
        }
        ids_periodos = {}
        for nome, idades in periodos.items():
            cursor.execute("""
                INSERT INTO periodo_geologico (nome_periodo, inicio_ma, fim_ma) 
                VALUES (%s, %s, %s)
                ON CONFLICT (nome_periodo) DO UPDATE SET inicio_ma = EXCLUDED.inicio_ma
                RETURNING id_periodo;
            """, (nome, idades["inicio"], idades["fim"]))
            ids_periodos[nome] = cursor.fetchone()[0]
            
        id_raiz_dinosauria = obter_ou_criar_clado(cursor, "Dinosauria", "Superordem", None)
        print("Raiz 'Dinosauria' ancorada com sucesso.")

        arquivos_csv = {
            "Triássico": "data/dino_triassico.csv",
            "Jurássico": "data/dino_jurassico.csv",
            "Cretáceo": "data/dino_cretaceo.csv"
        }

        total_especies = 0

        for nome_periodo, arquivo_path in arquivos_csv.items():
            if not os.path.exists(arquivo_path):
                print(f"⚠️ Arquivo '{arquivo_path}' não encontrado.")
                continue
                
            id_periodo_atual = ids_periodos[nome_periodo]
            
            with open(arquivo_path, mode='r', encoding='utf-8-sig') as f:
                leitor = csv.DictReader(f)
                
                for linha in leitor:
                    # Resolve a Árvore Hierárquica conectada a Dinosauria
                    ordem_nome = linha.get('Ordem', '').strip()
                    subordem_nome = linha.get('Subordem', '').strip()
                    familia_nome = linha.get('Família', '').strip()
                    
                    # Ordem -> aponta para Dinosauria
                    id_ordem = obter_ou_criar_clado(cursor, ordem_nome, "Ordem", id_raiz_dinosauria)
                    
                    # Subordem -> aponta para Ordem
                    id_subordem = obter_ou_criar_clado(cursor, subordem_nome, "Subordem", id_ordem)
                    
                    # Família -> aponta para Subordem
                    id_familia = obter_ou_criar_clado(cursor, familia_nome, "Família", id_subordem)
                    
                    # O card do dinossauro aponta para o menor clado disponível
                    id_clado_final = id_familia if id_familia else id_subordem

                    def trata_float(val):
                        try: return float(val) if val and val.strip() else None
                        except: return None

                    # Insere Espécie
                    cursor.execute("""
                        INSERT INTO especie_dinossauro (
                            nome_cientifico, nome_popular, id_periodo, id_clado, dieta, 
                            altura_m, comprimento_m, peso_estimado_kg, descricao, 
                            ano_descoberta, url_imagem
                        ) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
                        ON CONFLICT (nome_cientifico) DO NOTHING
                        RETURNING id_especie;
                    """, (
                        linha.get('Nome Científico', '').strip(),
                        linha.get('Nome Popular', '').strip(),
                        id_periodo_atual,
                        id_clado_final,
                        linha.get('dieta', '').strip(),
                        trata_float(linha.get('altura_m')), 
                        trata_float(linha.get('comprimento_m')), 
                        trata_float(linha.get('peso_estimado_kg')),
                        linha.get('descricao', '').strip(),
                        linha.get('ano_descoberta', '').strip(),
                        linha.get('imagem', '').strip()
                    ))
                    
                    resultado_especie = cursor.fetchone()
                    if resultado_especie:
                        total_especies += 1
                        id_especie = resultado_especie[0]
                        
                        # Insere o Fóssil
                        cursor.execute("""
                            INSERT INTO fossil (id_especie, localidade_exata, latitude, longitude)
                            VALUES (%s, %s, %s, %s);
                        """, (
                            id_especie,
                            linha.get('localizacao_fossil', '').strip(),
                            trata_float(linha.get('latitude')), 
                            trata_float(linha.get('longitude'))
                        ))

            print(f"Arquivo CSV do {nome_periodo} processado.")

        conexao.commit()
        print(f"\nA árvore genealógica de Dinosauria foi montada com sucesso!!.")

    except Exception as e:
        print(f"Erro durante a execução: {e}")
        if conexao:
            conexao.rollback()
            
    finally:
        if conexao:
            cursor.close()
            conexao.close()

if __name__ == "__main__":
    popular_banco()
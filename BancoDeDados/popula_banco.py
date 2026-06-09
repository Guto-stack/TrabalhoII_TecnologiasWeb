#type: ignore
import os
import csv
import requests
import psycopg2
from dotenv import load_dotenv

load_dotenv()

print("Conectando ao Postgres com a nova estrutura taxonômica...")
try:
    conexao = psycopg2.connect(
        host="127.0.0.1",
        port=5433,                      
        database="paleotree_db",
        user="postgres",
        password=os.getenv("SENHA_WINDOWS")
    )
    cursor = conexao.cursor()
    print("Conexão estabelecida com sucesso!")
except Exception as e:
    print(f"Erro ao conectar ao banco de dados: {e}")
    exit()

def obter_ou_criar_grupo_taxonomico(linha_csv):
    """ Classifica dinamicamente o dinossauro em um grande clado evolutivo """
    texto_busca = f"{linha_csv.get('behavior_notes', '')} {linha_csv.get('notable_features', '')} {linha_csv.get('meaning', '')}".lower()
    
    # Mapeamento de palavras-chave para grandes grupos biológicos
    if "theropod" in texto_busca or "carnivore" in linha_csv.get("diet", "").lower():
        nome_grupo = "Theropoda"
        desc = "Grandes e pequenos predadores ou omnívoros bípedes, caracterizados por ossos ocos e pés com três dedos funcionais."
    elif "sauropod" in texto_busca or "titanosaur" in texto_busca or "long neck" in texto_busca:
        nome_grupo = "Sauropodomorpha"
        desc = "Os gigantes pescoçudos da Era Mesozoica. Herbívoros quadrúpedes com corpos massivos e caudas longas."
    elif "ceratops" in texto_busca or "horned" in texto_busca or "frill" in texto_busca:
        nome_grupo = "Ceratopsia"
        desc = "Dinossauros marginocefálios herbívoros com chifres faciais proeminentes e escudos ósseos no pescoço."
    elif "ankylosaur" in texto_busca or "armored" in texto_busca or "clubbed tail" in texto_busca:
        nome_grupo = "Ankylosauria"
        desc = "Dinossauros blindados cobertos por placas dérmicas osteodermes, muitos possuindo uma clava óssea na ponta da cauda."
    elif "stegosaur" in texto_busca or "plates on back" in texto_busca or "spiked tail" in texto_busca:
        nome_grupo = "Stegosauria"
        desc = "Herbívoros quadrúpedes distintos pelas fileiras verticais de placas ou espinhos ósseos ao longo do dorso e cauda."
    elif "ornithopod" in texto_busca or "duck-billed" in texto_busca or "hadrosaur" in texto_busca or "iguanodont" in texto_busca:
        nome_grupo = "Ornithopoda"
        desc = "Herbívoros bípedes ou quadrúpedes facultativos, incluindo os dinossauros de bico de pato com mandíbulas de mastigação complexas."
    else:
        nome_grupo = "Ornithischia de transição"
        desc = "Linhagens basais ou outras ramificações de dinossauros herbívoros que não se encaixam perfeitamente nos clados principais."

    cursor.execute("""
        INSERT INTO grupo_taxonomico (nome_grupo, descricao_anatomica) 
        VALUES (%s, %s) 
        ON CONFLICT (nome_grupo) DO UPDATE SET nome_grupo = EXCLUDED.nome_grupo
        RETURNING id_grupo;
    """, (nome_grupo, desc))
    return cursor.fetchone()[0]

def obter_ou_criar_periodo(nome_periodo):
    if not nome_periodo or nome_periodo.strip() == "":
        nome_periodo = "Desconhecido"
    nome_periodo = nome_periodo.strip().capitalize()
    
    cursor.execute("SELECT id_periodo FROM periodo_geologico WHERE nome_periodo = %s;", (nome_periodo,))
    res = cursor.fetchone()
    if res:
        return res[0]
        
    inicio_ma, fim_ma = None, None
    try:
        url = f"https://paleobiodb.org/data1.2/intervals/list.json?name={nome_periodo}"
        resposta = requests.get(url, timeout=10)
        if resposta.status_code == 200:
            records = resposta.json().get("records", [])
            if records:
                inicio_ma = records[0].get("eax") or records[0].get("age")
                fim_ma = records[0].get("lax") or records[0].get("age")
    except Exception:
        pass
        
    cursor.execute("""
        INSERT INTO periodo_geologico (nome_periodo, inicio_ma, fim_ma) 
        VALUES (%s, %s, %s) 
        RETURNING id_periodo;
    """, (nome_periodo, inicio_ma, fim_ma))
    return cursor.fetchone()[0]

def importar_csv_taxonomico(caminho_csv):
    print(f"\n[CSV] A iniciar a carga limpa com suporte a Grupos Taxonómicos: {caminho_csv}...")
    if not os.path.exists(caminho_csv):
        print("Erro: Arquivo CSV não encontrado.")
        return

    with open(caminho_csv, mode='r', encoding='utf-8') as arquivo:
        leitor = csv.DictReader(arquivo)
        contador = 0
        
        for linha in leitor:
            nome_cientifico = linha.get("scientific_name")
            if not nome_cientifico:
                continue
                
            nome_popular = linha.get("common_name") or nome_cientifico
            significado = linha.get("meaning") or "Não informado"
            continente = linha.get("lived_in") or "Desconhecido"
            fossil_loc = linha.get("fossil_location") or "Não informado"
            dieta_texto = linha.get("diet") or "Não catalogada"
            locomocao = linha.get("locomotion") or "Não catalogada"
            notas = linha.get("behavior_notes") or ""
            features = linha.get("notable_features") or ""
            inteligencia = linha.get("intelligence_level") or "Desconhecido"
            descoberta = linha.get("first_discovered") or "Não informada"
            link = linha.get("source_link") or ""

            def tratar_float(valor):
                try: return float(valor) if valor and valor.strip() else None
                except: return None

            comprimento = tratar_float(linha.get("length_m"))
            peso = tratar_float(linha.get("weight_kg"))
            altura = tratar_float(linha.get("height_m"))

            try:
                # Resolve os relacionamentos normalizados de 1-para-Muitos
                id_grupo = obter_ou_criar_grupo_taxonomico(linha)
                id_periodo = obter_ou_criar_periodo(linha.get("geological_period"))

                # Insere a espécie mapeando a dieta como atributo local
                cursor.execute("""
                    INSERT INTO especie_dinossauro (
                        nome_cientifico, nome_popular, significado_nome, id_periodo, id_grupo, id_ancestral,
                        continente, fossil_location_csv, dieta, comprimento_m, peso_estimado_kg, altura_m, 
                        locomotion_api, notas_comportamento, caracteristicas_notaveis, nivel_inteligencia, 
                        ano_descoberta, link_fonte, url_imagem
                    )
                    VALUES (%s, %s, %s, %s, %s, NULL, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, NULL)
                    ON CONFLICT (nome_cientifico) DO NOTHING
                    RETURNING id_especie;
                """, (nome_cientifico, nome_popular, significado, id_periodo, id_grupo, 
                      continente, fossil_loc, dieta_texto, comprimento, peso, altura, 
                      locomocao, notas, features, inteligencia, descoberta, link))
                
                contador += 1
                if contador % 100 == 0:
                    conexao.commit()
                    print(f"[BD] {contador} espécies catalogadas com taxonomia...")

            except Exception as e:
                print(f"Erro no processamento de {nome_cientifico}: {e}")
                conexao.rollback()
                
        conexao.commit()
        print(f"\n[Sucesso] Etapa 1 Concluída! {contador} espécies distribuídas nas novas tabelas.")

try:
    importar_csv_taxonomico("data/dinoDatasetCSV.csv")
finally:
    cursor.close()
    conexao.close()
    print("Conexão encerrada.")
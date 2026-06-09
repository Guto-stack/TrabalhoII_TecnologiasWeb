#type: ignore
import os
import time
import requests
import psycopg2
from dotenv import load_dotenv

load_dotenv()

print("Conectando ao Postgres para a Etapa 2 (Fósseis)...")
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

def buscar_e_salvar_fosseis():
    # 1. Busca todas as espécies cadastradas
    cursor.execute("SELECT id_especie, nome_cientifico FROM especie_dinossauro;")
    especies = cursor.fetchall()
    
    print(f"\n[API PBDB] Encontradas {len(especies)} espécies no banco local.")
    print("[API PBDB] Buscando coordenadas geográficas na API do PBDB (Limite: 3 fósseis por espécie)...\n")
    
    contador_fosseis_total = 0
    
    for id_especie, nome_cientifico in especies:
        # Extrai o gênero
        genero = nome_cientifico.split()[0]
        
        url_pbdb = f"https://paleobiodb.org/data1.2/occs/list.json?base_name={genero}&show=coords,loc"
        
        try:
            resposta = requests.get(url_pbdb, timeout=15)
            if resposta.status_code == 200:
                # Pegar no máximo 3 registros de fósseis para cada dinossauro
                registros = resposta.json().get("records", [])[:3]
                
                if not registros:
                    print(f"   -> Nenhum fóssil com coordenada encontrado para o gênero: {genero}")
                    continue
                    
                for f in registros:
                    id_api = f.get("oid")
                    lat = f.get("lat")
                    lng = f.get("lng")
                    
                    # Trata o nome da localidade para evitar quebras por aspas simples
                    localidade = f.get("lng_res") or f.get("loc") or "Localidade catalogada pelo PBDB"
                    localidade_limpa = str(localidade).replace("'", " ")
                    
                    if lat and lng:
                        cursor.execute("""
                            INSERT INTO fossil (id_especie, localidade_exata, latitude, longitude, id_fossil_api)
                            VALUES (%s, %s, %s, %s, %s)
                            ON CONFLICT (id_fossil_api) DO NOTHING;
                        """, (id_especie, localidade_limpa, float(lat), float(lng), str(id_api)))
                        
                        contador_fosseis_total += 1
                
                print(f"[OK] Fósseis mapeados para: {nome_cientifico} ({len(registros)} encontrados)")
                conexao.commit()
                
                # Pausa para os limites de requisição da API pública
                time.sleep(0.2)
                
        except Exception as e:
            print(f"[Erro] Falha ao buscar fósseis para {nome_cientifico}: {e}")
            conexao.rollback()

    print(f"\n[Sucesso] Script concluído! Foram inseridos {contador_fosseis_total} fósseis geolocalizados.")

try:
    buscar_e_salvar_fosseis()
finally:
    cursor.close()
    conexao.close()
    print("Conexão encerrada com segurança.")
import os
import psycopg2
from dotenv import load_dotenv

load_dotenv()

def criar_tabelas():
    print("Iniciando a criação da estrutura do banco 'paleotree_db'...")
    
    conexao = None
    cursor = None
    
    try:
        conexao = psycopg2.connect(
            host="127.0.0.1",
            port=5433,                  
            database="paleotree_db",
            user="postgres",
            password=os.getenv("SENHA_BANCO")
        )
        cursor = conexao.cursor()
        print("Conexão estabelecida com sucesso!")

        # 1. Limpeza em Cascata
        cursor.execute("""
            DROP TABLE IF EXISTS fossil CASCADE;
            DROP TABLE IF EXISTS especie_dinossauro CASCADE;
            DROP TABLE IF EXISTS clado CASCADE;
            DROP TABLE IF EXISTS periodo_geologico CASCADE;
        """)
        print("Tabelas antigas removidas.")

        cursor.execute("""
            CREATE TABLE periodo_geologico (
                id_periodo SERIAL PRIMARY KEY,
                nome_periodo VARCHAR(100) NOT NULL UNIQUE,
                inicio_ma FLOAT,
                fim_ma FLOAT
            );
        """)

        cursor.execute("""
            CREATE TABLE clado (
                id_clado SERIAL PRIMARY KEY,
                nome_clado VARCHAR(100) NOT NULL UNIQUE,
                nivel_taxonomico VARCHAR(50),
                descricao TEXT,
                id_ancestral INT REFERENCES clado(id_clado) ON DELETE SET NULL
            );
        """)

        cursor.execute("""
            CREATE TABLE especie_dinossauro (
                id_especie SERIAL PRIMARY KEY,
                nome_cientifico VARCHAR(150) NOT NULL UNIQUE,
                nome_popular VARCHAR(150),
                id_periodo INT REFERENCES periodo_geologico(id_periodo) ON DELETE SET NULL,
                id_clado INT REFERENCES clado(id_clado) ON DELETE SET NULL,
                dieta VARCHAR(50),
                altura_m FLOAT,
                comprimento_m FLOAT,
                peso_estimado_kg FLOAT,
                descricao TEXT,
                ano_descoberta VARCHAR(50),
                url_imagem TEXT
            );
        """)

        cursor.execute("""
            CREATE TABLE fossil (
                id_fossil SERIAL PRIMARY KEY,
                id_especie INT REFERENCES especie_dinossauro(id_especie) ON DELETE CASCADE,
                localidade_exata VARCHAR(255),
                latitude FLOAT,
                longitude FLOAT
            );
        """)

        conexao.commit()
        print("Banco de dados criado com sucesso!")

    except Exception as e:
        print(f"Erro ao criar as tabelas: {e}")
        if conexao:
            conexao.rollback()
            
    finally:
        if cursor:
            cursor.close()
        if conexao:
            conexao.close()
            print("Conexão encerrada.")

if __name__ == "__main__":
    criar_tabelas()
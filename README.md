# Etapas na criação de um projeto

npm -> gerenciador de pacotes package.json (bibliotecas)
node -> executar/rodar nossa aplicação

1. Criação do package.json 
    npm init -y
2. Instalação de bibliotecas (micro framework) 
    npm install fastify
3. Instalar todas as dependências do projeto
    npm install
4. Criar arquivo principal (verificar package.json a tag "main")
    server.js
5. Garantir que o package.json suporte importação de módulos
    "type": "module"
6. Executar projeto
    node server.js
7. Fazer a aplicação reiniciar sempre que altero algo
    node --watch server.js
8. Criar script no package.json para executar projeto
    "scripts": {
        "dev": "node --watch server.js"
    }
9. Armazenar informações de forma local (banco em tempo de execução)
    database-memory.js
10. Importar os métodos do banco de dados no server.js
    Não esquecer de colocar a extensão do arquivo
    import { DatabaseMemory } from './database-memory.js'; 
11. Para testar, instalar a extensão REST CLIENT
    routes.http
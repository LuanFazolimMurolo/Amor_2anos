Instalação
Pré-requisitos

Antes de começar, tenha instalado na máquina:

Node.js
npm

Para verificar se já está instalado:

node -v
npm -v
Baixar o projeto

Clone o repositório:

git clone URL_DO_REPOSITORIO

Entre na pasta do projeto:

cd frontend
Instalar dependências

Instale todas as dependências do projeto:

npm install

Esse comando recria automaticamente a pasta node_modules.

A pasta node_modules não deve ser enviada para o GitHub.

Configurar variáveis de ambiente

Crie um arquivo chamado .env.local na raiz do projeto:

VITE_SUPABASE_URL=SUA_URL_DO_SUPABASE
VITE_SUPABASE_ANON_KEY=SUA_CHAVE_ANON_DO_SUPABASE

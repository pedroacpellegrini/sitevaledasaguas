# Como configurar o Supabase para depoimentos persistentes

O Supabase é um banco de dados gratuito que guarda os depoimentos enviados pelos clientes no site.
Mesmo após novos deploys, os depoimentos continuam salvos e visíveis para todos.

## Passo a passo (10 minutos)

### 1. Criar conta gratuita
- Acesse https://supabase.com e clique em **Start for free**
- Faça login com sua conta Google

### 2. Criar um novo projeto
- Clique em **New project**
- Escolha um nome (ex: `valedasaguas`)
- Defina uma senha para o banco e clique em **Create new project**
- Aguarde ~2 minutos enquanto o projeto é criado

### 3. Criar a tabela de depoimentos
- No menu lateral esquerdo, clique em **Table Editor**
- Clique em **New table**
- Nome da tabela: `depoimentos`
- Deixe **Enable Row Level Security (RLS)** marcado
- Adicione as colunas abaixo (além do `id` e `created_at` que já existem):

| Nome   | Tipo | Nullable |
|--------|------|----------|
| nome   | text | false    |
| texto  | text | false    |

- Clique em **Save**

### 4. Configurar permissões (RLS)
- Ainda no Table Editor, clique na tabela `depoimentos`
- Clique em **RLS** no topo da página
- Clique em **New Policy** → **Create a policy from scratch**
- **Policy para leitura (SELECT)**:
  - Policy name: `allow public read`
  - Allowed operation: `SELECT`
  - Target roles: `anon`
  - Using expression: `true`
  - Salve
- Clique em **New Policy** novamente
- **Policy para escrita (INSERT)**:
  - Policy name: `allow public insert`
  - Allowed operation: `INSERT`
  - Target roles: `anon`
  - With check expression: `true`
  - Salve

### 5. Pegar as credenciais
- No menu lateral, vá em **Settings** → **API**
- Copie:
  - **Project URL** (ex: `https://xyzabc.supabase.co`)
  - **anon public** key (chave longa)

### 6. Atualizar o site
Abra o arquivo `js/main.js` e substitua as linhas:

```js
const SUPABASE_URL  = 'COLE_AQUI_A_URL_DO_PROJETO';
const SUPABASE_ANON = 'COLE_AQUI_A_CHAVE_ANON';
```

Pelos seus valores reais, por exemplo:

```js
const SUPABASE_URL  = 'https://xyzabc.supabase.co';
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...';
```

### 7. Fazer commit e push
```bash
git add -A
git commit -m "Configura Supabase para depoimentos persistentes"
git push
```

Pronto! A partir daí, todos os depoimentos enviados pelo site ficam salvos no Supabase
e aparecem para qualquer visitante, mesmo após novos deploys.

## Visualizar depoimentos recebidos
- Acesse https://supabase.com → seu projeto → **Table Editor** → `depoimentos`
- Lá você verá todos os depoimentos com nome, texto e data/hora de envio
- Você pode excluir depoimentos inadequados diretamente pela interface

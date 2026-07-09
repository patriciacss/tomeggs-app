# TomÉgg — Controle de Vendas e Entregas

MVP para controle de vendas e entregas de ovos, pensado para uso no celular durante as
entregas de kombi. Os dados ficam salvos **localmente** no aparelho (funciona offline) e
podem ser sincronizados com o **Supabase** (plano gratuito) quando houver internet.

## Como executar

```bash
npm install
npm run dev
```

Abra o endereço mostrado no terminal (geralmente `http://localhost:5173`) — de preferência
no navegador do celular, ou usando as ferramentas de emulação mobile do navegador do
computador.

Para gerar a versão de produção:

```bash
npm run build
npm run preview
```

## Sincronização na nuvem (opcional)

O app funciona **100% offline** — tudo é salvo primeiro no celular. Para guardar os dados
na nuvem gratuitamente:

1. Crie um projeto em [supabase.com](https://supabase.com) (plano gratuito)
2. No SQL Editor, execute o arquivo `supabase/schema.sql`
3. Copie `.env.example` para `.env` e preencha as credenciais:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Reinicie o app (`npm run dev`)

Quando houver internet, os dados são sincronizados automaticamente. Na aba **Backup** você
pode ver o status e forçar uma sincronização manual.

## Dados de demonstração

Na primeira execução o app cria automaticamente 4 clientes fictícios (Maria, João,
Padaria Sol e Mercado Central) com histórico de vendas, para que você possa testar tudo
imediatamente. Esses dados só são criados se o localStorage estiver vazio — depois disso,
tudo que você cadastrar/vender fica salvo normalmente.

Para recomeçar do zero, limpe os dados do site nas ferramentas do navegador (ou vá em
**Backup** e importe um arquivo vazio/outro backup).

## Estrutura do projeto

```
src/
  components/    Componentes de domínio (item de rota, formulário de venda, histórico...)
    ui/          Componentes de interface genéricos e reutilizáveis (Button, Card, etc.)
  pages/         Uma tela completa por arquivo (Tela 1, 2, 3, cadastro, resumo, backup)
  hooks/         Hooks React que conectam as páginas aos services
  services/      Regras de negócio (clientes, vendas, visitas, backup, dados de exemplo)
  storage/       Único ponto de acesso ao localStorage
  types/         Tipos TypeScript do domínio e da navegação
  utils/         Formatação de data e moeda, geração de id
  styles/        Variáveis de design (cores, tipografia) e reset global
```

## Navegação

O app não usa nenhuma biblioteca de rotas — a navegação é feita com uma pilha de telas
simples em `App.tsx`, o que é suficiente para o fluxo linear do app e evita dependências
pesadas. Existem 4 abas fixas na barra inferior: **Rota**, **Resumo**, **Clientes** e
**Backup**.

## Preparação para PWA

O projeto ainda não é um PWA (por pedido do escopo inicial), mas já está organizado de
forma compatível: basta futuramente adicionar um `manifest.json`, ícones e um service
worker (por exemplo com o plugin `vite-plugin-pwa`) sem precisar reestruturar o código.

## Backup

Na aba **Backup** é possível exportar todos os dados (clientes, vendas e visitas) em um
arquivo `.json`, e importar esse mesmo arquivo depois para restaurar tudo — útil para
trocar de celular ou guardar uma cópia de segurança.

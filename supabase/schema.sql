-- Schema do banco de dados para o app TomÉgg
-- Execute este SQL no SQL Editor do Supabase (plano gratuito)
--
-- Cada linha pertence a um usuário (auth.users) via user_id, e o RLS garante
-- que cada usuário autenticado só enxerga e altera os próprios dados.
--
-- Este script é seguro para rodar de novo (idempotente), inclusive em bancos
-- que já tinham as tabelas criadas antes da coluna user_id existir.

create table if not exists clients (
  id text primary key,
  name text not null,
  address text not null default '',
  phone text not null default '',
  notes text not null default '',
  delivery_days jsonb not null default '[]',
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted boolean not null default false
);

create table if not exists sales (
  id text primary key,
  client_id text not null,
  date text not null,
  product_type text not null default 'branco',
  dozens numeric not null,
  unit text not null default 'cartela',
  amount numeric not null,
  paid boolean not null,
  payment_method text,
  created_at timestamptz not null,
  updated_at timestamptz not null,
  deleted boolean not null default false
);

create table if not exists visits (
  id text primary key,
  client_id text not null,
  date text not null,
  visited_at timestamptz not null,
  updated_at timestamptz not null,
  deleted boolean not null default false
);

-- Garante a coluna user_id mesmo em tabelas criadas antes desta migração
-- ("create table if not exists" acima não altera tabelas já existentes).
alter table clients add column if not exists user_id uuid references auth.users (id) on delete cascade;
alter table sales add column if not exists user_id uuid references auth.users (id) on delete cascade;
alter table visits add column if not exists user_id uuid references auth.users (id) on delete cascade;
alter table sales add column if not exists unit text not null default 'cartela';

create index if not exists clients_updated_at_idx on clients (updated_at);
create index if not exists sales_updated_at_idx on sales (updated_at);
create index if not exists visits_updated_at_idx on visits (updated_at);

create index if not exists clients_user_id_idx on clients (user_id);
create index if not exists sales_user_id_idx on sales (user_id);
create index if not exists visits_user_id_idx on visits (user_id);

alter table clients enable row level security;
alter table sales enable row level security;
alter table visits enable row level security;

drop policy if exists "Permitir leitura pública" on clients;
drop policy if exists "Permitir escrita pública" on clients;
drop policy if exists "Permitir atualização pública" on clients;
drop policy if exists "Ler apenas os próprios clientes" on clients;
drop policy if exists "Criar clientes para si mesmo" on clients;
drop policy if exists "Atualizar apenas os próprios clientes" on clients;

drop policy if exists "Permitir leitura pública" on sales;
drop policy if exists "Permitir escrita pública" on sales;
drop policy if exists "Permitir atualização pública" on sales;
drop policy if exists "Ler apenas as próprias vendas" on sales;
drop policy if exists "Criar vendas para si mesmo" on sales;
drop policy if exists "Atualizar apenas as próprias vendas" on sales;

drop policy if exists "Permitir leitura pública" on visits;
drop policy if exists "Permitir escrita pública" on visits;
drop policy if exists "Permitir atualização pública" on visits;
drop policy if exists "Ler apenas as próprias visitas" on visits;
drop policy if exists "Criar visitas para si mesmo" on visits;
drop policy if exists "Atualizar apenas as próprias visitas" on visits;

create policy "Ler apenas os próprios clientes" on clients
  for select using (auth.uid() = user_id);
create policy "Criar clientes para si mesmo" on clients
  for insert with check (auth.uid() = user_id);
create policy "Atualizar apenas os próprios clientes" on clients
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Ler apenas as próprias vendas" on sales
  for select using (auth.uid() = user_id);
create policy "Criar vendas para si mesmo" on sales
  for insert with check (auth.uid() = user_id);
create policy "Atualizar apenas as próprias vendas" on sales
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Ler apenas as próprias visitas" on visits
  for select using (auth.uid() = user_id);
create policy "Criar visitas para si mesmo" on visits
  for insert with check (auth.uid() = user_id);
create policy "Atualizar apenas as próprias visitas" on visits
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Este app não tem tela de cadastro: crie os usuários pelo painel do Supabase
-- (Authentication > Users > Add user) com e-mail e senha.
--
-- Se já existiam clientes/vendas/visitas cadastrados antes desta migração,
-- eles ficam com user_id nulo e somem para o RLS. Depois de criar seu
-- usuário, pegue o UUID dele em Authentication > Users e rode (trocando
-- o UUID abaixo):
--
-- update clients set user_id = '00000000-0000-0000-0000-000000000000' where user_id is null;
-- update sales   set user_id = '00000000-0000-0000-0000-000000000000' where user_id is null;
-- update visits  set user_id = '00000000-0000-0000-0000-000000000000' where user_id is null;

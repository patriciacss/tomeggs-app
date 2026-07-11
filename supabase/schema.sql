-- Schema do banco de dados para o app TomÉgg
-- Execute este SQL no SQL Editor do Supabase (plano gratuito)
--
-- O RLS aqui exige apenas estar logado (qualquer usuário com e-mail/senha
-- válidos criado no painel do Supabase) — os dados são compartilhados entre
-- todos os usuários autenticados, não isolados por dono. A coluna user_id
-- fica só como registro de quem criou cada linha, sem afetar permissões.
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

-- Ordem de visita (arrastar e soltar) dos clientes em cada dia da semana.
-- Uma linha por dia da semana, compartilhada entre todos os usuários.
create table if not exists route_order (
  weekday text primary key,
  client_ids jsonb not null default '[]',
  updated_at timestamptz not null
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
create index if not exists route_order_updated_at_idx on route_order (updated_at);

create index if not exists clients_user_id_idx on clients (user_id);
create index if not exists sales_user_id_idx on sales (user_id);
create index if not exists visits_user_id_idx on visits (user_id);

alter table clients enable row level security;
alter table sales enable row level security;
alter table visits enable row level security;
alter table route_order enable row level security;

drop policy if exists "Permitir leitura pública" on clients;
drop policy if exists "Permitir escrita pública" on clients;
drop policy if exists "Permitir atualização pública" on clients;
drop policy if exists "Ler apenas os próprios clientes" on clients;
drop policy if exists "Criar clientes para si mesmo" on clients;
drop policy if exists "Atualizar apenas os próprios clientes" on clients;
drop policy if exists "Ler clientes se estiver logado" on clients;
drop policy if exists "Criar clientes se estiver logado" on clients;
drop policy if exists "Atualizar clientes se estiver logado" on clients;

drop policy if exists "Permitir leitura pública" on sales;
drop policy if exists "Permitir escrita pública" on sales;
drop policy if exists "Permitir atualização pública" on sales;
drop policy if exists "Ler apenas as próprias vendas" on sales;
drop policy if exists "Criar vendas para si mesmo" on sales;
drop policy if exists "Atualizar apenas as próprias vendas" on sales;
drop policy if exists "Ler vendas se estiver logado" on sales;
drop policy if exists "Criar vendas se estiver logado" on sales;
drop policy if exists "Atualizar vendas se estiver logado" on sales;

drop policy if exists "Permitir leitura pública" on visits;
drop policy if exists "Permitir escrita pública" on visits;
drop policy if exists "Permitir atualização pública" on visits;
drop policy if exists "Ler apenas as próprias visitas" on visits;
drop policy if exists "Criar visitas para si mesmo" on visits;
drop policy if exists "Atualizar apenas as próprias visitas" on visits;
drop policy if exists "Ler visitas se estiver logado" on visits;
drop policy if exists "Criar visitas se estiver logado" on visits;
drop policy if exists "Atualizar visitas se estiver logado" on visits;

create policy "Ler clientes se estiver logado" on clients
  for select using (auth.uid() is not null);
create policy "Criar clientes se estiver logado" on clients
  for insert with check (auth.uid() is not null);
create policy "Atualizar clientes se estiver logado" on clients
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "Ler vendas se estiver logado" on sales
  for select using (auth.uid() is not null);
create policy "Criar vendas se estiver logado" on sales
  for insert with check (auth.uid() is not null);
create policy "Atualizar vendas se estiver logado" on sales
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

create policy "Ler visitas se estiver logado" on visits
  for select using (auth.uid() is not null);
create policy "Criar visitas se estiver logado" on visits
  for insert with check (auth.uid() is not null);
create policy "Atualizar visitas se estiver logado" on visits
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

drop policy if exists "Ler ordem de rota se estiver logado" on route_order;
drop policy if exists "Criar ordem de rota se estiver logado" on route_order;
drop policy if exists "Atualizar ordem de rota se estiver logado" on route_order;

create policy "Ler ordem de rota se estiver logado" on route_order
  for select using (auth.uid() is not null);
create policy "Criar ordem de rota se estiver logado" on route_order
  for insert with check (auth.uid() is not null);
create policy "Atualizar ordem de rota se estiver logado" on route_order
  for update using (auth.uid() is not null) with check (auth.uid() is not null);

-- Este app não tem tela de cadastro: crie os usuários pelo painel do Supabase
-- (Authentication > Users > Add user) com e-mail e senha. Qualquer usuário
-- criado lá passa a enxergar e editar os mesmos dados dos demais.

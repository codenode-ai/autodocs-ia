-- Certifique-se de que o schema existe
create schema if not exists APP_RELATORIOS;

-- Tabela de usuários (usando autenticação do Supabase, mas pode ter perfil extra)
create table if not exists APP_RELATORIOS.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  nome text,
  empresa text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de projetos
create table if not exists APP_RELATORIOS.projetos (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  descricao text,
  cliente_id uuid not null references APP_RELATORIOS.profiles(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de relatórios
create table if not exists APP_RELATORIOS.relatorios (
  id uuid primary key default gen_random_uuid(),
  projeto_id uuid not null references APP_RELATORIOS.projetos(id) on delete cascade,
  titulo text not null,
  tipo text,
  status text default 'rascunho',
  markdown text,
  pdf_url text,
  criado_por uuid references APP_RELATORIOS.profiles(id),
  finalizado_em timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de anexos (fotos, planilhas, etc)
create table if not exists APP_RELATORIOS.anexos (
  id uuid primary key default gen_random_uuid(),
  relatorio_id uuid not null references APP_RELATORIOS.relatorios(id) on delete cascade,
  url text not null,
  legenda text,
  tipo text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Tabela de histórico de relatórios
create table if not exists APP_RELATORIOS.historico_relatorios (
  id uuid primary key default gen_random_uuid(),
  relatorio_id uuid not null references APP_RELATORIOS.relatorios(id) on delete cascade,
  acao text not null,
  usuario_id uuid references APP_RELATORIOS.profiles(id),
  data timestamp with time zone default timezone('utc'::text, now())
);

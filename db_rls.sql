-- Ativar RLS nas tabelas
alter table APP_RELATORIOS.profiles enable row level security;
alter table APP_RELATORIOS.projetos enable row level security;
alter table APP_RELATORIOS.relatorios enable row level security;
alter table APP_RELATORIOS.anexos enable row level security;
alter table APP_RELATORIOS.historico_relatorios enable row level security;

-- RLS para profiles: só pode ver/editar o próprio perfil
create policy "Self profile access" on APP_RELATORIOS.profiles
  for all using (auth.uid() = id);

-- RLS para projetos: só pode acessar projetos do seu cliente
create policy "Projetos do cliente" on APP_RELATORIOS.projetos
  for all using (cliente_id = auth.uid());

-- RLS para relatórios: só pode acessar relatórios de projetos do seu cliente
create policy "Relatorios do cliente" on APP_RELATORIOS.relatorios
  for all using (
  projeto_id in (select id from APP_RELATORIOS.projetos where cliente_id = auth.uid())
);

-- RLS para anexos: só pode acessar anexos de relatórios do seu cliente
create policy "Anexos do cliente" on APP_RELATORIOS.anexos
  for all using (
  relatorio_id in (select id from APP_RELATORIOS.relatorios where projeto_id in (select id from APP_RELATORIOS.projetos where cliente_id = auth.uid()))
);

-- RLS para histórico: só pode acessar histórico de relatórios do seu cliente
create policy "Historico do cliente" on APP_RELATORIOS.historico_relatorios
  for all using (
  relatorio_id in (select id from APP_RELATORIOS.relatorios where projeto_id in (select id from APP_RELATORIOS.projetos where cliente_id = auth.uid()))
);

# Plano de Implementação - AutoDocs IA

## Componentes já existentes (Lovable)
O projeto já possui uma estrutura sólida com os seguintes componentes:
- Dashboard com estatísticas
- Área de upload de documentos
- Lista de relatórios
- Editor de relatórios com funcionalidades básicas
- Context API para gerenciamento de estado
- Hooks para processamento de arquivos e IA
- Componentes UI baseados em shadcn/ui

## Funcionalidades faltantes conforme o PRD
Comparando o PRD com a implementação atual, precisamos adicionar:

1. **Autenticação e Single Tenant**:
   - Sistema de login/cadastro por e-mail e senha
   - Isolamento de dados por cliente

2. **Gestão de Projetos**:
   - CRUD de projetos
   - Associação de relatórios a projetos

3. **Wizard de Criação de Relatórios**:
   - Etapas: dados básicos, upload de evidências, rascunho com IA
   - Interface específica para cada etapa

4. **Integração com Supabase e OpenAI**:
   - Funções Edge no Supabase para chamadas à OpenAI
   - Processamento real com IA (atualmente simulado)
   - Armazenamento seguro de dados

5. **Exportação avançada em PDF**:
   - Templates com logo e cores da empresa
   - Cabeçalho/pé de página personalizados

6. **Controle de Acesso**:
   - Permissões por usuário
   - RLS (Row Level Security) no Supabase

## Plano de Implementação por Fases

### Fase 1 - Setup (Semana 1)
- [ ] Configurar Supabase (Auth, PostgreSQL, Storage)
- [ ] Implementar autenticação real (não simulada)
- [ ] Configurar RLS no Supabase
- [ ] Adicionar variáveis de ambiente para chaves de API
- [ ] Criar estrutura de projetos no banco de dados

### Fase 2 - Estrutura (Semanas 2-3)
- [ ] Implementar CRUD completo de Projetos
- [ ] Aprimorar CRUD de Relatórios para funcionar com o Supabase
- [ ] Implementar upload real de fotos e anexos no Storage do Supabase
- [ ] Criar relacionamentos entre projetos e relatórios

### Fase 3 - IA (Semana 4)
- [ ] Criar função Edge no Supabase para chamadas à OpenAI
- [ ] Implementar processamento real de texto com GPT-4o-mini
- [ ] Adicionar processamento de imagens com visão computacional
- [ ] Integrar geração de rascunho em Markdown

### Fase 4 - PDF (Semana 5)
- [ ] Implementar editor de texto mais avançado
- [ ] Criar sistema de templates para PDF
- [ ] Adicionar funcionalidade de exportação em PDF com identidade visual
- [ ] Implementar armazenamento seguro de relatórios gerados

### Fase 5 - Polimento (Semana 6)
- [ ] Aprimorar UX (estados de loading, progresso do wizard)
- [ ] Realizar testes manuais completos
- [ ] Preparar para deploy inicial (Vercel)

## Checklist para Deploy na Vercel

1. **Configurações do Projeto**:
   - [ ] Verificar arquivo `vercel.json` (já presente)
   - [ ] Configurar variáveis de ambiente no painel da Vercel
   - [ ] Verificar build settings (comando `vite build`, pasta `dist`)

2. **Integrações Externas**:
   - [ ] Configurar chaves da OpenAI
   - [ ] Configurar credenciais do Supabase
   - [ ] Verificar URLs de callback para autenticação

3. **Otimizações para Produção**:
   - [ ] Remover código de desenvolvimento/debug
   - [ ] Otimizar imagens e assets
   - [ ] Configurar cache apropriado
   - [ ] Verificar performance da aplicação

4. **Segurança**:
   - [ ] Verificar CORS settings
   - [ ] Configurar HTTP headers apropriados
   - [ ] Remover qualquer chave de API hardcoded

5. **Monitoramento**:
   - [ ] Configurar analytics (opcional)
   - [ ] Configurar logging de erros
   - [ ] Preparar para monitoramento de performance

Este plano fornece uma abordagem estruturada para evoluir o projeto atual para o MVP descrito no PRD. A base já existente no Lovable nos dá um ponto sólido de partida, e as fases propostas seguem exatamente o roadmap definido no documento.
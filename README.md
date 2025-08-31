# 📄 AutoDocs IA - Sistema de Geração Automática de Relatórios

[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.19-purple.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38B2AC.svg)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> Uma aplicação web moderna para geração automática de relatórios inteligentes a partir de documentos usando IA.

## 🚀 Visão Geral

O **AutoDocs IA** é uma plataforma completa que permite aos usuários fazer upload de documentos (PDF, Word, Excel, etc.) e gerar automaticamente relatórios profissionais usando inteligência artificial. O sistema oferece um editor rico para personalização e exportação em múltiplos formatos.

### ✨ Principais Funcionalidades

- 📤 **Upload Inteligente**: Drag & drop de múltiplos arquivos
- 🤖 **Processamento com IA**: Extração e análise automática de conteúdo
- 📝 **Editor Rico**: Interface avançada para edição de relatórios
- 📊 **Dashboard Analítico**: Métricas e estatísticas em tempo real
- 📄 **Exportação Múltipla**: PDF, HTML e formatos editáveis
- 💾 **Auto-save**: Salvamento automático de progresso
- 🌙 **Tema Adaptativo**: Suporte a tema claro/escuro
- 📱 **Responsivo**: Interface otimizada para todos os dispositivos

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React 18** - Biblioteca JavaScript para interfaces
- **TypeScript** - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **React Router DOM** - Roteamento da aplicação
- **React Hook Form** - Gerenciamento de formulários
- **React Query** - Gerenciamento de estado do servidor

### UI/UX
- **Tailwind CSS** - Framework CSS utilitário
- **shadcn/ui** - Componentes React reutilizáveis
- **Radix UI** - Primitivos acessíveis
- **Lucide React** - Ícones modernos
- **Framer Motion** - Animações suaves

### Funcionalidades
- **React Quill** - Editor de texto rico
- **jsPDF** - Geração de PDFs
- **html2canvas** - Captura de elementos
- **date-fns** - Manipulação de datas
- **Zod** - Validação de esquemas

## 📦 Instalação e Configuração

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Passos para Instalação

1. **Clone o repositório**
```bash
git clone https://github.com/seu-usuario/autodocs-ia.git
cd autodocs-ia
```

2. **Instale as dependências**
```bash
npm install
# ou
yarn install
```

3. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
# ou
yarn dev
```

4. **Acesse a aplicação**
```
http://localhost:5173
```

### Scripts Disponíveis

```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run build:dev    # Build para desenvolvimento
npm run preview      # Preview do build
npm run lint         # Executa ESLint
```

## 🏗️ Estrutura do Projeto

```
autodocs-ia/
├── public/                 # Arquivos estáticos
├── src/
│   ├── components/         # Componentes React
│   │   ├── ui/            # Componentes base (shadcn/ui)
│   │   ├── Dashboard.tsx  # Dashboard principal
│   │   ├── UploadArea.tsx # Área de upload
│   │   ├── ReportsList.tsx # Lista de relatórios
│   │   ├── RichTextEditor.tsx # Editor de texto
│   │   └── Sidebar.tsx    # Barra lateral
│   ├── contexts/          # Contextos React
│   │   └── AppContext.tsx # Contexto principal
│   ├── hooks/             # Hooks customizados
│   │   ├── useFileProcessor.ts # Processamento de arquivos
│   │   └── useAIProcessor.ts   # Processamento com IA
│   ├── pages/             # Páginas da aplicação
│   │   ├── Index.tsx      # Página inicial
│   │   ├── ReportEditor.tsx # Editor de relatórios
│   │   └── NotFound.tsx   # Página 404
│   ├── lib/               # Utilitários
│   └── main.tsx           # Ponto de entrada
├── package.json
├── tailwind.config.ts
├── vite.config.ts
└── README.md
```

## 🎯 Como Usar

### 1. Dashboard
- Visualize estatísticas dos seus documentos
- Acompanhe relatórios recentes
- Monitore o progresso de processamento

### 2. Upload de Documentos
- Arraste arquivos para a área de upload
- Suporte a PDF, Word, Excel, TXT e CSV
- Limite de 50MB por arquivo
- Processamento automático com IA

### 3. Editor de Relatórios
- Interface rica para edição
- Auto-save a cada 2 segundos
- Exportação para PDF e HTML
- Configurações personalizáveis

### 4. Gerenciamento
- Visualize todos os documentos enviados
- Acompanhe status de processamento
- Remova arquivos desnecessários
- Acesse histórico de relatórios

## 🔧 Configuração Avançada

### Variáveis de Ambiente
Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_APP_TITLE=AutoDocs IA
VITE_API_URL=http://localhost:3000
VITE_AI_PROVIDER=openai
```

### Personalização de Temas
Edite `tailwind.config.ts` para customizar cores e estilos:

```typescript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          hover: '#2563EB',
        },
        // ... outras cores
      }
    }
  }
}
```

## 🚀 Deploy

### Deploy na Vercel
1. Conecte seu repositório à Vercel
2. Configure as variáveis de ambiente
3. Deploy automático a cada push

### Deploy no Netlify
1. Conecte o repositório ao Netlify
2. Configure o build command: `npm run build`
3. Configure o publish directory: `dist`

### Build Local
```bash
npm run build
npm run preview
```

## 🤝 Contribuindo

1. **Fork** o projeto
2. Crie uma **branch** para sua feature (`git checkout -b feature/AmazingFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. **Push** para a branch (`git push origin feature/AmazingFeature`)
5. Abra um **Pull Request**

### Padrões de Código
- Use TypeScript para todos os arquivos
- Siga as convenções do ESLint
- Escreva testes para novas funcionalidades
- Documente componentes complexos

## 📝 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 🆘 Suporte

- 📧 **Email**: suporte@autodocs-ia.com
- 💬 **Discord**: [AutoDocs IA Community](https://discord.gg/autodocs-ia)
- 📖 **Documentação**: [docs.autodocs-ia.com](https://docs.autodocs-ia.com)
- 🐛 **Issues**: [GitHub Issues](https://github.com/seu-usuario/autodocs-ia/issues)

## 🙏 Agradecimentos

- [shadcn/ui](https://ui.shadcn.com/) pelos componentes
- [Vite](https://vitejs.dev/) pela ferramenta de build
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [React](https://reactjs.org/) pela biblioteca JavaScript

---

**Desenvolvido com ❤️ pela equipe AutoDocs IA**

[![GitHub stars](https://img.shields.io/github/stars/seu-usuario/autodocs-ia?style=social)](https://github.com/seu-usuario/autodocs-ia)
[![GitHub forks](https://img.shields.io/github/forks/seu-usuario/autodocs-ia?style=social)](https://github.com/seu-usuario/autodocs-ia)
[![GitHub issues](https://img.shields.io/github/issues/seu-usuario/autodocs-ia)](https://github.com/seu-usuario/autodocs-ia/issues)

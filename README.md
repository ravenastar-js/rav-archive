<div align="center">

# 🤖 Rav Archive
### Arquivador Automático de URLs no Wayback Machine

[![⭐ Stars](https://img.shields.io/github/stars/ravenastar-js/rav-archive?style=for-the-badge&label=%E2%AD%90%20Stars&color=2d7445&logo=star&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/stargazers)
[![🔱 Forks](https://img.shields.io/github/forks/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%94%B1%20Forks&color=2d7445&logo=git&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/network/members)
[![👁️ Watchers](https://img.shields.io/github/watchers/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%91%81%EF%B8%8F%20Watchers&color=2d7445&logo=eye&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/watchers)
[![📄 License](https://img.shields.io/github/license/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%93%84%20License&color=2d7445&logo=book&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/blob/main/LICENSE)
[![🕒 Last Commit](https://img.shields.io/github/last-commit/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%95%92%20Last%20Commit&color=2d7445&logo=clock&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/commits/all)
[![🐞 Issues](https://img.shields.io/github/issues/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%90%9E%20Issues&color=2d7445&logo=bug&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/issues)
[![📦 Repo Size](https://img.shields.io/github/repo-size/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%93%A6%20Repo%20Size&color=2d7445&logo=database&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive)
[![⚙️ Node.js](https://img.shields.io/badge/%E2%9A%99%EF%B8%8F%20Node.js-16.0%2B-green?style=for-the-badge&logo=nodedotjs&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://nodejs.org/)
[![🎭 Playwright](https://img.shields.io/badge/%F0%9F%8E%AD%20Playwright-Latest-blue?style=for-the-badge&logo=playwright&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://playwright.dev/)
[![🖥️ Platform](https://img.shields.io/badge/%F0%9F%96%A5%EF%B8%8F%20Platform-Windows-blue?style=for-the-badge&logo=windows&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/wintools)

*Automatize o arquivamento de URLs com produtividade*

</div>

---

## 📋 Índice

<details>
<summary><strong>🚀 Início Rápido</strong></summary>

- [Como Usar](#-como-usar)
- [Instalação](#-instalação)
- [Primeiro Uso](#-primeiro-uso)

</details>

<details>
<summary><strong>⚡ Funcionalidades</strong></summary>

- [Recursos Principais](#-recursos-principais)
- [Características Técnicas](#-características-técnicas)

</details>

<details>
<summary><strong>📁 Estrutura e Configuração</strong></summary>

- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Configuração do links.txt](#-configuração-do-linkstxt)
- [Formato JSON de Saída](#-formato-json-de-saída)

</details>

<details>
<summary><strong>🛠️ Comandos e Uso Avançado</strong></summary>

- [Comandos Disponíveis](#️-comandos-disponíveis)
- [Exemplos de Uso](#-exemplos-de-uso)
- [Troubleshooting](#-troubleshooting)

</details>

<details>
<summary><strong>📊 Monitoramento e Relatórios</strong></summary>

- [Saída do Terminal](#-saída-do-terminal)
- [Interpretando Resultados](#-interpretando-resultados)

</details>

<details>
<summary><strong>⚙️ Requisitos e Limitações</strong></summary>

- [Requisitos do Sistema](#️-requisitos-do-sistema)
- [Limitações Conhecidas](#-limitações-conhecidas)

</details>

---

## 🚀 Como Usar

### 📥 Instalação
1. **Baixe o projeto**
   ```
   https://github.com/ravenastar-js/rav-archive/archive/refs/heads/main.zip
   ```

### ⚙️ Preparação
2. **Configure suas URLs**
   - Abra o arquivo `links.txt` na pasta raiz
   - Adicione as URLs (um por linha)
   ```
   https://exemplo1.com
   https://exemplo2.com/blog
   https://exemplo3.com/artigo
   ```

### 🚀 Execução
3. **Execute o arquivador**
   ```
   iniciar.bat
   ```

### 📊 Resultados
4. **Aguarde o processamento**
   - O script é 100% automático
   - Progresso visível no terminal
   - Resultados salvos na pasta `DADOS/`

> **💡 Dica:** Todas as dependências são instaladas automaticamente na primeira execução.

---

## ⚡ Recursos Principais

### 🔧 **Configuração Automática**
- ✅ Instalação automática de dependências
- ✅ Configuração do Playwright
- ✅ Detecção inteligente do ambiente

### 🧠 **Inteligência Integrada**
- 🔍 Verificação de URLs já arquivadas
- 📤 Arquivamento apenas de URLs novas
- 🚫 Detecção automática de limites
- ⚡ Processamento otimizado em lote

### 📊 **Relatórios Completos**
- 📈 Progresso em tempo real
- 📋 Resultados estruturados em JSON
- 🎯 Relatórios com timestamp

---

## 📁 Estrutura de Arquivos

```
📁 rav-archive/
├── 📄 archive.js
├── 📦 package.json
├── 📖 README.md
├── ⚡ iniciar.bat # [EXECUTAR]
├── 📝 links.txt # [EDITAR]
└── 📁 DADOS/
    ├── 📊 progress_log.json
    ├── 📋 archive_results.json
    └── 📈 final_report_[data].json
```

---

## 🛠️ Comandos Disponíveis

### ▶️ Execução Básica
```
iniciar.bat
```

### 🔍 Verificação Manual
```
node archive.js
```

### 🧹 Limpeza de Cache
```
npx playwright install
```

---

## 📝 Configuração do links.txt

### Formato Correto:
```
https://site1.com
https://site2.com/pagina
http://site3.com/artigo
```

### ❌ Evite:
- URLs malformadas
- Linhas vazias
- Caracteres especiais desnecessários

---

## ⚙️ Requisitos do Sistema

### Mínimos:
- Windows 10/11
- Node.js 16.0 ou superior
- 2GB de RAM livre
- Conexão internet estável

### Recomendados:
- Node.js 18.0+
- 4GB RAM livre
- CPU multi-core
- Banda larga >10Mbps

---

## 🆘 Troubleshooting

### ❌ Erro Comum: Dependências
```
Erro: Cannot find module 'playwright'
Solução: Execute iniciar.bat novamente
```

### ❌ Erro: URLs Inválidas
```
Erro: Invalid URL format
Solução: Verifique o formato no links.txt
```

### ❌ Erro: Timeout
```
Erro: Navigation timeout
Solução: Verifique conexão internet
```

---

## 📄 Licença

Este projeto está sob licença MIT. Veja o arquivo [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**Feito com 💚 por RavenaStar**

[⬆ Voltar ao topo](#-rav-archive)

</div>
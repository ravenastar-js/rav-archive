<div align="center">

# 🤖 Rav Archive
### Arquivador Automático de URLs no Wayback Machine

[![⭐ Stars](https://img.shields.io/github/stars/ravenastar-js/rav-archive?style=for-the-badge&label=%E2%AD%90%20Stars&color=2d7445&logo=star&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/stargazers)
[![🔱 Forks](https://img.shields.io/github/forks/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%94%B1%20Forks&color=2d7445&logo=git&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/network/members)
[![👁️ Watchers](https://img.shields.io/github/watchers/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%91%81%EF%B8%8F%20Watchers&color=2d7445&logo=eye&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/watchers)
[![🕒 Last Commit](https://img.shields.io/github/last-commit/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%95%92%20Last%20Commit&color=2d7445&logo=clock&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/commits/all)
[![🐞 Issues](https://img.shields.io/github/issues/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%90%9E%20Issues&color=2d7445&logo=bug&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/issues)
[![📦 Repo Size](https://img.shields.io/github/repo-size/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%93%A6%20Repo%20Size&color=2d7445&logo=database&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive)
[![⚙️ Node.js](https://img.shields.io/badge/%E2%9A%99%EF%B8%8F%20Node.js-16.0%2B-green?style=for-the-badge&logo=nodedotjs&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://nodejs.org/pt/download)
[![🎭 Playwright](https://img.shields.io/badge/%F0%9F%8E%AD%20Playwright-Latest-blue?style=for-the-badge&logo=playwright&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://playwright.dev/)
[![🖥️ Platform](https://img.shields.io/badge/%F0%9F%96%A5%EF%B8%8F%20Platform-Windows-blue?style=for-the-badge&logo=windows&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/wintools)

*Automatize o arquivamento de URLs com produtividade*

</div>

![RavArchive](https://i.imgur.com/dZpPQty.png)

<div align="center">
BANNER INSPIRADO EM
<br>
<a href="https://store.steampowered.com/app/1507580/Enigma_do_Medo" >
  <img src="https://i.imgur.com/Gbyx94i.png" width="180">
</a>
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

</details>

<details>
<summary><strong>📁 Estrutura e Configuração</strong></summary>

- [Estrutura de Arquivos](#-estrutura-de-arquivos)
- [Configuração do links.txt](#-configuração-do-linkstxt)

</details>

<details>
<summary><strong>🛠️ Comandos e Uso Avançado</strong></summary>

- [Comandos Disponíveis](#️-comandos-disponíveis)
- [Troubleshooting](#-troubleshooting)

</details>

<details>
<summary><strong>⚙️ Requisitos e Limitações</strong></summary>

- [Requisitos do Sistema](#️-requisitos-do-sistema)

</details>

---

## ✨ FAQ

<details>
<summary>📥 Como instalar o NodeJS?</summary>
- [COMO INSTALAR NODE JS NO WINDOWS?](https://youtu.be/-jft_9PlffQ)
</details>

<details>
<summary>📥 Como baixar e executar o Rav Archive?</summary>
<img src="https://i.imgur.com/hLh76om.gif" alt="Baixando e executando o Rav Archive"/>
</details>

---

## 🚀 Como Usar

### 📥 Instalação

1. **Baixe o projeto como ZIP**
   - Link direto:
     ```
     https://github.com/ravenastar-js/rav-archive/archive/refs/heads/main.zip
     ```

   - Ou via CMD (sem Git), usando `curl`:
     ```
     curl -L -o rav-archive.zip https://github.com/ravenastar-js/rav-archive/archive/refs/heads/main.zip
     ```

2. **Extraia o conteúdo**
   - Manualmente: clique com o botão direito no `.zip` e selecione **“Extrair tudo”**
   - Ou via terminal:
     ```
     tar -xf rav-archive.zip
     ```

### ⚙️ Preparação
3. **Configure suas URLs**
   - Abra o arquivo `links.txt` na pasta raiz
   - Adicione as URLs (um por linha)
   ```
   https://exemplo1.com
   https://exemplo2.com/blog
   https://exemplo3.com/artigo
   ```

### 🚀 Execução
4. **Execute o arquivador**
   ```
   iniciar.bat
   ```

### 📊 Resultados
5. **Aguarde o processamento**
   - O script é 100% automático
   - Progresso visível no terminal
   - Resultados salvos na pasta `DADOS/` e `DOCS/`

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
- 📄 Relatório final é gerado em `.txt` na pasta `DOCS/`

---

## 📁 Estrutura de Arquivos

```
📁 rav-archive/
├── 📄 archive.js                    # [OBRIGATÓRIO]
├── 📦 package.json                  # [OBRIGATÓRIO]
├── 📖 README.md                     # [OPCIONAL]
├── ⚡ iniciar.bat                   # [EXECUTÁVEL]
├── 📝 links.txt                     # [EDITÁVEL]
├── 📁 DOCS/                         # [OBRIGATÓRIO]
│   └── 📄 relatorio_[data].txt      # [GERADO AUTOMATICAMENTE]
└── 📁 DADOS/                        # [OBRIGATÓRIO]
    ├── 📊 progress_log.json         # [GERADO AUTOMATICAMENTE]
    ├── 📋 archive_results.json      # [GERADO AUTOMATICAMENTE]
    └── 📈 final_report_[data].json  # [GERADO AUTOMATICAMENTE]

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
<div align="center">

<a href="https://www.npmjs.com/package/rav-archive" target="_blank"><img src="https://img.shields.io/badge/-rav--archive-c40404?style=flat-square&labelColor=c40404&logo=npm&logoColor=white&link=https://www.npmjs.com/package/rav-archive" height="40" /></a>  
 <a href="https://www.npmjs.com/package/rav-archive" target="_blank"><img alt="NPM Version" src="https://img.shields.io/npm/v/rav-archive?style=flat-square&logo=npm&labelColor=c40404&color=c40404" height="40" ></a>

---

# 🤖 Rav Archive
### ✨ Arquivamento automático com 🌐 Playwright e 🕰️ Wayback Machine 

[![⭐ Stars](https://img.shields.io/github/stars/ravenastar-js/rav-archive?style=for-the-badge&label=%E2%AD%90%20Stars&color=2d7445&logo=star&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/stargazers)
[![🔱 Forks](https://img.shields.io/github/forks/ravenastar-js/rav-archive?style=for-the-badge&label=%F0%9F%94%B1%20Forks&color=2d7445&logo=git&logoColor=white&labelColor=444&radius=10)](https://github.com/ravenastar-js/rav-archive/network/members)
[![📦 NPM Version](https://img.shields.io/npm/v/rav-archive?style=for-the-badge&label=%F0%9F%93%A6%20NPM&color=2d7445&logo=npm&logoColor=white&labelColor=444&radius=10)](https://www.npmjs.com/package/rav-archive)
[![⚙️ Node.js](https://img.shields.io/badge/%E2%9A%99%EF%B8%8F%20Node.js-16.0%2B-green?style=for-the-badge&logo=nodedotjs&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://nodejs.org)
[![🎭 Playwright](https://img.shields.io/badge/%F0%9F%8E%AD%20Playwright-1.55%2B-blue?style=for-the-badge&logo=playwright&color=2d7445&logoColor=white&labelColor=444&radius=10)](https://playwright.dev/)
[![📄 License](https://img.shields.io/badge/%F0%9F%93%84%20License-MIT-blue?style=for-the-badge&logo=opensourceinitiative&color=2d7445&logoColor=white&labelColor=444&radius=10)](LICENSE)

*Biblioteca NPM + CLI para preservação digital automática*

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

## 🎯 Visão Geral

O **RAV Archive** é uma ferramenta completa para arquivamento automático de URLs no **Internet Archive's Wayback Machine**. Funciona como **biblioteca NPM** para desenvolvedores e **CLI** para usuários finais.

### ✨ **Por que usar?**
- 🚀 **Zero configuração** - Instalação e setup automáticos
- 📦 **Dual-mode** - Use como lib ou CLI
- 🧠 **Inteligente** - Evita duplicatas e detecta limites
- 📊 **Transparente** - Relatórios detalhados em tempo real
- ⚡ **Eficiente** - Processamento em lote otimizado

---

## 📦 Instalação Rápida

<details>
<summary>📥 Como instalar o NodeJS?</summary>

- [COMO INSTALAR NODE JS NO WINDOWS?](https://youtu.be/-jft_9PlffQ)
</details>

```bash
# Como biblioteca no seu projeto
npm install rav-archive

# Como CLI global
npm install -g rav-archive

# Ou baixe direto (sem Node.js)
curl -L -o rav-archive.zip https://github.com/ravenastar-js/rav-archive/archive/refs/heads/save.zip
tar -xf rav-archive.zip && cd rav-archive
```

## 🔍 VERIFICAR INSTALAÇÃO
```bash
npm ls -g rav-archive          # ✅ Listar pacote
npm list -g rav-archive        # ✅ Completo
rav-archive --version          # ✅ Versão instalada
```

## 🗑️ DESINSTALAR GLOBALMENTE
```bash
npm un -g rav-archive          # ✅ Recomendado  
npm uninstall -g rav-archive   # ✅ Completo
npm remove -g rav-archive      # ✅ Alternativo
```

### 🛠️ **Uso Imediato**

```javascript
// Como biblioteca
const { RavArchive } = require('rav-archive');
const archive = new RavArchive();

// Arquivar URLs
await archive.archiveUrl('https://exemplo.com');
await archive.archiveFromFile('links.txt');

// Verificar status
const result = await archive.checkArchived('https://site.com');
const stats = archive.getStats();
```

```bash
# Como CLI
rav-archive file links.txt
rav-archive url https://exemplo.com
rav-archive stats
rav-archive --help
```

```batch
# Windows (batch)
iniciar.bat
```

---

## 📋 Índice Rápido

<details>
<summary><strong>🚀 Comece Aqui</strong></summary>

- [Instalação Rápida](#-começando-em-30-segundos)
- [Primeiros Passos](#-primeiros-passos)
- [Exemplos Práticos](#-exemplos-práticos)

</details>

<details>
<summary><strong>⚡ Funcionalidades</strong></summary>

- [Recursos Principais](#-recursos-principais)
- [Modos de Uso](#-modos-de-uso)
- [Resultados](#-resultados-e-relatórios)

</details>

<details>
<summary><strong>🛠️ Uso Avançado</strong></summary>

- [Como Biblioteca](#-como-biblioteca)
- [Como CLI](#-como-cli)
- [Configuração](#-configuração)

</details>

<details>
<summary><strong>📁 Estrutura</strong></summary>

- [Arquitetura](#-arquitetura)
- [Arquivos](#-estrutura-de-arquivos)

</details>

---

## 🏁 Primeiros Passos

### 1. **Prepare suas URLs**
Crie um arquivo `links.txt`:
```text
https://github.com
https://example.com
https://seu-site.com/blog
```

### 2. **Execute**
```bash
# Se instalou via NPM
rav-archive file links.txt

# Se baixou o projeto
node src/cli.js file links.txt

# Windows
iniciar.bat
```

### 3. **Acompanhe o Progresso**
- ✅ Configuração automática
- 🔍 Verificação de URLs existentes
- 📤 Arquivamento de novas URLs
- 📊 Relatório final gerado

---

## ⚡ Recursos Principais

### 🔧 **Configuração Inteligente**
- Instalação automática do Playwright
- Detecção de ambiente Node.js
- Setup completo sem intervenção

### 🧠 **Lógica Avançada**
- Verificação prévia no Wayback Machine
- Detecção de limites e rate limiting
- Retry automático em falhas
- Delays inteligentes entre requisições

### 📊 **Monitoramento Completo**
- Progresso em tempo real
- Estatísticas detalhadas
- Logs estruturados em JSON
- Relatórios em texto formatado

### 🛡️ **Robusto e Confiável**
- Tratamento de erros granular
- Timeouts configuráveis
- Conexão resiliente
- VPN-friendly

---

## 🛠️ Modos de Uso

### 📦 **Como Biblioteca**
Ideal para integrar em aplicações existentes:

```javascript
const { RavArchive } = require('rav-archive');

// Configuração customizada
const archive = new RavArchive({
    browser: { headless: true },
    wayback: { maxAttemptsPerUrl: 5 }
});

// Fluxo completo
async function arquivarSites() {
    const resultados = await archive.archiveUrls([
        'https://site1.com',
        'https://site2.com'
    ]);
    
    console.log(`✅ ${resultados.metadata.summary.archived} URLs salvas`);
    console.log(`📊 Taxa de sucesso: ${((resultados.metadata.summary.archived / resultados.metadata.summary.total) * 100).toFixed(1)}%`);
    
    // URLs com sucesso
    const urlsSalvas = archive.getArchivedUrls();
    urlsSalvas.forEach(url => {
        console.log(`🔗 ${url.originalUrl} → ${url.archiveUrl}`);
    });
}

arquivarSites();
```

### 💻 **Como CLI**
Perfeito para uso direto e automação:

```bash
# Arquivamento de arquivo
rav-archive file lista.txt

# URL única
rav-archive url https://exemplo.com

# Múltiplas URLs
rav-archive batch https://site1.com,https://site2.com,https://site3.com

# Verificação
rav-archive check https://exemplo.com

# Estatísticas
rav-archive stats

# Ajuda completa
rav-archive --help
```

---

## 📊 Resultados e Relatórios

### 🎯 **Saída em Tempo Real**
```text
📊 [5/10] https://exemplo.com
🔄 Tentativas: 1/4
📈 Progresso: 5/10 | ✅ 3 | ❌ 2 | 50.0%
⏱️  Tempo: 45s decorridos | ~45s restantes
```

### 📄 **Relatório Final**
```text
RELATÓRIO DE ARQUIVAMENTO - RAV ARCHIVE
============================================================
Data de geração: 15/12/2024 14:30:25
Total de URLs processadas: 10
URLs arquivadas com sucesso: 8
Falhas: 2
Taxa de sucesso: 80.0%
```

### 📁 **Estrutura de Saída**
```text
📁 DADOS/
└── 📄 archive_results.json    # Resultados estruturados

📁 DOCS/
└── 📄 relatorio_2024-12-15T143025Z.txt  # Relatório formatado
```

## ⚙️ Configuração

### 🔧 **Configuração Customizada**
```javascript
const archive = new RavArchive({
    browser: {
        headless: true,           // Modo headless
        timeout: 60000,           // Timeout de 60s
    },
    wayback: {
        baseDelay: 10000,         // Delay base de 10s
        maxAttemptsPerUrl: 4,     // Máximo de tentativas
        maxRetries: 2             // Retries por falha
    },
    directories: {
        data: 'DADOS',           // Pasta de dados
        docs: 'RELATORIOS'       // Pasta de relatórios
    }
});
```

### 📝 **Formato do links.txt**
```text
# URLs válidas (uma por linha)
https://exemplo.com
https://site.com/pagina
http://outro-site.com/artigo

# Evite:
exemplo.com                    # ❌ Sem protocolo
javascript:void(0)             # ❌ URL inválida
                               # ❌ Linha vazia
```

---

## 📁 Estrutura de Arquivos

```text
📁 rav-archive/
├── 📄 package.json                     # Configuração NPM
├── 📄 README.md                        # Documentação
├── 📄 LICENSE                          # Licença MIT
├── ⚡ iniciar.bat                      # Launcher Windows
├── 📝 links.txt                        # URLs exemplo
├── 🖼️ rav-archive.gif                  # Demonstração
├── 📁 src/                             # Código fonte
│   ├── 📄 index.js                     # Ponto de entrada (Lib)
│   ├── 📄 cli.js                       # Ponto de entrada (CLI)
│   ├── 📁 core/                        # Núcleo principal
│   │   ├── 📄 AutoInstaller.js         # Setup automático
│   │   ├── 📄 ConnectionManager.js     # Gerenciamento conexão
│   │   └── 📄 SmartArchiveChecker.js   # Lógica arquivamento
│   ├── 📁 commands/                    # Comandos CLI
│   │   ├── 📄 file.js                  # Arquivo → URLs
│   │   ├── 📄 url.js                   # URL única
│   │   ├── 📄 batch.js                 # Múltiplas URLs
│   │   ├── 📄 check.js                 # Verificação
│   │   └── 📄 stats.js                 # Estatísticas
│   ├── 📁 config/                      # Configurações
│   │   ├── 📄 default.js               # Config padrão
│   │   ├── 📄 colors.js                # Cores console
│   │   └── 📄 constants.js             # Constantes
│   └── 📁 utils/                       # Utilitários
│       ├── 📄 logger.js                # Logging
│       ├── 📄 validator.js             # Validação
│       └── 📄 file-manager.js          # Gerenciamento arquivos
├── 📁 DOCS/                            # [GERADO]
│   └── 📄 relatorio_[data].txt         # Relatórios
└── 📁 DADOS/                           # [GERADO]
    └── 📄 archive_results.json         # Resultados JSON
```

---

## 🏗️ Arquitetura

### 🔄 **Fluxo de Processamento**
1. **Setup** → Instala dependências automaticamente
2. **Validação** → Verifica URLs e conexão
3. **Verificação** → Checa URLs já arquivadas
4. **Arquivamento** → Processa URLs novas
5. **Relatório** → Gera resultados e estatísticas

### 🎯 **Design Patterns**
- **Modular** → Componentes independentes
- **Configurável** → Customização flexível
- **Extensível** → Fácil adição de features
- **Robusto** → Tratamento completo de erros

---

## 🐛 Troubleshooting

### ❌ **Problemas Comuns**
```bash
# Erro: Cannot find module 'playwright'
# Solução: Execute novamente (instala automaticamente)
rav-archive file links.txt

# Erro: Navigation timeout
# Solução: Verifique conexão internet
ping 8.8.8.8

# Erro: Invalid URL
# Solução: Verifique formato no links.txt
cat links.txt
```

### 🔧 **Comandos de Diagnóstico**
```bash
# Verificar instalação
node --version
npm list rav-archive

# Testar conexão
npx playwright test

# Limpar cache
npx playwright install
```

---

## 📄 Licença

Este projeto está sob licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes completos.

### ✅ **Permissões**
- Uso comercial
- Modificação
- Distribuição
- Uso privado

### 📝 **Condições**
- Atribuição obrigatória
- Incluir licença original

---

## 🙋 FAQ Rápido

<details>
<summary>📥 Preciso instalar algo manualmente?</summary>

**Não!** O RAV Archive instala todas as dependências automaticamente na primeira execução.
</details>

<details>
<summary>🌐 Posso usar com VPN?</summary>

**Sim!** É até recomendado para evitar limites de rate limiting do Wayback Machine.
</details>

<details>
<summary>📊 Quantas URLs posso processar?</summary>

**Centenas**, mas recomenda-se processar em lotes de 50-100 URLs com intervalos.
</details>

<details>
<summary>🔄 E se alguma URL falhar?</summary>

O sistema faz **até 4 tentativas** com retry automático antes de marcar como falha.
</details>

---

<div align="center">

## 💚 Desenvolvido com paixão por [RavenaStar](https://github.com/ravenastar-js)

**Preservando a web, uma URL de cada vez** 🌐

[⬆ Voltar ao topo](#-rav-archive)

</div>

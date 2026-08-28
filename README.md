# 📅 Free Time & Escala de Reuniões - Crea-Jr Núcleo Itajubá

Sistema moderno, interativo e 100% responsivo para visualização e preenchimento de **Free Time**, escala semanal no padrão de horários da **UNIFEI**, ferramenta de **Combinação de Horários (Match de Reuniões)** e **Área do Gestor protegida por PIN de 6 dígitos** para edição dos membros ativos a cada novo semestre.

---

## 🔒 Área Administrativa (Gestão de Membros & Cargos)

Como os membros e diretorias costumam mudar semestralmente, incluímos uma **Área do Gestor** protegida por senha numérica de 6 dígitos:

- **Senha Padrão Inicial**: `123456` *(Você pode alterar a senha a qualquer momento dentro do painel)*
- **Como acessar**:
  - Clique no botão **"⚙️ Editar Membros Ativos"** no cabeçalho ou na aba **Diretório de Membros**.
  - Digite a senha de 6 dígitos.
- **O que você pode fazer**:
  - ➕ **Cadastrar novos membros** (Nome, Cargo, Diretoria e Link da Foto).
  - ✏️ **Editar membros existentes** (Atualizar fotos, trocar diretorias ou cargos promovidos).
  - 🗑️ **Remover membros** que saíram da gestão.
  - 🔄 **Sincronização em Tempo Real**: Ao salvar qualquer alteração, **todo o site** (seletor de Free Time, cruzamento de reuniões, heatmap e diretório de fotos) se atualiza imediatamente!

---

## 🚀 Como Hospedar Gratuitamente no seu GitHub (GitHub Pages)

O projeto foi construído como uma aplicação web estática (`HTML5` + `CSS3` + `JavaScript Vanilla`), sem necessidade de servidores ou bancos de dados pagos.

### Passo a Passo de Publicação:

1. **Crie um repositório no seu GitHub**:
   - Acesse [github.com/new](https://github.com/new).
   - Dê um nome ao repositório (ex: `freetime-creajr-itajuba`).
   - Deixe o repositório marcado como **Public** (Público).
   - Clique em **Create repository**.

2. **Envie os arquivos para o repositório**:
   - No terminal da pasta do projeto, execute os comandos:
   ```bash
   git init
   git add .
   git commit -m "Sistema de Free Time Crea-Jr Itajubá com Gestão de Membros por PIN"
   git branch -M main
   git remote add origin https://github.com/SEU-USUARIO/freetime-creajr-itajuba.git
   git push -u origin main
   ```
   *(Ou se preferir, arraste os arquivos `index.html`, `styles.css`, `app.js`, `data.js` e `README.md` direto pelo site do GitHub na opção "Upload files")*.

3. **Ative o GitHub Pages**:
   - No seu repositório no GitHub, clique na aba **Settings** ⚙️.
   - No menu lateral esquerdo, clique em **Pages**.
   - Na seção **Build and deployment** > **Source**, selecione **Deploy from a branch**.
   - Em **Branch**, selecione a branch `main` e a pasta `/ (root)`.
   - Clique em **Save**.

4. **Pronto! 🎉**
   - Em cerca de 1 a 2 minutos, o link oficial estará disponível para compartilhar com o núcleo:
   - `https://SEU-USUARIO.github.io/freetime-creajr-itajuba/`

---

## 🎯 Principais Funcionalidades

### 1. ⏱️ Meu Free Time (Individual com Arraste e Preenchimento)
- **Arrastar e Pintar**: Clique e arraste o mouse (ou o dedo no celular) sobre a grade para marcar blocos de horários livres ou ocupados.
- **Padrão Oficial de Horários (55 min / bloco)**:
  - **Manhã**: 
    - 1: `07:00 - 07:55` (M1)
    - 2: `07:55 - 08:50` (M2)
    - 3: `08:55 - 09:45` (M3)
    - 4: `10:10 - 11:05` (M4)
    - 5: `11:05 - 12:00` (M5)
  - **Tarde**:
    - 1: `13:30 - 14:25` (T1)
    - 2: `14:25 - 15:20` (T2)
    - 3: `15:45 - 16:40` (T3)
    - 4: `16:40 - 17:35` (T4)
    - 5: `17:35 - 18:30` (T5)
  - **Noite**:
    - 1: `19:00 - 19:50` (N1)
    - 2: `19:50 - 20:40` (N2)
    - 3: `21:00 - 21:50` (N3)
    - 4: `21:50 - 22:40` (N4)
    - 5: `22:40 - 23:30` (N5)
- **Ações Rápidas**: Preencher turnos inteiros (Manhã, Tarde, Noite, Tudo) ou limpar a grade com 1 clique.
- **Contador Automático**: Exibe a quantidade de blocos e o total de horas livres na semana de cada membro.

### 2. 👥 Agendar Reunião (Match de Horários em Comum)
- Selecione 2 ou mais pessoas (ou uma diretoria inteira, ex: *Comunicação e Marketing*, *Projetos*, *Gestão de Pessoas*).
- O sistema calcula na hora a **interseção de horários livres**:
  - 🟢 **100% Livre**: Horário perfeito onde **todos** os participantes selecionados estão disponíveis simultaneamente.
  - 🟡 **75%+ Livres**: Quase todos livres (clique no horário para ver quem é a pessoa ausente).
  - 🔴 **Maioria Ocupada**.
- Painel de **Melhores Horários Sugeridos** com listagem dos blocos ideais para a reunião.

### 3. 📊 Mapa de Calor da Equipe (Heatmap)
- Visualize os momentos da semana com maior concentração de membros disponíveis no núcleo, com filtros por diretoria.

### 4. 📸 Diretório de Membros do Crea-Jr Núcleo Itajubá
- Galeria com fotos reais dos **27 membros**, cargos, diretorias e total de horas livres, com botão de edição direta.

### 5. 💾 Persistência & Backup
- **Auto-salvamento**: Todas as modificações feitas são salvas automaticamente no `localStorage` do navegador.
- **Exportar / Importar JSON**: Gere backups com 1 clique.
- **Impressão / Salvar em PDF**: Botão integrado otimizado para impressão da grade.

<div align="center">

  <img src="https://i.imgur.com/algum-link-ou-local-public/retro-blow-cartridge.gif" alt="Assoprando cartucho" width="180"/>

  <h1>🎮 Sopra Fitas</h1>

[![Vercel](https://therealsujitk-vercel-badge.vercel.app/deploy?project=assopra-fita)](https://assopra-fita.vercel.app/)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62C)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

**Plataforma web retrô para jogar clássicos no navegador**  
 Resgatando a nostalgia de assoprar fitas, com emulação, ranking, desafios mensais e perfil de usuário.

🔗 **Jogue agora (demo ao vivo):**  
 https://assopra-fita.vercel.app/

</div>

<br/>

## 📌 Sobre o Projeto

Sopra Fitas é uma aplicação web nostálgica que traz de volta a era dos consoles clássicos.  
Inspirado no ritual de **“assoprar a fita”** para fazer o jogo funcionar, o projeto combina emulação no browser, interface moderna e recursos sociais como ranking, desafios e perfis.

Funciona como um hub centralizado de jogos retrô, com foco em acessibilidade, diversão e preservação cultural (para fins educacionais).

## ✨ Funcionalidades Principais

- 🎮 Emulação direta no navegador (vários consoles clássicos)
- 🏆 Ranking global e desafios mensais com pontuação
- 👤 Perfil de usuário, apelido e jogos favoritos
- 📊 Top 5 em destaque + ver todos os rankings
- 🏪 Loja afiliada (ex: Shopee) integrada na página inicial
- 🔐 Login e autenticação via Supabase
- ⚙️ Área administrativa (gerenciamento de jogos/desafios – em desenvolvimento)

## 🛠️ Tecnologias

| Camada      | Tecnologia           | Finalidade                         |
| ----------- | -------------------- | ---------------------------------- |
| Frontend    | React + Vite         | Interface rápida e HMR instantâneo |
| Estilização | CSS puro / Tailwind? | Design retrô + responsivo          |
| Backend/DB  | Supabase             | Auth, banco de dados, storage      |
| Deploy      | Vercel               | Hospedagem gratuita e automática   |
| Qualidade   | ESLint + Prettier    | Código limpo e padronizado         |

## 📂 Estrutura de Pastas

```text
sopra-fitas/
├── public/
│   ├── capas/          # Imagens de capa dos jogos
│   └── roms/           # Arquivos de ROM (não commitados – uso local/educacional)
├── src/
│   ├── assets/         # Imagens, ícones, sons nostálgicos
│   ├── components/     # Componentes reutilizáveis (CardJogo, Ranking, etc.)
│   ├── constants/      # Listas de consoles, jogos, desafios
│   ├── pages/          # Páginas principais (Home, Login, Perfil, Jogo)
│   ├── App.jsx
│   ├── main.jsx
│   └── supabaseClient.js
├── .env.example
├── vite.config.js
└── README.md

🚀 Como Rodar Localmente

```markdown
```bash
# 1. Clone o repositório
git clone https://github.com/SEU-USUARIO/sopra-fitas.git


#### 2. Comando único com várias linhas
```markdown
```bash
npm install && npm run dev


#### 3. Comandos com flags ou opções
```markdown
```bash
# Rodar em modo preview (build + servidor)
npm run build && npm run preview

# ou com porta específica
npm run dev -- --port 3000

```

Acesse em http://localhost:5173

# ⚠️ Aviso Legal Importante
Este projeto é estritamente educacional e de preservação cultural.
As ROMs utilizadas são para fins de estudo, demonstração técnica e nostalgia pessoal.
Não hospedamos, distribuímos nem incentivamos a pirataria.
Todas as ROMs devem ser obtidas legalmente (dump de cartuchos próprios).
O uso de material protegido por direitos autorais segue as leis de fair use/preservação em vigor.

# 📄 Licença
MIT License – uso livre para fins educacionais e portfólio.
Sinta-se à vontade para fork, estudar e contribuir!
# 🤝 Contribuição
Contribuições são super bem-vindas!
Ideias boas: adicionar mais consoles, desafios semanais, suporte a save states na nuvem, tema dark retrô, etc.

1. Fork o projeto
2. Crie sua branch (git checkout -b feature/nova-funcionalidade)
3. Commit suas mudanças (git commit -m 'feat: adiciona suporte a save states')
4. Push para a branch (git push origin feature/nova-funcionalidade)
5. Abra um Pull Request

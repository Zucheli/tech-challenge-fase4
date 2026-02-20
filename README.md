# 📚 Tech Challenge - App de Posts e Usuários (React Native + Expo)

Aplicação mobile/web desenvolvida em **React Native com Expo** consumindo uma API REST.
O sistema possui autenticação e controle de permissões por perfil (**ALUNO** e **PROFESSOR**), permitindo gerenciamento de posts e usuários.

---

## 🚀 Tecnologias utilizadas

- React Native
- Expo
- TypeScript
- React Navigation
- Axios
- Context API (AuthContext)

---

## 👥 Perfis do sistema

### 👨‍🎓 ALUNO
- Visualizar lista de posts públicos
- Abrir detalhes do post

### 👨‍🏫 PROFESSOR
- Tudo que o aluno pode fazer
- Criar posts
- Editar posts
- Excluir posts
- Listar usuários
- Criar usuários
- Editar usuários
- Excluir usuários

---

## 🔐 Autenticação

O login retorna:

```
{
  token: string,
  role: "ALUNO" | "PROFESSOR"
}
```

O token é armazenado em memória pelo `AuthContext` e enviado automaticamente nas requisições.

---

## 📡 API esperada

A aplicação espera uma API rodando em:

```
http://localhost:3000
```

### Endpoints utilizados

#### Auth
- `POST /auth/login`

#### Posts
- `GET /posts` → posts públicos
- `GET /posts/all` → todos (professor)
- `GET /posts/:id`
- `POST /posts`
- `PUT /posts/:id`
- `DELETE /posts/:id`

#### Usuários
- `GET /users`
- `POST /users`
- `PUT /users/:id`
- `DELETE /users/:id`

---

## ⚙️ Instalação do projeto

### 1) Clonar repositório

```
git clone https://github.com/Zucheli/tech-challenge-fase4.git
cd tech-challenge-fase4
```

### 2) Instalar dependências

```
npm install
```

### 3) Rodar o projeto

```
npx expo start
```

---

## 🌐 Rodando no navegador

Após iniciar, acessar:

```
http://localhost:8081
```

> Certifique-se que a API esteja rodando na porta 3000

---

## 📱 Rodando no celular

1. Instalar **Expo Go**
2. Escanear QR Code

---

## 🧠 Estrutura do projeto

```
src/
 ├── contexts/
 │    └── AuthContext.tsx
 ├── screens/
 │    ├── LoginScreen.tsx
 │    ├── PostsScreen.tsx
 │    ├── PostDetailsScreen.tsx
 │    ├── CreatePostScreen.tsx
 │    ├── UsersScreen.tsx
 │    └── UserDetailsScreen.tsx
 ├── services/
 │    └── api.ts
 └── routes/
      └── app.routes.tsx
```

---

## 🧪 Testes manuais recomendados

### Professor
- Criar post
- Editar post
- Excluir post
- Criar usuário
- Editar usuário
- Excluir usuário

### Aluno
- Login
- Visualizar posts
- Abrir detalhes

---

## 🏁 Status do projeto

✔ Autenticação
✔ Controle de permissões
✔ CRUD de Posts
✔ CRUD de Usuários
✔ Compatível Web e Mobile

---

## 👨‍💻 Autor

Projeto desenvolvido para o Tech Challenge.


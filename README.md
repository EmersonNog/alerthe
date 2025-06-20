# 🔐 Atribuir Permissão de Administrador no Firebase

Este script permite atribuir permissões personalizadas (Custom Claims) para usuários autenticados no Firebase, como por exemplo, conceder acesso de **administrador** ao sistema AlerTHE.

---

## ⚙️ O que este script faz?

Define a **claim personalizada `role: "admin"`** para um usuário específico, identificando-o pelo seu **UID** no Firebase Authentication.

Essa claim será usada no frontend e nas regras do Firestore para controlar permissões e exibir funcionalidades exclusivas para administradores.

---

## 📁 Estrutura esperada

```
scripts/
├── setCustomClaim.cjs
└── serviceAccountKey.json
```

---

## 📌 Pré-requisitos

1. **Node.js instalado**
2. Ter o arquivo `serviceAccountKey.json` salvo nesta pasta:
   - Gere em: Firebase Console → ⚙️ Configurações do Projeto → Contas de Serviço → **Gerar nova chave privada**
3. Instalar dependências (apenas uma vez):

```bash
npm install firebase-admin
```

---

## ✏️ Como usar

1. **Edite o arquivo `setCustomClaim.cjs`** que esta na pasta `/scripts` na raiz do projeto e insira o UID do usuário:

```ts
const uid = "COLE_AQUI_O_UID_DO_USUÁRIO";
```

Você pode obter o UID no Firebase Console → Authentication → Coluna UID.

2. **Execute o arquivo gerado (`setCustomClaim.cjs`):**

```bash
node setCustomClaim.cjs
```

---

## ✅ Resultado esperado

Se o UID for válido, a saída será:

```
Custom claim 'admin' atribuída ao UID: AbG34xsabTeEa30rlcn3OhxW0N43
```

---

## 🔄 E agora?

Após a execução:

- O usuário terá a claim `role: "admin"` no próximo login
- O frontend reconhecerá automaticamente e mostrará os recursos de admin
- O Firestore poderá restringir acessos com base na claim

---

## 🚫 Segurança

- Este script **deve ser executado apenas por responsáveis autorizados**
- **Nunca compartilhe o arquivo `serviceAccountKey.json`**
- Adicione ao `.gitignore`:

```
scripts/serviceAccountKey.json
```

---

## 📚 Referência

- [Firebase Admin SDK - setCustomUserClaims](https://firebase.google.com/docs/auth/admin/custom-claims)
- [Regras do Firestore com Custom Claims](https://firebase.google.com/docs/rules)

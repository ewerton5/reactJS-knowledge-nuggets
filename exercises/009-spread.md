## 🚀 **Oficina Prática: O Poder do `...` (Spread & Rest)**

Olá, equipe! Hoje vamos praticar o "canivete suíço" do JavaScript. O objetivo é entender quando estamos "espalhando" (copiando/mesclando) e quando estamos "juntando" (agrupando) dados.

### **Instruções de Setup:**

1. Usem o console do navegador, um arquivo `.js` com Node, ou um ambiente React simples (CodeSandbox).
2. Foquem na sintaxe e na imutabilidade.

---

### **🍇 Exercício 1: A Salada de Frutas (Spread em Arrays) (5 minutos)**

**Objetivo:** Mesclar arrays e adicionar novos elementos sem usar `push` (imutabilidade).

**Cenário:** Temos duas listas de frutas vindas de fornecedores diferentes. Precisamos criar uma lista única para o estoque.

**Tarefa:**

1. Crie `listaA` com `['Maçã', 'Banana']`.
2. Crie `listaB` com `['Uva', 'Melancia']`.
3. Crie uma `listaFinal` que contenha:
* Todas as frutas da `listaA`.
* Uma fruta nova: `'Laranja'` (inserida no meio).
* Todas as frutas da `listaB`.



```javascript
const listaA = ['Maçã', 'Banana'];
const listaB = ['Uva', 'Melancia'];

// Como criar a listaFinal usando APENAS o spread operator?
const listaFinal = [ /* ... preencha aqui ... */ ];

console.log(listaFinal); 
// Resultado esperado: ['Maçã', 'Banana', 'Laranja', 'Uva', 'Melancia']

```

**Pontos para discussão:**

* Por que usar `[...listaA, ...listaB]` é preferível a `listaA.concat(listaB)` ou `listaA.push(...)` em contextos como Redux ou React State?

---

### **⚛️ Exercício 2: Atualização de Estado Imutável (10 minutos)**

**Objetivo:** Atualizar uma propriedade específica de um objeto de estado sem apagar as outras propriedades.

**Cenário:** Um formulário de edição de perfil de usuário.

**Tarefa:**
Complete a função `updateEmail`. Ela deve atualizar apenas o campo `email` do estado, mantendo `name`, `id` e `role` inalterados.

```javascript
// Estado inicial simulado
let userState = {
  id: 101,
  name: 'Caio',
  email: 'caio@antigo.com',
  role: 'Admin'
};

function updateEmail(newEmail) {
  // TAREFA: Retorne um NOVO objeto com o email atualizado
  // usando Spread Syntax. NÃO use userState.email = ...
  return {
    // ... seu código aqui
  };
}

const newState = updateEmail('caio@novo.com');
console.log(newState);
// Deve ter id, name, role E o novo email.

```

**Pontos para discussão:**

* A ordem importa? O que acontece se eu fizer `{ email: newEmail, ...userState }` ao invés de `{ ...userState, email: newEmail }`?

---

### **🕵️ Exercício 3: "Limpando" Objetos com Rest (10 minutos)**

**Objetivo:** Usar Rest Parameter na desestruturação para remover propriedades indesejadas (omitir dados sensíveis).

**Cenário:** Você recebeu um objeto `usuarioDoBanco` que contém o campo `senha` e `token`. Você precisa enviar esse objeto para o Frontend, mas **não pode** enviar a senha nem o token.

**Tarefa:**
Use a desestruturação com Rest (`...`) para extrair `senha` e `token` para variáveis separadas (que serão ignoradas) e agrupe todo o restante das propriedades em uma variável chamada `usuarioSeguro`.

```javascript
const usuarioDoBanco = {
  id: 1,
  username: 'admin',
  senha: '123456_senha_secreta', // Remover
  token: 'xyz-token-auth',        // Remover
  email: 'admin@empresa.com',
  avatar: 'url-da-foto'
};

// TAREFA: Use desestruturação para criar 'usuarioSeguro' sem senha e token
const { /* ... preencha aqui ... */ } = usuarioDoBanco;

console.log(usuarioSeguro); 
// Deve exibir apenas: id, username, email, avatar

```

**Pontos para discussão:**

* Essa técnica cria uma cópia do objeto ou modifica o original?

---

### **📦 Exercício 4: O Componente Repassador (React Pattern) (15 minutos)**

**Objetivo:** Criar um componente flexível que aceita props específicas e repassa todas as outras para o elemento HTML nativo.

**Cenário:** Criar um componente `<InputCustomizado />`.

1. Ele aceita uma prop `label` (para exibir um texto acima do input).
2. Ele deve aceitar **qualquer outra prop** que um `<input>` normal aceitaria (`type`, `placeholder`, `onChange`, `value`, `style`) e repassar isso automaticamente para a tag input interna.

**Tarefa:** Complete o código do componente.

```jsx
import React from 'react';

// Receba 'label' e agrupe o resto em 'propsDoInput'
function InputCustomizado({ label, /* ...rest aqui */ }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: 'block', fontWeight: 'bold' }}>
        {label}
      </label>
      
      {/* Espalhe as props restantes aqui dentro */}
      <input 
         className="meu-input-padrao"
         /* ...spread aqui */
      />
    </div>
  );
}

// Uso para teste (mental):
// <InputCustomizado 
//    label="Nome Completo" 
//    placeholder="Digite seu nome" 
//    type="text" 
// />

```

**Pontos para discussão:**

* Por que esse padrão (`...props`) é essencial para criar bibliotecas de componentes (Design Systems)?

---

### **⚠️ Exercício 5: A Armadilha da Cópia Rasa (Shallow Copy) (10 minutos)**

**Objetivo:** Demonstrar que o Spread Operator **não** faz cópia profunda (Deep Copy) de objetos aninhados.

**Tarefa:** Analise o código abaixo e responda (sem rodar primeiro) o que será impresso. Depois, rode para confirmar.

```javascript
const original = {
  nome: 'Projeto A',
  config: {
    tema: 'Escuro',
    ativo: true
  }
};

// 1. Fazemos a cópia com spread
const copia = { ...original };

// 2. Alteramos o 'nome' na cópia
copia.nome = 'Projeto B';

// 3. Alteramos o 'tema' (que está aninhado) na cópia
copia.config.tema = 'Claro';

console.log('Original - Nome:', original.nome);         // O que imprime?
console.log('Original - Tema:', original.config.tema);  // O que imprime?

```

**Pontos para discussão:**

* O `original.nome` mudou? Por que?
* O `original.config.tema` mudou? Por que?
* Como resolveríamos isso se precisássemos que a `config` também fosse independente? (Dica: `structuredClone` ou spread aninhado).

---

Bom exercício! Vamos ver quem cai na pegadinha da cópia rasa.

## 🚀 **Oficina Prática: Arquitetura Redux & Redux Saga**

Olá, equipe! Hoje vamos construir o "cérebro" da nossa aplicação. O objetivo é entender como centralizar o estado e gerenciá-lo de forma previsível.

### **Instruções de Setup:**

1. Imaginem um projeto com `@reduxjs/toolkit`, `react-redux` e `redux-saga` instalados.
2. Vamos focar na estrutura de arquivos e na lógica.

---

### **🍰 Exercício 1: A Fatia do Carrinho (createSlice) (10 minutos)**

**Objetivo:** Criar um slice para gerenciar um carrinho de compras simples.

**Cenário:** Precisamos armazenar uma lista de produtos (`items`) no estado global.

**Tarefa:** Crie o arquivo `cartSlice.ts`.

1. Defina o estado inicial com `items: []`.
2. Crie um reducer `addItem` que recebe um produto e o adiciona ao array `items`.
3. Crie um reducer `clearCart` que esvazia o array.
4. Exporte as actions e o reducer.

```typescript
// cartSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: string[]; // Simplificando: apenas nomes dos produtos
}

const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    // Escreva o reducer addItem aqui
    
    // Escreva o reducer clearCart aqui
  }
});

// O que exportar aqui?

```

**Pontos para discussão:**

* No reducer `addItem`, podemos fazer `state.items.push(action.payload)`? Isso não viola a imutabilidade do Redux? (Dica: o Redux Toolkit usa a biblioteca *Immer*).

---

### **🏪 Exercício 2: Montando a Loja (configureStore) (5 minutos)**

**Objetivo:** Configurar a Store global combinando os reducers.

**Tarefa:** Crie o arquivo `store.ts`.

1. Importe o `cartReducer` que você criou no exercício anterior.
2. Importe um hipotético `userReducer` (assuma que ele já existe).
3. Configure a store para ter duas fatias de estado: `cart` e `user`.

```typescript
// store.ts
import { configureStore } from '@reduxjs/toolkit';
// Importe os reducers

export const store = configureStore({
  reducer: {
    // Configure as chaves aqui
  },
});

```

**Pontos para discussão:**

* Se eu quiser acessar os itens do carrinho em um componente, qual será o caminho no seletor? `state.items` ou `state.cart.items`?

---

### **🔌 Exercício 3: Conectando a UI (useSelector & useDispatch) (10 minutos)**

**Objetivo:** Ler dados da store e disparar ações a partir de um componente.

**Tarefa:** Crie o componente `<CarrinhoStatus />`.

1. Use `useSelector` para exibir a quantidade de itens no carrinho (`items.length`).
2. Use `useDispatch` para obter a função `dispatch`.
3. Adicione um botão "Limpar Carrinho" que, ao ser clicado, dispara a action `clearCart`.

```tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// Importe a action necessária

export function CarrinhoStatus() {
  // 1. Selecione a contagem de itens
  const itemCount = 0; // Substitua pelo useSelector

  // 2. Obtenha o dispatch

  return (
    <div style={{ border: '1px solid #ccc', padding: 10 }}>
      <p>Itens no carrinho: {itemCount}</p>
      
      {/* 3. Adicione o botão com o dispatch */}
      <button>Limpar Carrinho</button>
    </div>
  );
}

```

**Pontos para discussão:**

* Por que não podemos chamar a função `clearCart()` diretamente no `onClick`? Por que o `dispatch()` é obrigatório?

---

### **⚡ Exercício 4: O Ciclo do Saga (Conceitual/Código) (15 minutos)**

**Objetivo:** Implementar o fluxo de uma chamada assíncrona com Redux Saga.

**Cenário:** Queremos salvar o pedido na API quando o usuário clica em "Finalizar Compra".

**Tarefa:** Complete o código da Saga.

1. **Worker:** A função `finalizarPedidoWorker` deve:
* Chamar a API `api.post('/checkout', items)` (use o effect `call`).
* Se der certo, disparar a action `checkoutSuccess` (use o effect `put`).
* Se der erro, disparar a action `checkoutFailure` (use o effect `put`).


2. **Watcher:** A função `checkoutSaga` deve ouvir a action `CHECKOUT_REQUEST` e chamar o worker.

```typescript
import { call, put, takeLatest, select } from 'redux-saga/effects';
import api from '../services/api';
// Assuma que temos essas actions
import { checkoutSuccess, checkoutFailure } from './cartSlice';

function* finalizarPedidoWorker(action) {
  try {
    // Dica: use 'select' para pegar os itens do estado se precisar, 
    // ou assuma que vieram no payload da action.
    const items = action.payload;

    // 1. Chame a API
    
    // 2. Sucesso
    
  } catch (error) {
    // 3. Falha
  }
}

export default function* checkoutSaga() {
  // Configure o watcher aqui
}

```

**Pontos para discussão:**

* Qual a diferença entre `takeEvery` e `takeLatest`? Se o usuário clicar no botão "Finalizar" 10 vezes seguidas rapidamente, qual comportamento queremos?

---

### **🧠 Exercício 5: Depuração Mental (5 minutos)**

**Objetivo:** Entender o fluxo de dados unidirecional.

**Cenário:** Um usuário relata que clicou em "Adicionar ao Carrinho", mas o número de itens na tela não mudou.

**Tarefa:** Liste, na ordem correta, os pontos que você investigaria para achar o bug.
(Ordene as opções abaixo de 1 a 4, seguindo o fluxo do Redux):

( ) Verificar se o **Reducer** está atualizando o estado corretamente.
( ) Verificar se o componente está disparando a **Action** correta no clique.
( ) Verificar se o componente está lendo o estado atualizado via **useSelector**.
( ) Verificar se a **Store** recebeu a action (via Redux DevTools).

**Pontos para discussão:**

* O Redux DevTools é uma "máquina do tempo". Como isso nos ajuda nesse cenário?

---

Bons códigos! Vamos ver quem consegue manter o estado global organizado.

### **Soluções dos exercícios: Pílula de Conhecimento 10 em Prática**

Esta série de encontros explorou o ecossistema do Redux, desde a configuração básica com Toolkit até o fluxo assíncrono avançado com Sagas e técnicas de depuração.

---

#### **Exercício 1: A Fatia do Carrinho (`createSlice`)**

**Objetivo:** Criar um slice para gerenciar um carrinho de compras simples.

**Solução em Código:**

```typescript
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState { items: string[]; }
const initialState: CartState = { items: [] };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      // Immer permite sintaxe mutável
      state.items.push(action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    }
  }
});

export const { addItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;

```

**Pontos de Discussão Detalhados:**

* **Imutabilidade e Immer:** Discutimos que, embora o código `state.push` pareça violar a imutabilidade, o Redux Toolkit usa a biblioteca **Immer** internamente. O `state` recebido é um "rascunho" (Draft), e o Immer gera um novo estado imutável seguro com base nas alterações feitas nesse rascunho.

---

#### **Exercício 2: Montando a Loja (`configureStore`)**

**Objetivo:** Configurar a Store global combinando os reducers.

**Solução em Código:**

```typescript
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer, // A chave 'cart' define o caminho no estado global
  },
});

```

**Pontos de Discussão Detalhados:**

* **Caminho do Seletor:** Foi esclarecido que o estado global reflete a estrutura definida no `configureStore`. Portanto, para acessar os itens, o caminho é `state.cart.items`, onde `cart` é a chave definida acima.

---

#### **Exercício 3: Conectando a UI (`useSelector` & `useDispatch`)**

**Objetivo:** Ler dados e disparar ações a partir de um componente.

**Solução em Código:**

```tsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearCart } from './cartSlice';

export function CarrinhoStatus() {
  const itemCount = useSelector((state: any) => state.cart.items.length);
  const dispatch = useDispatch();

  return (
    <button onClick={() => dispatch(clearCart())}>
      Limpar ({itemCount})
    </button>
  );
}

```

**Pontos de Discussão Detalhados:**

* **O papel do `dispatch`:** A analogia do "Correio" foi usada para explicar o fluxo unidirecional. A função `clearCart()` apenas cria a mensagem (Action); o `dispatch()` é o carteiro que a entrega para a Store. Sem o `dispatch`, nada acontece.
* **Fire-and-Forget:** O `dispatch` não retorna uma Promise (por padrão) e não bloqueia a execução. O componente dispara a ação e "segue a vida". A atualização da UI acontece reativamente via `useSelector` quando a Store mudar.

---

#### **Exercício 4: O Ciclo do Saga**

**Objetivo:** Implementar um fluxo assíncrono (API) usando Redux Saga.

**Solução em Código:**

```typescript
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../services/api';
// Actions hipotéticas importadas do slice
import { checkoutSuccess, checkoutFailure } from './cartSlice';

// 1. Worker: Executa a lógica
function* finalizarPedidoWorker(action) {
  try {
    const items = action.payload;
    // 'call' executa a função assíncrona
    yield call(api.post, '/checkout', items);
    // 'put' despacha a action de sucesso para o Redux
    yield put(checkoutSuccess());
  } catch (error) {
    yield put(checkoutFailure(error.message));
  }
}

// 2. Watcher: Ouve a action e chama o Worker
export default function* checkoutSaga() {
  // takeLatest: Se clicar 10x, cancela as 9 anteriores e só executa a última
  yield takeLatest('cart/checkoutRequest', finalizarPedidoWorker);
}

```

**Pontos de Discussão Detalhados:**

* **`takeLatest` vs. `takeEvery`:**
* **`takeLatest`:** Cancela a execução anterior se uma nova action do mesmo tipo for disparada. Ideal para evitar múltiplas requisições se o usuário clicar várias vezes no botão "Finalizar".
* **`takeEvery`:** Executa todas as chamadas. Ideal para logs ou ações independentes (como "Adicionar ao Carrinho"), onde cada clique importa.


* **Bloqueio de UI:** Mesmo com `takeLatest`, foi discutido que a boa prática é desabilitar o botão (`isLoading`) enquanto a requisição ocorre para evitar confusão visual.

---

#### **Exercício 5: Depuração Mental (Fluxo de Dados)**

**Objetivo:** Entender a ordem do fluxo para debugar um erro ("Cliquei e nada mudou").

**Ordem do Fluxo de Debug:**

1. **Componente:** O `onClick` disparou o `dispatch(action)`?
2. **Store/Action:** A Store recebeu a action? (Visto no Redux DevTools).
3. **Reducer:** O Reducer processou a action e gerou um novo estado? (Visto no Diff do DevTools).
4. **Selector:** O componente está selecionando o pedaço certo do estado atualizado?

**Pontos de Discussão Detalhados:**

* **A "Máquina do Tempo":** O Redux DevTools registra cada ação e o estado resultante como um *snapshot* no tempo. Isso permite ver exatamente **onde** a corrente quebrou:
* Se a action não aparece no log -> Erro no Componente/Dispatch.
* Se a action aparece mas o estado não muda -> Erro no Reducer.
* Se o estado muda mas a tela não -> Erro no Selector/React.

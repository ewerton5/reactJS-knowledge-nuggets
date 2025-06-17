###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/009-spread.md)

# 📘 Pílula de Conhecimento 10 — Redux: Gerenciamento de Estado Global

Quando uma aplicação React cresce, compartilhar estado entre componentes distantes pode se tornar um desafio. Passar props por múltiplos níveis (o famoso "prop drilling") dificulta a manutenção e a legibilidade do código. Para resolver isso, surgiram as bibliotecas de gerenciamento de estado global, e o **Redux** é, historicamente, a mais robusta e influente de todas.

O Redux propõe uma arquitetura que centraliza todo o estado da sua aplicação em um único lugar (a **Store**), tornando o fluxo de dados previsível, rastreável e mais fácil de depurar.

## 🏛️ Os Três Princípios Fundamentais do Redux

O Redux se baseia em três pilares que garantem a previsibilidade do estado:

1.  **Fonte Única da Verdade (Single Source of Truth):** Todo o estado da sua aplicação é armazenado em um único objeto dentro de uma única **Store**. Isso simplifica o acesso e o debug, pois há apenas um lugar para procurar os dados.
2.  **O Estado é Apenas para Leitura (State is Read-Only):** A única forma de alterar o estado é emitindo uma **Action**, um objeto que descreve *o que aconteceu*. Você nunca deve modificar o estado diretamente. Isso garante que a UI não mude de forma inesperada.
3.  **Mudanças são Feitas com Funções Puras (Changes are Made with Pure Functions):** Para especificar como o estado é alterado por uma action, você escreve funções puras chamadas **Reducers**. Um reducer recebe o estado anterior e uma action, e retorna um *novo* estado, seguindo o princípio da imutabilidade.

O fluxo de dados é sempre unidirecional e claro:
**UI → Dispara uma Action → Reducer calcula o novo estado → Store é atualizada → UI reflete o novo estado.**

##  toolkit Moderno com Redux Toolkit (RTK)

Antigamente, o Redux era conhecido por ser "verboso" (exigir muito código de configuração). O **Redux Toolkit (RTK)** foi criado para simplificar drasticamente esse processo, tornando-se o padrão recomendado para usar Redux hoje.

### `createSlice`: A Fatia do Estado

A principal ferramenta do RTK é a função `createSlice`. Ela permite agrupar a lógica de uma "fatia" específica do estado (como autenticação, carrinho de compras, etc.) em um único arquivo, gerando automaticamente os reducers e as actions.

**Exemplo: Uma fatia para um contador**
```ts
// src/store/slices/counterSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  value: 0,
};

const counterSlice = createSlice({
  name: 'counter', // Nome da fatia
  initialState,
  // Reducers: funções que manipulam o estado
  reducers: {
    increment: (state) => {
      // RTK usa Immer por baixo dos panos, permitindo escrever código "mutável"
      // que é convertido em uma atualização imutável.
      state.value += 1;
    },
    decrement: (state) => {
      state.value -= 1;
    },
    // Action com payload (dados extras)
    incrementByAmount: (state, action: PayloadAction<number>) => {
      state.value += action.payload;
    },
  },
});

// Exporta as actions geradas automaticamente
export const { increment, decrement, incrementByAmount } = counterSlice.actions;
// Exporta o reducer da fatia
export default counterSlice.reducer;
```

### `configureStore`: Montando a Store

A função `configureStore` simplifica a criação da store, combinando todos os reducers das suas fatias e configurando ferramentas úteis, como o Redux DevTools, automaticamente.

```ts
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './slices/counterSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    // Cada chave aqui representa uma fatia do estado global
    counter: counterReducer,
    auth: authReducer,
  },
});
```

---

## 🔗 Conectando Redux com a UI em React

Para usar a store nos seus componentes, a biblioteca `react-redux` oferece um `Provider` e alguns hooks essenciais.

* **`<Provider>`**: Envolve toda a sua aplicação, disponibilizando a store para todos os componentes aninhados.
    ```tsx
    // src/App.tsx
    import { Provider } from 'react-redux';
    import { store } from './store';

    function App() {
      return (
        <Provider store={store}>
          {/* Resto da sua aplicação */}
        </Provider>
      );
    }
    ```

* **`useDispatch`**: Hook para obter a função `dispatch`, usada para enviar as actions.
* **`useSelector`**: Hook para ler dados do estado da store.

**Exemplo de uso em um componente:**
```tsx
import { useSelector, useDispatch } from 'react-redux';
import { increment, decrement } from './store/slices/counterSlice';

function CounterComponent() {
  // Lê o valor do contador da store
  const count = useSelector((state) => state.counter.value);
  // Obtém a função dispatch
  const dispatch = useDispatch();

  return (
    <View>
      <Text>Valor: {count}</Text>
      {/* ERRO COMUM: Chamar a action diretamente `increment()` não funciona.
        É preciso envolvê-la com dispatch.
      */}
      <Button title="+1" onPress={() => dispatch(increment())} />
      <Button title="-1" onPress={() => dispatch(decrement())} />
    </View>
  );
}
```
> **Dica de Performance:** No `useSelector`, selecione apenas a parte mínima do estado que seu componente precisa. Isso evita re-renderizações desnecessárias quando outras partes do estado mudam.

---

## ⚡ Lidando com Side Effects: Redux Saga

O Redux é síncrono por padrão. Para lidar com operações assíncronas (como chamadas de API), usamos um *middleware*. O **Redux Saga** é uma biblioteca poderosa que usa **Generator Functions (`function*`)** para gerenciar side effects de forma organizada e testável.

O fluxo é o seguinte:
1.  A UI dispara uma action (ex: `fetchUserRequest`).
2.  A Saga "escuta" por essa action e executa uma função worker.
3.  O worker faz a chamada à API.
4.  Após a resposta, a Saga dispara uma nova action de sucesso (`fetchUserSuccess`) ou falha (`fetchUserFailure`) com os dados recebidos.
5.  O reducer correspondente escuta a action de sucesso/falha e atualiza a store.

**Exemplo Conceitual:**
```ts
// sagas/userSaga.ts
import { call, put, takeLatest } from 'redux-saga/effects';

// Worker: faz a chamada à API
function* fetchUser(action) {
  try {
    const user = yield call(api.fetchUser, action.payload.userId);
    yield put({ type: 'user/fetchSuccess', payload: user });
  } catch (e) {
    yield put({ type: 'user/fetchFailure', payload: e.message });
  }
}

// Watcher: escuta pela action e chama o worker
function* userSaga() {
  yield takeLatest('user/fetchRequest', fetchUser);
}
```

---

## ✅ Conclusão

Redux é uma ferramenta extremamente poderosa, ideal para aplicações grandes onde o gerenciamento de estado global se torna complexo. Embora tenha uma curva de aprendizado, sua arquitetura oferece:

* **Previsibilidade:** O fluxo de dados unidirecional torna o comportamento do estado fácil de entender.
* **Depuração Avançada:** Ferramentas como o **Redux DevTools** permitem "viajar no tempo", inspecionando cada action e a mudança de estado correspondente.
* **Escalabilidade:** A separação de responsabilidades (actions, reducers, sagas) ajuda a manter o código organizado à medida que a aplicação cresce.

Com o **Redux Toolkit**, o Redux se tornou muito mais acessível e menos verboso, consolidando-se como uma solução robusta e moderna para os desafios de estado em aplicações React complexas.

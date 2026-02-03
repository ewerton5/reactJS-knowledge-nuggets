////////////////////////////////////////////////////////////////////
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartState {
  items: string[]; // Simplificando: apenas nomes dos produtos
}

const initialState: CartState = { items: [] };

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Escreva o reducer addItem aqui
    addItem: (state, action) => state.items.push(action.payload),
    // Escreva o reducer clearCart aqui
    clearCart: () => initialState,
  },
});

////////////////////////////////////////////////////////////////////

import { configureStore } from "@reduxjs/toolkit";
import { cartSlice, userReducer } from "./foo";

export const store = configureStore({
  reducer: {
    // Configure as chaves aqui
    user: userReducer,
    cart: cartSlice,
  },
});

////////////////////////////////////////////////////////////////////

import React from "react";
import { useSelector, useDispatch } from "react-redux";
// Importe a action necessária

export function CarrinhoStatus() {
  const { cart } = useSelector((state) => state.cart);
  // 1. Selecione a contagem de itens
  const itemCount = cart.items.length; // Substitua pelo useSelector

  // 2. Obtenha o dispatch
  const dispatch = useDispatch();

  return (
    <div style={{ border: "1px solid #ccc", padding: 10 }}>
      <p>Itens no carrinho: {itemCount}</p>

      {/* 3. Adicione o botão com o dispatch */}
      <button>Limpar Carrinho</button>
    </div>
  );
}

////////////////////////////////////////////////////////////////////

import { call, put, takeLatest, select } from "redux-saga/effects";
import api from "../services/api";
// Assuma que temos essas actions
import { checkoutSuccess, checkoutFailure } from "./cartSlice";

function* finalizarPedidoWorker(action) {
  try {
    // Dica: use 'select' para pegar os itens do estado se precisar,
    // ou assuma que vieram no payload da action.
    const items = action.payload;

    // 1. Chame a API
    const response = yield call(api.post, `${api}/payment`, items);

    // 2. Sucesso
    yield put(checkoutSuccess(response.data));
  } catch (error) {
    // 3. Falha
    yield put(checkoutFailure(error));
  }
}

export default function* checkoutSaga() {
  // Configure o watcher aqui
  yield takeLatest("CHECKOUT_REQUEST", finalizarPedidoWorker);
}

////////////////////////////////////////////////////////////////////

( 1 ) Verificar se o componente está disparando a Action correta no clique.
( 2 ) Verificar se o componente está lendo o estado atualizado via useSelector.
( 3 ) Verificar se a Store recebeu a action (via Redux DevTools).
( 4 ) Verificar se o Reducer está atualizando o estado corretamente.

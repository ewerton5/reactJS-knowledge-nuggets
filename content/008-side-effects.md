###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/007-navigation.md)

# 📘 Pílula de Conhecimento 08 — Side Effects: Conectando o React ao Mundo

Até agora, falamos sobre construir interfaces e gerenciar o estado interno da aplicação. Mas como uma aplicação interage com o "mundo exterior"? A resposta está nos **Side Effects** (Efeitos Colaterais).

Um **Side Effect** é qualquer operação que afeta algo fora do escopo da função de renderização de um componente. Em termos práticos, é a forma como sua aplicação se comunica com servidores, APIs e outros serviços externos.

Os exemplos mais comuns incluem:
* Fazer requisições HTTP para buscar ou enviar dados (APIs REST, GraphQL).
* Estabelecer uma conexão em tempo real com WebSockets.
* Salvar dados no armazenamento local do dispositivo (`AsyncStorage`).
* Configurar timers (`setTimeout`, `setInterval`).

---

## 🌎 Requisições HTTP: A Ponte para os Dados

A forma mais comum de side effect é a comunicação com uma API via protocolo HTTP. Existem duas abordagens principais para isso no JavaScript: `fetch` e `axios`.

### 1. `fetch`: A Ferramenta Nativa do JavaScript

A API `fetch` é nativa dos navegadores e do React Native, não exigindo a instalação de nenhuma biblioteca. Ela é baseada em Promises e funciona muito bem com `async/await`.

**Exemplo: Requisição GET com `fetch`**
```tsx
import { useEffect, useState } from 'react';

function UserProfile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('https://api.example.com/user/1');
        if (!response.ok) { // Sempre verifique o status da resposta
          throw new Error('Falha ao buscar usuário');
        }
        const data = await response.json(); // Converte a resposta para JSON
        setUser(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  // ... renderiza o perfil do usuário
}
```

**Exemplo: Requisição POST com `fetch`**
Para enviar dados, você precisa configurar o objeto de opções com o método, cabeçalhos (`headers`) e o corpo da requisição (`body`).
```tsx
const createUser = async (userData) => {
  try {
    const response = await fetch('https://api.example.com/users', {
      method: 'POST', // Define o método HTTP
      headers: {
        'Content-Type': 'application/json', // Informa que estamos enviando JSON
        'Authorization': `Bearer ${token}` // Exemplo de token de autenticação
      },
      body: JSON.stringify(userData), // Converte o objeto JS para uma string JSON
    });
    // ...
  } catch (error) {
    // ...
  }
};
```
> **Métodos HTTP:** Usar o método correto (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) é uma convenção importante para documentar a intenção da sua requisição, tornando a API mais previsível.

### 2. `axios`: A Biblioteca Robusta

`axios` é uma biblioteca de terceiros que simplifica as requisições HTTP. Ela oferece funcionalidades poderosas que não existem nativamente no `fetch`, como:

* **Instâncias com configuração base:** Crie um cliente `axios` com uma `baseURL` e `headers` padrão.
* **Interceptors:** Execute código antes de uma requisição ser enviada ou depois que uma resposta é recebida. Perfeito para injetar tokens de autenticação ou para tratar erros de forma global.
* **Tratamento de erros padronizado.**

**Exemplo: Configurando uma instância `axios`**
```ts
// src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 5000, // Tempo limite da requisição
});

// Interceptor para adicionar o token de autenticação em todas as requisições
api.interceptors.request.use(config => {
  const token = getToken(); // Função que busca o token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

**Usando a instância criada:**
```ts
import api from '../services/api';

const fetchUsers = async () => {
  try {
    // A requisição será para 'https://api.example.com/users'
    const response = await api.get('/users');
    return response.data; // axios já converte a resposta para JSON
  } catch (error) {
    // axios fornece um objeto de erro mais detalhado
    console.error(error.response?.data);
  }
};
```

---

## 🗄️ Gerenciando Side Effects com Redux Saga

Em aplicações com estado global complexo gerenciado pelo Redux, os side effects são geralmente tratados por um *middleware*, e o **Redux Saga** é um dos mais populares para essa tarefa.

Ele usa um conceito avançado do JavaScript chamado **Generator Functions (`function*`)** para criar um fluxo de trabalho assíncrono mais fácil de testar e organizar.

* **Workers:** Funções geradoras que contêm a lógica do side effect (a chamada à API).
* **Watchers:** Funções geradoras que "escutam" por actions do Redux e disparam os workers correspondentes.
* **Effects:** Funções auxiliares (`call`, `put`, `select`) que instruem o Saga sobre qual operação executar.

**Exemplo Conceitual de uma Saga de Login:**
```ts
import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../services/api';
import { loginSuccess, loginFailure } from './authSlice';

// 1. Worker Saga: Executa a lógica assíncrona
function* handleLogin(action) {
  try {
    const { email, password } = action.payload;
    // `call` é a forma de chamar funções assíncronas em Sagas
    const response = yield call(api.post, '/login', { email, password });
    // `put` é a forma de despachar uma nova action
    yield put(loginSuccess(response.data.user));
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

// 2. Watcher Saga: Escuta pela action de login
function* authSaga() {
  // `takeLatest` garante que apenas a última requisição de login seja executada
  yield takeLatest('auth/loginRequest', handleLogin);
}

export default authSaga;
```

---

## ⚡ Comunicação em Tempo Real com WebSockets

Enquanto o HTTP segue um modelo de requisição-resposta (o cliente pede, o servidor responde), os **WebSockets** (`ws://` ou `wss://`) estabelecem uma **conexão persistente e bidirecional**. Isso permite que o servidor envie dados para o cliente em tempo real, sem que o cliente precise pedir.

É a tecnologia ideal para funcionalidades como:
* Chats em tempo real.
* Notificações instantâneas.
* Dashboards com dados que se atualizam ao vivo.

**Exemplo Conceitual com `socket.io-client`:**
```ts
import { io } from 'socket.io-client';

const socket = io('https://api.chat.com');

// Escuta por um evento 'newMessage' vindo do servidor
socket.on('newMessage', (message) => {
  console.log('Nova mensagem recebida:', message);
  // Atualiza o estado da UI com a nova mensagem
});

// Emite um evento 'sendMessage' para o servidor
const sendMessage = (messageText) => {
  socket.emit('sendMessage', { text: messageText, user: 'Caio' });
};
```

---

## ✅ Conclusão

Dominar os **Side Effects** é o que transforma uma aplicação estática em uma aplicação dinâmica e conectada.

* Para requisições **HTTP**, comece com o **`fetch`** nativo. Para projetos maiores, adote o **`axios`** por suas funcionalidades extras, como interceptors e instâncias pré-configuradas.
* Organize sua lógica de API em uma camada de **`services`** para manter o código limpo e reutilizável.
* Em aplicações complexas com **Redux**, use um middleware como o **Redux Saga** para gerenciar side effects de forma declarativa e robusta.
* Para funcionalidades de **tempo real**, utilize **WebSockets** para criar uma comunicação instantânea entre o cliente e o servidor.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/009-spread.md) 👉

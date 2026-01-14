### **Soluções dos exercícios: Pílula de Conhecimento 08 em Prática**

Esta série de encontros abordou a conexão do React com o mundo exterior. Começamos com o `fetch` nativo, evoluímos para uma arquitetura robusta com `axios` e interceptors, e finalizamos dissecando o fluxo complexo (mas poderoso) do Redux Saga para gerenciar side effects em aplicações de larga escala.

---

#### **Exercício 1: O Clássico `fetch` (GET)**

**Objetivo:** Buscar uma lista de usuários e exibi-la.

**Solução em Código:**

```jsx
import React, { useState, useEffect } from 'react';

export default function ListaDeUsuarios() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        
        // Verificação manual necessária pois fetch não rejeita 404/500
        if (!response.ok) {
          throw new Error('Erro na requisição');
        }
        
        // Conversão explícita para JSON necessária
        const data = await response.json();
        setUsers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);
  // ...
}

```

**Pontos de Discussão Aprofundados:**

* **Por que `response.json()`?**
* Você explicou que o `fetch` é uma ferramenta nativa e "básica". Ele retorna a resposta "crua" (stream de dados). O JavaScript não consegue ler esse stream diretamente como objeto; é preciso usar o método `.json()` para fazer o *parse* do corpo da resposta e transformá-lo em um objeto manipulável.


* **Tratamento de Erros (`try/catch` vs `response.ok`):**
* Ficou claro que o `try/catch` captura erros de rede (ex: sem internet).
* Porém, se a API retornar um erro **404** ou **500**, o `fetch` considera sucesso (a requisição foi e voltou). Você enfatizou que é obrigatório verificar `response.ok` manualmente para lançar o erro nesses casos.



---

#### **Exercício 2: Enviando Dados com POST**

**Objetivo:** Enviar dados de um formulário para a API.

**Solução em Código:**

```jsx
const criarPost = async () => {
  await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST', // 1. Verbo
    headers: {
      'Content-Type': 'application/json', // 2. Tipo de conteúdo
    },
    body: JSON.stringify({ title: 'Novo Post', userId: 1 }), // 3. Serialização
  });
};

```

**Pontos de Discussão Aprofundados:**

* **Os 3 Pilares da Requisição:** Você cobriu que o segundo argumento do `fetch` exige: `method` (verbo HTTP), `headers` (para avisar o back-end que estamos mandando JSON) e `body`.
* **`JSON.stringify`:** Diferente do Axios, o `fetch` não serializa automaticamente. Se passar o objeto JS direto, dá erro. É mandatório converter para string.

---

#### **Exercício 3: Arquitetura com `axios**`

**Objetivo:** Criar uma instância reutilizável.

**Solução em Código (`src/services/api.js`):**

```javascript
import axios from 'axios';

// Instância centralizada
const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
  timeout: 10000,
});

export default api;

```

**Pontos de Discussão Aprofundados:**

* **Manutenibilidade e `baseURL`:** Você destacou o cenário: "Se a API mudar de endereço amanhã, quantos arquivos você edita?". Com a instância, edita-se apenas **um** arquivo (`api.js`). Sem ela, teria que caçar e substituir URLs em centenas de arquivos.
* **Comparação Axios vs. Fetch:**
* Axios lança exceção automaticamente em erros 4xx/5xx (simplificando o `catch`).
* Axios faz o parse do JSON automaticamente (retorna em `response.data`).



---

#### **Exercício 4: Interceptors do Axios (Segurança)**

**Objetivo:** Autenticação automática e tratamento global de erros.

**Solução em Código:**

```javascript
// Interceptor de Requisição (Injeta Token)
api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem('@token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Interceptor de Resposta (Refresh Token)
api.interceptors.response.use(
  response => response,
  async error => {
    // Lógica de segurança explicada na discussão
    if (error.response?.status === 401) {
       // Tentar refresh token...
    }
    return Promise.reject(error);
  }
);

```

**Pontos de Discussão Aprofundados:**

* **Princípio DRY (Don't Repeat Yourself):** Em vez de buscar o token e adicionar o header manualmente em cada chamada (o que gera repetição e bugs), o interceptor faz isso globalmente.
* **Refresh Token (Segurança Avançada):** Você deu uma aula sobre segurança aqui:
* Se o token expirar (erro 401), o usuário não deve ser deslogado imediatamente.
* O interceptor captura o erro, usa um *refresh token* para pedir um novo token de acesso à API, atualiza o storage e **refaz a requisição original**.
* Isso acontece de forma transparente para o usuário. Você também explicou a importância de tokens de curta duração para mitigar riscos caso um token seja vazado.



---

#### **Exercício 5: O Fluxo do Redux Saga**

**Solução Conceitual (Fluxo):**

1. **Action (Trigger):** `LOGIN_REQUEST`
2. **Watcher:** Ouve e aciona a Saga.
3. **Worker:** `call(api)` -> `put(SUCCESS/FAILURE)`.

**Pontos de Discussão Aprofundados:**

* **Effects do Saga:** Você detalhou o papel de cada efeito:
* **`call`:** Para chamadas assíncronas (promessas).
* **`put`:** Para despachar actions (alterar o estado).
* **`select`:** Para ler dados do estado global.
* **`takeLatest`:** Para ouvir actions (e cancelar anteriores se necessário).
* **`all`:** Para agrupar sagas no root.


* **O "Anti-Pattern" (Crítica ao HotFlow):**
* Você mostrou o código do projeto "HotFlow" como exemplo do que **não** fazer: fazer a requisição HTTP direto no componente (View) e usar o Redux apenas como um "banco de dados" para salvar o resultado.
* Isso quebra o propósito do Saga, espalha a lógica de negócio pelas telas e torna o código difícil de testar e manter.
* Mencionou também o perigo de manipulação direta de arrays/estado (mutabilidade) que foi visto no código legado.


* **Verbosidade vs. Poder:** Você reconheceu que Redux Saga é verboso (requer Actions de Request, Success, Failure), o que afasta muitos devs hoje em dia (que preferem React Query ou Zustand). No entanto, reforçou que o Redux oferece **"Capability"** (capacidade profissional): saber dominar essa ferramenta complexa é um diferencial de mercado e permite controle total sobre fluxos complexos de *side effects*.

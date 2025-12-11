## 🚀 **Oficina Prática: Dominando Side Effects e APIs**

Olá, equipe\! A pílula de hoje nos conectou com o "mundo exterior". Agora, vamos praticar como buscar, enviar e gerenciar dados de APIs de forma profissional.

### **Instruções de Setup:**

1.  Usem um ambiente React ou React Native (CodeSandbox, StackBlitz ou local).
2.  Para os exercícios de API, vamos usar a **JSONPlaceholder** (`https://jsonplaceholder.typicode.com`), uma API pública gratuita para testes.

-----

### **🌎 Exercício 1: O Clássico `fetch` (10 minutos)**

**Objetivo:** Fazer uma requisição GET básica usando a API nativa `fetch` e exibir os dados.

**Tarefa:** Crie um componente `ListaDeUsuarios`.

1.  Use `useEffect` para buscar a lista de usuários da URL: `https://jsonplaceholder.typicode.com/users`.
2.  Armazene os dados em um estado `users`.
3.  Lide com o estado de carregamento (`isLoading`) e exiba "Carregando..." enquanto os dados não chegam.
4.  Renderize uma lista simples (`<ul>` ou `<FlatList>`) exibindo o **nome** e o **email** de cada usuário.

<!-- end list -->

```jsx
// Dica de estrutura
const [users, setUsers] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  // Implemente o fetch aqui
}, []);
```

**Pontos para discussão:**

  * Por que precisamos converter a resposta com `response.json()` ao usar `fetch`?
  * O que acontece se a URL estiver errada? Como você trataria esse erro no `fetch`? (Dica: `try/catch` e verificação de `response.ok`).

-----

### **✉️ Exercício 2: Enviando Dados com POST (10 minutos)**

**Objetivo:** Aprender a configurar uma requisição POST com `fetch` para enviar dados.

**Tarefa:** Crie um componente `NovoPost`.

1.  Crie um formulário simples com campos para `titulo` e `corpo` (body).
2.  Ao clicar em "Enviar", faça uma requisição POST para `https://jsonplaceholder.typicode.com/posts`.
3.  O corpo da requisição deve ser um JSON contendo os dados do formulário e um `userId: 1`.
4.  Exiba um `alert` ou mensagem na tela com o ID do novo post retornado pela API (a JSONPlaceholder simula a criação e retorna o novo objeto com ID).

**Pontos para discussão:**

  * Quais são as 3 propriedades essenciais que precisamos passar no segundo argumento do `fetch` para um POST com JSON? (`method`, `headers`, `body`).
  * Por que precisamos fazer `JSON.stringify(data)` no body?

-----

### **🛠️ Exercício 3: Arquitetura com `axios` (15 minutos)**

**Objetivo:** Criar uma instância de `axios` reutilizável, simulando uma estrutura profissional de `services`.

**Tarefa:**

1.  **Crie um arquivo `api.js` (ou `services/api.ts`):**
      * Importe `axios`.
      * Crie uma instância com `axios.create()`.
      * Defina a `baseURL` como `https://jsonplaceholder.typicode.com`.
      * Exporte essa instância.
2.  **Use a instância:**
      * Refatore (ou crie um novo) componente `ListaDePosts`.
      * Use a instância `api` que você criou para buscar os posts (`/posts`).
      * Note como a sintaxe muda em relação ao `fetch` (não precisa de `.json()`).

**Pontos para discussão:**

  * Qual a vantagem de definir uma `baseURL`? Se a API mudar de endereço amanhã, quantos arquivos você precisa editar?
  * O `axios` lança erros automaticamente para status code 400/500? Como isso se compara ao `fetch`?

-----

### **🧠 Exercício 4: Interceptors do Axios (Mental ou Prático) (10 minutos)**

**Objetivo:** Entender o poder dos interceptors para lógica global.

**Cenário:** Imagine que sua API agora exige um token de autenticação em todas as rotas.

**Tarefa:**
Adicione um interceptor à sua instância `api` (no arquivo do Exercício 3) que injete automaticamente um header `Authorization`.

```javascript
// Simulação de um token
const token = "meu-token-secreto-123";

api.interceptors.request.use(config => {
  // Como adicionar o header Authorization aqui?
  return config;
});
```

**Pontos para discussão:**

  * Por que usar um interceptor é melhor do que adicionar o header manualmente em cada chamada `api.get` ou `api.post`?
  * Cite outro caso de uso comum para interceptors (Dica: resposta/erro global, como redirecionar para login se der erro 401).

-----

### **🗄️ Exercício 5: O Fluxo do Redux Saga (Mental) (10 minutos)**

**Objetivo:** Compreender o papel de cada peça no Redux Saga (Action, Watcher, Worker).

**Cenário:** Você tem um botão "Login".

**Tarefa:** Descreva o fluxo passo-a-passo (não precisa codar tudo, apenas a lógica):

1.  **UI:** O usuário clica em "Login". Que tipo de Action o componente dispara? (ex: `LOGIN_REQUEST`).
2.  **Saga Watcher:** O que ele está "ouvindo"? O que ele faz quando ouve essa action?
3.  **Saga Worker:** O que essa função faz?
      * Qual Effect (`call`, `put`) ela usa para chamar a API?
      * Qual Effect ela usa para salvar os dados no Redux se der certo? (`LOGIN_SUCCESS`).
      * Qual Effect ela usa se der erro? (`LOGIN_FAILURE`).

**Pontos para discussão:**

  * O que são `Effects` no Saga?
  * Por que separar a lógica assíncrona (API) da lógica de atualização de estado (Reducer) é uma boa prática em apps complexos?

-----

Bons códigos\! Vamos ver quem domina a comunicação com o mundo.

## 🚀 **Oficina Prática: Construindo UIs Dinâmicas com Renderização Condicional**

Olá, equipe! A pílula de hoje nos mostrou as ferramentas para fazer nossas interfaces reagirem a diferentes estados e dados. Os exercícios abaixo nos ajudarão a praticar cada técnica e a entender quando usar cada uma delas para escrever um código limpo e seguro.

### **Instruções de Setup:**

1.  Abra um ambiente de desenvolvimento React (CodeSandbox, StackBlitz ou seu projeto local).
2.  Para cada exercício, crie um novo componente (ex: `Exercicio1.js`) e importe-o no seu `App.js` para visualizá-lo.

---

### **✅ Exercício 1: A Estrutura Principal com `if / else` (10 minutos)**

**Objetivo:** Praticar o uso da declaração `if / else` para renderizar componentes inteiros de forma diferente com base em uma condição.

**Tarefa:** Crie um componente `SistemaDeAutenticacao`.
1.  Este componente deve receber uma prop booleana chamada `isLoggedIn`.
2.  **Fora do `return`**, use uma estrutura `if / else` para verificar o valor de `isLoggedIn`.
3.  Se `isLoggedIn` for `true`, o componente deve retornar um componente simples `<PainelDeUsuario />` (pode ser uma `div` com uma mensagem "Bem-vindo(a) de volta!" e um botão de "Sair").
4.  Se `isLoggedIn` for `false`, ele deve retornar um componente `<TelaDeLogin />` (uma `div` com a mensagem "Por favor, faça o login." e um botão de "Entrar").
5.  No seu `App.js`, teste renderizar `<SistemaDeAutenticacao />` passando tanto `true` quanto `false` para a prop `isLoggedIn` e veja o resultado.

**Pontos para discussão:**
* Por que a estrutura `if / else` é ideal para este cenário, em vez de tentar usar um ternário dentro do JSX?
* A declaração `if / else` é um "statement" ou uma "expression" em JavaScript? Por que isso nos impede de usá-la diretamente dentro das chaves `{}` no JSX?

---

### **🔁 Exercício 2: Alternância Rápida com Operador Ternário (10 minutos)**

**Objetivo:** Usar o operador ternário (`? :`) para alternar elementos de forma concisa diretamente dentro do JSX.

**Tarefa:** Crie um componente `BotaoDeTema`.
1.  Use `useState` para gerenciar um estado chamado `isDarkMode` (inicialize como `false`).
2.  Renderize um único `<button>` que, ao ser clicado, inverte o valor de `isDarkMode`.
3.  **Dentro do botão**, use um operador ternário para exibir o texto "Ativar Modo Escuro" se `isDarkMode` for `false`, e "Ativar Modo Claro" se for `true`.
4.  **Desafio Bônus:** Use outro operador ternário na prop `style` do botão para alterar a cor de fundo (`backgroundColor`) com base no estado `isDarkMode`.

**Pontos para discussão:**
* Compare este uso com o do `if / else`. Por que o ternário é mais elegante e apropriado aqui?
* Em que situações aninhar operadores ternários pode se tornar uma má prática?

---

### **⚠️ Exercício 3: Mostrando e Ocultando com `&&` (e a Armadilha do Zero) (10 minutos)**

**Objetivo:** Praticar o uso do operador `&&` para renderizar um elemento e vivenciar na prática o bug comum com o valor `0`.

**Tarefa:** Crie um componente `ContadorDeCarrinho`.
1.  Use `useState` para gerenciar uma contagem de itens, chamada `itemCount` (inicialize com `0`).
2.  Crie dois botões: um para "Adicionar Item" (incrementa `itemCount`) e outro para "Remover Item" (decrementa `itemCount`).
3.  Use o operador lógico `&&` para renderizar uma mensagem, como `<p>Você tem itens no seu carrinho!</p>`, somente quando houver itens. A lógica deve ser: `itemCount && <p>...</p>`.
4.  Observe atentamente o que é renderizado na tela quando `itemCount` é exatamente `0`.

**Pontos para discussão:**
* O que você vê na tela quando a contagem é `0`? Por que isso acontece?
* Qual é o comportamento de "curto-circuito" do JavaScript que causa esse resultado?
* Lembrando da pílula, por que esse mesmo código causaria um erro fatal que quebraria a aplicação em React Native?

---

### **🛑 Exercício 4: A Solução Definitiva para o `&&` (10 minutos)**

**Objetivo:** Aplicar a solução correta para usar o operador `&&` de forma segura, evitando o bug dos valores "falsy".

**Tarefa:** Crie um componente `ListaDeTarefas`.
1.  Use `useState` para gerenciar uma lista de tarefas, `const [tasks, setTasks] = useState([])`.
2.  Crie um botão "Adicionar Tarefa" que adiciona uma nova string ao array `tasks`.
3.  Use o operador lógico `&&` para renderizar um título `<h2>Suas Tarefas</h2>` somente se o array de tarefas **não estiver vazio**.
4.  **Implemente a condição de forma segura**, usando uma das duas abordagens recomendadas na pílula:
    * **Opção 1 (preferencial):** `tasks.length > 0 && <h2>...</h2>`
    * **Opção 2:** `!!tasks.length && <h2>...</h2>`

**Pontos para discussão:**
* Compare a condição `tasks.length > 0` com a `itemCount` do exercício anterior. Por que a primeira é segura e a segunda não?
* O que o operador de dupla negação (`!!`) faz exatamente? Em que cenários ele pode ser útil?

---

### **🧠 Exercício Final: O Painel de Controle (Colocando Tudo Junto)**

**Objetivo:** Combinar as três técnicas de renderização condicional em um único componente mais realista.

**Tarefa:** Crie um componente `PainelDeControle`.
1.  Gerencie três estados com `useState`:
    * `isLoading` (booleano, comece como `true`).
    * `userData` (um objeto como `{ name: 'Alice', isAdmin: true }` ou `null`, comece como `null`).
    * `error` (uma string ou `null`, comece como `null`).
2.  Simule uma "busca de dados": use um `setTimeout` dentro de um `useEffect` para, após 2 segundos, definir `isLoading` para `false` e popular o `userData`.
3.  Implemente a seguinte lógica de renderização:
    * **Use `if / else`:**
        * Se `isLoading` for `true`, retorne um componente `<p>Carregando...</p>`.
        * Se `error` tiver um valor, retorne `<p>Erro: {error}</p>`.
        * Caso contrário, renderize o painel principal.
    * **Dentro do painel principal, use um operador ternário:** Exiba o nome do usuário se `userData.name` existir. Caso contrário, exiba "Visitante".
    * **Ainda no painel, use o operador `&&` (de forma segura!):** Exiba um pequeno `<span>` ou `<div>` com o texto "[Admin]" somente se `userData.isAdmin` for `true`.

**Pontos para discussão:**
* Vamos analisar a estrutura do `PainelDeControle`. Por que `if / else` foi a melhor escolha para os estados de carregamento e erro?
* Por que o ternário se encaixou bem para exibir o nome do usuário?
* Por que o `&&` foi a ferramenta perfeita para o selo de "Admin"?

👉 [Clique aqui para ver as soluções dos exercícios](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/solutions/003-conditional-rendering.md)

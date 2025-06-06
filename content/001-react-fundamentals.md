## 📘 **Pílula de Conhecimento 01 – Fundamentos de React: Virtual DOM, JSX e React Hooks**

### 🔹 **1. Conceitos Fundamentais**

#### 🧠 Virtual DOM

O **Virtual DOM** (DOM Virtual) é uma representação leve e em memória da árvore real de elementos da interface. Quando o estado de um componente muda:

* O React cria uma nova versão do Virtual DOM.
* Compara com a versão anterior usando um algoritmo de "diffing".
* Atualiza **apenas as partes necessárias** do DOM real, minimizando re-renderizações e melhorando a performance.

#### 💻 JSX (JavaScript XML)

JSX é uma **sintaxe de extensão do JavaScript** que permite escrever estruturas HTML dentro do código JavaScript:

```jsx
const element = <h1>Hello, world!</h1>;
```

JSX é convertido em chamadas para `React.createElement()`, gerando objetos que o React usa para construir o DOM virtual.

---

### 🔹 **2. React Hooks**

React Hooks foram introduzidos no React 16.8 para permitir o uso de **estado e ciclos de vida** em componentes funcionais.

---

#### ⚙️ useState

Permite adicionar estado a componentes funcionais:

```jsx
const [count, setCount] = useState(0);
```

* `count` é o valor atual do estado.
* `setCount` é a função usada para atualizá-lo.
* Atualizações no estado causam um novo render.

---

#### ⚙️ useEffect

Hook para lidar com **efeitos colaterais**, como chamadas de API, manipulação do DOM ou subscrições.

**Sintaxe básica:**

```jsx
useEffect(() => {
  // efeito
  return () => {
    // cleanup (executado na desmontagem ou antes do próximo efeito)
  };
}, [dependências]);
```

**Comportamentos com o array de dependências:**

* `[]` (vazio): Executa **apenas uma vez**, na **montagem** do componente (equivalente a `componentDidMount`).
* Omissão do array: Executa **a cada renderização** (raro e normalmente não recomendado).
* Com dependências (`[var1, var2]`): Executa na montagem e **sempre que uma das dependências mudar**.
* Cleanup: Executado na **desmontagem** (como `componentWillUnmount`) ou **antes de reexecutar o efeito**.

**⚠️ Cuidado:** Colocar variáveis que são atualizadas dentro do `useEffect` no array de dependências pode causar **loops infinitos**, se a atualização gerar nova mudança de dependência.

---

#### ⚙️ useCallback

Hook para memoizar **funções**, evitando que elas sejam recriadas em cada render:

```jsx
const memoizedFn = useCallback(() => {
  // função
}, [dependências]);
```

* A função só será recriada se alguma dependência mudar.
* Útil para performance, especialmente em componentes que recebem funções como props (ex: listas como `FlatList`, `ScrollView`, etc.).

---

#### ⚙️ useMemo

Memoiza **valores computados**, evitando recalcular em cada render:

```jsx
const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b]);
```

* Recalcula **apenas quando** uma das dependências muda.
* Útil para **operações pesadas**, como cálculos complexos ou filtragens.

⚠️ Assim como no `useEffect`, mudanças dentro do `useMemo` que afetam suas dependências podem causar loops se não forem controladas.

---

### 🔹 **3. Hooks vs Métodos Legados de Ciclo de Vida**

| Método Legado          | Equivalente com Hooks                                   |
| ---------------------- | ------------------------------------------------------- |
| `componentDidMount`    | `useEffect(() => {}, [])`                               |
| `componentDidUpdate`   | `useEffect(() => {}, [deps])`                           |
| `componentWillUnmount` | `useEffect(() => { return () => {/* cleanup */} }, [])` |

* Hooks são **mais granulares** e reutilizáveis.
* Não há `componentWillMount` no React desde 17+, pois sua execução antecipada trazia problemas de consistência (ele foi de fato **deprecated**).
* Em Hooks, tudo é feito **dentro da função do componente**, tornando o fluxo mais previsível e funcional.

---

### 📌 Conclusão

Essa introdução cobre os fundamentos essenciais para trabalhar com React moderno:

* O Virtual DOM proporciona performance.
* JSX facilita a escrita da UI.
* Hooks substituem a complexidade dos métodos de ciclo de vida em componentes de classe, tornando o código mais limpo e modular.

Essa pílula serve como base para quem está começando e também como revisão para quem já tem alguma experiência com React.

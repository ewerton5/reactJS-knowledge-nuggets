###### 👈 [Voltar ao início](https://github.com/ewerton5/reactJS-knowledge-nuggets)

# 📘 **Pílula de Conhecimento 01 – Fundamentos de React: Virtual DOM, JSX e React Hooks**

Bem-vindo à primeira pílula de conhecimento! Nela, vamos explorar os pilares do React, a biblioteca que revolucionou o desenvolvimento de interfaces de usuário. Entender esses conceitos é essencial para construir aplicações modernas, performáticas e escaláveis.

## 🔹 **1. Conceitos Fundamentais**

Antes de mergulhar nos Hooks, é crucial compreender duas tecnologias que formam a base do React: o Virtual DOM e o JSX.

### 🧠 Virtual DOM

O **Virtual DOM** (DOM Virtual) é a principal estratégia de performance do React. Em vez de manipular diretamente o DOM do navegador (uma operação lenta e custosa), o React trabalha com uma cópia leve em memória.

Quando o estado de um componente muda, o processo é o seguinte:

1.  O React cria uma nova versão do Virtual DOM com os dados atualizados.
2.  Essa nova versão é comparada com a anterior usando um algoritmo de diferenciação eficiente chamado **"diffing"**.
3.  Com base nessa comparação, o React identifica exatamente o que mudou e atualiza **apenas os elementos necessários** no DOM real.

Essa abordagem minimiza as manipulações diretas no navegador, resultando em uma aplicação muito mais rápida e responsiva.

### 💻 JSX (JavaScript XML)

O JSX é uma **extensão de sintaxe para o JavaScript** que nos permite escrever estruturas semelhantes a HTML diretamente no código. Ele une a lógica de programação à marcação da interface de forma declarativa e legível.

```jsx
// Isso é JSX: declarativo e familiar
const element = <h1>Olá, mundo!</h1>;
```

O navegador não entende JSX. Durante o processo de compilação (transpilação), o código acima é convertido para chamadas de função `React.createElement()`, que por sua vez criam os objetos que o React usa para construir o Virtual DOM.

```js
// Código JS equivalente gerado pelo compilador
const element = React.createElement('h1', null, 'Olá, mundo!');
```

---

## 🔹 **2. React Hooks**

Introduzidos no React 16.8, os **Hooks** foram um divisor de águas. Eles permitem que componentes de função (a forma moderna de escrever componentes) utilizem estado, ciclo de vida e outras funcionalidades do React que antes eram exclusivas de componentes de classe.

### ⚙️ useState

O `useState` é o Hook fundamental para adicionar e gerenciar **estado** em um componente funcional.

```jsx
import { useState } from 'react';

const [count, setCount] = useState(0);
```

* `count`: É a variável que armazena o valor atual do estado (neste caso, `0`).
* `setCount`: É a função que usamos para atualizar o valor de `count`.
* **Importante:** Chamar a função `setCount` não só altera o valor, mas também **agenda uma nova renderização** do componente para refletir a mudança na UI.

---

### ⚙️ useEffect

O `useEffect` é o Hook para gerenciar **efeitos colaterais** (*side effects*). Efeitos colaterais são quaisquer operações que interagem com o mundo fora do fluxo de renderização do React, como:

* Busca de dados em uma API.
* Manipulação manual do DOM.
* Adicionar ou remover `event listeners`.
* Subscrições (como em um chat em tempo real).

**Sintaxe básica:**

```jsx
useEffect(() => {
  // 1. O código do efeito é executado aqui.
  console.log('O componente foi montado ou atualizado.');

  // 2. A função de limpeza (cleanup) é opcional.
  return () => {
    // Executada quando o componente vai ser desmontado ou antes do próximo efeito.
    console.log('Limpando o efeito anterior...');
  };
}, [dependências]); // 3. O array de dependências controla quando o efeito roda.
```

**Comportamentos com o array de dependências:**

* `[]` (array vazio): O efeito executa **apenas uma vez**, após a primeira renderização (montagem do componente). Ideal para buscar dados iniciais. Equivalente ao `componentDidMount`.
* **Omissão do array**: O efeito executa **a cada renderização**. Use com muito cuidado, pois pode levar a problemas de performance.
* Com dependências (`[var1, var2]`): O efeito executa na montagem e **sempre que o valor de uma das dependências mudar**. Equivalente ao `componentDidUpdate`.
* **Função de Cleanup**: É executada para "limpar" o efeito anterior antes de uma nova execução ou quando o componente é desmontado (`componentWillUnmount`). Essencial para evitar vazamentos de memória (ex: remover `event listeners`).

⚠️ **Cuidado:** Se você atualiza um estado dentro de um `useEffect`, certifique-se de que a variável de estado não esteja no array de dependências de uma forma que crie um **loop infinito** (efeito -> atualiza estado -> dependência muda -> efeito roda de novo).

---

### ⚙️ useCallback

O `useCallback` é um Hook de otimização de performance. Ele **memoiza uma função**, ou seja, retorna uma versão em cache da função que só é recriada se uma de suas dependências mudar.

```jsx
const memoizedFn = useCallback(() => {
  // Lógica da função
  doSomething(a, b);
}, [a, b]);
```

**Por que usar?** Em JavaScript, funções são recriadas a cada renderização. Se você passa uma função como `prop` para um componente filho otimizado (com `React.memo`), o filho irá re-renderizar desnecessariamente, pois a `prop` da função é sempre "nova". `useCallback` evita isso.

---

### ⚙️ useMemo

Similar ao `useCallback`, o `useMemo` também é um Hook de otimização, mas ele memoiza **o resultado de uma função (um valor computado)**, em vez da função em si.

```jsx
const memoizedValue = useMemo(() => expensiveCalculation(a, b), [a, b]);
```

Ele executa a função e armazena seu resultado. Em renderizações futuras, ele só irá re-executar a função se uma das dependências (`[a, b]`) tiver mudado. Caso contrário, ele retorna o valor armazenado.

**Quando usar?** Ideal para **cálculos computacionalmente caros** (ex: filtrar/ordenar uma lista grande) que você não quer repetir a cada renderização.

---

## 🔹 **3. Hooks vs Métodos Legados de Ciclo de Vida**

A tabela abaixo mostra a correspondência entre os métodos de ciclo de vida de componentes de classe e suas alternativas com Hooks, que são mais flexíveis e intuitivas.

| Método Legado de Classe | Equivalente com Hooks                                      |
| ----------------------- | ---------------------------------------------------------- |
| `componentDidMount`     | `useEffect(() => { ... }, [])`                             |
| `componentDidUpdate`    | `useEffect(() => { ... }, [deps])`                         |
| `componentWillUnmount`  | `useEffect(() => { return () => { /* cleanup */ } }, [])`  |

* Com Hooks, a lógica relacionada a um mesmo efeito (ex: subscrição e limpeza) fica **agrupada no mesmo `useEffect`**, em vez de espalhada por diferentes métodos de ciclo de vida.
* Não há um equivalente direto para `componentWillMount` em Hooks, pois seu uso era problemático e foi descontinuado (`deprecated`) no React moderno.

---

## 📌 Conclusão

Dominar estes três pilares é o primeiro grande passo para se tornar proficiente em React:

* O **Virtual DOM** é o segredo da performance.
* O **JSX** torna a criação de UI declarativa e agradável.
* Os **Hooks** oferecem um modelo poderoso e simplificado para gerenciar estado e efeitos colaterais em componentes funcionais.

Esta pílula serve como uma base sólida, seja para quem está começando sua jornada com React ou para quem deseja consolidar seus conhecimentos fundamentais.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/002-controlled-vs-uncontrolled.md) 👉

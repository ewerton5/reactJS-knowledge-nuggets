## 🚀 **Oficina Prática: Fundamentos de React na Ação**

Olá, equipe\! Para colocarmos em prática o que vimos em nossa primeira Pílula de Conhecimento, vamos sujar as mãos com os exercícios abaixo. O objetivo não é só "fazer funcionar", mas entender os motivos por trás de cada implementação e nos prepararmos para a nossa discussão.

### **Instruções de Setup:**

1.  Abra um editor de código online como o [CodeSandbox](https://codesandbox.io/s/react-new) ou o [StackBlitz](https://stackblitz.com/edit/react-ts).
2.  Crie um novo projeto React.
3.  Para cada exercício, crie um novo componente (ex: `Exercicio1.js`, `Exercicio2.js`) e importe-o no seu arquivo `App.js` principal para visualizar o resultado.

-----

### **🧠 Exercício 1: JSX e Componentes – A Base (5 minutos)**

**Objetivo:** Praticar a criação de um componente básico e o uso de JSX para renderizar informações dinâmicas.

**Tarefa:**
Crie um componente funcional chamado `CardDeUsuario`. Este componente deve:

1.  Receber um objeto chamado `user` via props. O objeto deve ter as propriedades: `nome`, `urlAvatar` e `bio`.
2.  Renderizar o nome do usuário em uma tag `<h2>`.
3.  Renderizar o avatar do usuário em uma tag `<img>`.
4.  Renderizar a biografia do usuário em um parágrafo `<p>`.

**No `App.js`, utilize seu componente da seguinte forma:**

```jsx
// App.js
import React from 'react';
import CardDeUsuario from './CardDeUsuario';

export default function App() {
  const dadosDoUsuario = {
    nome: 'Ada Lovelace',
    urlAvatar: 'https://www.revistaplaneta.com.br/wp-content/uploads/2021/03/ada-lovelace-1.jpg',
    bio: 'Pioneira da programação, previu o potencial dos computadores além de meros cálculos.'
  };

  return (
    <div>
      <h1>Cards de Perfil da Equipe</h1>
      <CardDeUsuario user={dadosDoUsuario} />
    </div>
  );
}
```

**Pontos para discussão:**

  * Qual a diferença entre usar `{}` e `()` no JSX?
  * Por que passamos `user` como uma prop? O que é o "fluxo de dados unidirecional"?

-----

### **⚙️ Exercício 2: Gerenciamento de Estado com `useState` (10 minutos)**

**Objetivo:** Entender como adicionar e modificar o estado de um componente.

**Tarefa:**
Crie um componente chamado `ContadorSimples`. Este componente precisa:

1.  Inicializar uma variável de estado chamada `contagem` com o valor inicial `0`.
2.  Exibir o valor atual de `contagem`.
3.  Ter três botões:
      * Um para incrementar a contagem em 1.
      * Um para decrementar a contagem em 1.
      * Um para resetar a contagem para `0`.

**Desafio Bônus:** Adicione uma regra para que o contador não possa ficar abaixo de zero.

```jsx
// Resultado esperado:
// Um número na tela e três botões que manipulam esse número.
```

**Pontos para discussão:**

  * O que realmente acontece quando chamamos `setContagem()`?
  * Por que não podemos simplesmente fazer `contagem = contagem + 1`? O que é o conceito de imutabilidade?
  * O que dispara a nova renderização do componente?

-----

### **🔄 Exercício 3: Efeitos Colaterais com `useEffect` (15 minutos)**

**Objetivo:** Aprender a lidar com efeitos colaterais, como busca de dados e limpeza de recursos.

#### **Parte A: Busca de Dados na Montagem**

**Tarefa:**
Crie um componente chamado `BuscadorDePost`. Este componente irá simular a busca de um post de blog de uma API quando ele for montado.

1.  Crie um estado para `post` (valor inicial `null`) e outro para `carregando` (valor inicial `true`).

2.  Use um `useEffect` para simular uma chamada de API após o componente montar. Você pode usar a função abaixo para simular o atraso:

    ```javascript
    const chamadaApiFalsa = () => new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          titulo: 'Meu Primeiro Post',
          conteudo: 'Este é o conteúdo do post buscado de uma API super veloz!'
        });
      }, 2000); // Atraso de 2 segundos
    });
    ```

3.  Dentro do `useEffect`, chame essa função. Quando os dados chegarem, atualize o estado de `post` e defina `carregando` como `false`.

4.  Enquanto `carregando` for `true`, exiba uma mensagem como "Carregando post...".

5.  Quando os dados forem carregados, exiba o título e o conteúdo do post.

**Pontos para discussão:**

  * Por que usamos um array de dependências vazio `[]` neste `useEffect`?
  * O que aconteceria se omitíssemos o array de dependências? (Pode testar\!)

#### **Parte B: Limpeza (Cleanup)**

**Tarefa:**
Crie um componente chamado `RastreadorDeJanela`.

1.  Use `useEffect` para adicionar um `event listener` ao objeto `window` para o evento `resize`.
2.  Crie um estado que armazena a largura atual da janela.
3.  Quando o evento for disparado, atualize o estado com o novo `window.innerWidth`.
4.  Exiba a largura atual da janela na tela: `Largura da janela: [largura]px`.
5.  **Crucial:** Implemente a função de limpeza (cleanup) dentro do `useEffect` para remover o `event listener` quando o componente for desmontado.

**Para testar a limpeza:** No `App.js`, adicione um botão que renderiza condicionalmente o componente `RastreadorDeJanela`. Monte e desmonte-o e verifique no console se não aparecem erros de vazamento de memória.

**Pontos para discussão:**

  * Por que a função de cleanup é tão importante neste caso? O que é um "memory leak"?
  * Quando exatamente a função de cleanup é executada?

-----

### **⚡ Exercício 4: Otimização de Performance com `useMemo` e `useCallback` (20 minutos)**

**Objetivo:** Entender quando e por que usar esses hooks de otimização.

**Tarefa:**
Crie um componente chamado `FiltroDeDados`. Este componente terá uma lista grande de itens e permitirá que o usuário a filtre.

1.  Crie um estado para uma lista longa de itens. Você pode gerá-la assim:

    ```javascript
    const todosOsItens = Array.from({ length: 10000 }, (_, index) => `Item #${index + 1}`);
    ```

2.  Crie um estado para um `termoDeFiltro`, que será atualizado por um campo `<input>`.

3.  **O cálculo caro:** Exiba uma lista dos itens que correspondem ao `termoDeFiltro`.

4.  Primeiro, implemente a filtragem diretamente na lógica de renderização do componente. Digite no input e perceba se há algum atraso.

5.  Agora, otimize isso\! Use `useMemo` para memoizar o resultado da lista filtrada. O cálculo só deve ser refeito quando `todosOsItens` ou `termoDeFiltro` mudar.

6.  Adicione um botão separado no componente que incrementa um contador (usando `useState`). Ao clicar nesse botão, observe o comportamento do componente:

      * Sem `useMemo`, a lógica de filtragem da lista roda de novo? (Você pode adicionar um `console.log` dentro da filtragem para verificar).
      * Com `useMemo`, ela roda de novo?

**Desafio Bônus (`useCallback`):**
Imagine que o item da lista é um componente separado (`<ItemDaLista />`) que recebe uma função `aoClicarNoItem` como prop. Use `useCallback` para garantir que essa função não seja recriada toda vez que o componente pai renderizar (por exemplo, quando o contador é incrementado). Isso evita que o `<ItemDaLista />` renderize desnecessariamente, caso ele esteja envolvido com `React.memo`.

**Pontos para discussão amanhã:**

  * Qual a real diferença entre `useCallback` e `useMemo`?
  * Quando é uma *má* ideia usar esses hooks? (O conceito de "otimização prematura").
  * Como podemos usar o Profiler do React DevTools para identificar esses problemas de performance em uma aplicação real?

Este conjunto de exercícios proporciona uma jornada prática e completa pelos conceitos centrais apresentados em sua pílula de conhecimento. Bom trabalho para a equipe\!

👉 [Clique aqui para ver as soluções dos exercícios](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/solutions/001-react-fundamentals.md)

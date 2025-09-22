### **Soluções dos exercícios: Pílula de Conhecimento 01 em Prática**

Esta série de encontros foi extremamente produtiva. As sessões de revisão se transformaram em aulas práticas interativas que permitiram um aprofundamento notável nos conceitos fundamentais do React. O documento a seguir consolida o código de cada exercício e os principais aprendizados extraídos das discussões em equipe.

-----

#### **Exercício 1: JSX, Componentes e Props (`CardDeUsuario`)**

##### A Solução em Código

```jsx
import React from 'react';

// O componente recebe o objeto `props` e desestruturamos `user` dele.
const CardDeUsuario = ({ user }) => {
  // Para facilitar a leitura, desestruturamos as propriedades de `user`.
  const { nome, urlAvatar, bio } = user;

  return (
    <div style={{ border: '1px solid #ccc', borderRadius: '8px', padding: '16px', margin: '16px', maxWidth: '300px' }}>
      <img src={urlAvatar} alt={`Avatar de ${nome}`} style={{ width: '100%', borderRadius: '50%' }} />
      <h2 style={{ textAlign: 'center' }}>{nome}</h2>
      <p>{bio}</p>
    </div>
  );
};

export default CardDeUsuario;
```

##### Resumo da Discussão e Principais Aprendizados

  * **Fluxo de Dados Unidirecional:** A discussão, iniciada pela pesquisa proativa do Caio, foi fundamental. Entendemos que os dados fluem "de cima para baixo" (do pai para o filho) e que as `props` são imutáveis no componente filho. Isso garante previsibilidade, segurança e facilita a otimização de performance.
  * **Padrões de Código:** Discutimos que a desestruturação de `props` (`({ user })` vs. `(props)`) é um padrão de código que, quando mantido, aumenta a legibilidade e a consistência do projeto.

-----

#### **Exercício 2: Gerenciamento de Estado com `useState` (`ContadorSimples`)**

##### A Solução em Código

```jsx
import React, { useState } from 'react';

const ContadorSimples = () => {
  // Inicializa o estado `count` com o valor 0.
  const [count, setCount] = useState(0);

  // Funções para manipular o estado
  const handleIncrement = () => {
    setCount(count + 1);
  };

  const handleDecrement = () => {
    // Regra de negócio para não permitir valores negativos
    if (count > 0) {
      setCount(count - 1);
    }
  };

  const handleReset = () => {
    setCount(0);
  };

  return (
    <div>
      <h2>Contador: {count}</h2>
      <button onClick={handleIncrement}>Incrementar +</button>
      {/* O botão é desabilitado quando a condição é verdadeira */}
      <button onClick={handleDecrement} disabled={count === 0}>Decrementar -</button>
      <button onClick={handleReset}>Resetar</button>
    </div>
  );
};

export default ContadorSimples;
```

##### Resumo da Discussão e Principais Aprendizados

  * **O Ciclo de Renderização do React:** Este exercício foi o portal para entendermos o "coração" do React. Dissecamos o que acontece ao chamar uma função `set`:
    1.  O React agenda uma atualização de estado.
    2.  Ele cria uma nova versão do **Virtual DOM**.
    3.  Compara ("diffing") o novo Virtual DOM com o antigo.
    4.  Aplica **apenas as mudanças necessárias** no DOM Real, o que é a chave para a alta performance do React.
  * **Imutabilidade:** O ponto mais crucial. Entendemos por que não podemos fazer `count++`. A alteração direta de uma variável de estado não dispara o ciclo de renderização. É a chamada da função `setCount` que avisa ao React que algo mudou e que a UI precisa ser atualizada.

-----

#### **Exercício 3: Efeitos Colaterais com `useEffect` (`PostFetcher` e `WindowTracker`)**

##### A Solução em Código

```jsx
// Parte A: PostFetcher.js
import React, { useState, useEffect } from 'react';

const fakeApiCall = () => new Promise((resolve) => {
  setTimeout(() => resolve({ title: 'Meu Primeiro Post', content: 'Conteúdo do post!' }), 2000);
});

export function PostFetcher() {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fakeApiCall().then((data) => {
      setPost(data);
      setLoading(false);
    });
  // O array de dependências vazio [] garante que o efeito execute apenas uma vez.
  }, []);

  if (loading) return <p>Carregando post...</p>;
  return (
    <div>
      <h2>{post.title}</h2>
      <p>{post.content}</p>
    </div>
  );
}

// Parte B: WindowTracker.js
export function WindowTracker() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);

    // A função de limpeza (cleanup) é retornada aqui.
    // Ela será executada quando o componente for desmontado.
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return <h2>Largura da janela: {windowWidth}px</h2>;
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Array de Dependências:** O conceito central do `useEffect`.
      * `[]` (vazio): Executa o efeito **apenas uma vez**, na montagem. Perfeito para buscar dados iniciais.
      * Sem array: Executa a **cada renderização**, um perigo que pode levar a loops infinitos.
  * **Função de Limpeza (`Cleanup`):** Entendemos a importância de retornar uma função dentro do `useEffect` para prevenir **vazamentos de memória**. Isso é essencial ao lidar com `event listeners`, subscriptions ou timers.
  * **Conexão com o Mundo Real:** A discussão foi enriquecida com exemplos práticos do nosso próprio código (listeners de navegação, localização), mostrando que a sintaxe da limpeza pode variar, mas o princípio de "limpar o que você sujou" é universal.

-----

#### **Exercício 4: Otimização com `useMemo` e `useCallback` (`DataFilter`)**

##### A Solução em Código

```jsx
import React, { useState, useMemo, useCallback } from 'react';

const allItems = Array.from({ length: 10000 }, (_, index) => `Item #${index + 1}`);

// Componente filho otimizado com React.memo
const ItemDaLista = React.memo(({ item, onClick }) => {
  console.log(`Renderizando o ${item}`);
  return <li onClick={onClick}>{item}</li>;
});

export default function DataFilter() {
  const [termoDeFiltro, setTermoDeFiltro] = useState('');
  const [contador, setContador] = useState(0);

  // useMemo memoriza o RESULTADO do cálculo caro (o array filtrado).
  // Só re-executa quando `termoDeFiltro` muda.
  const itensFiltrados = useMemo(() => {
    console.log('--- EXECUTANDO O CÁLCULO DE FILTRAGEM (CARO!) ---');
    return allItems.filter(item => item.includes(termoDeFiltro));
  }, [termoDeFiltro]);

  // useCallback memoriza a DEFINIÇÃO da função.
  // Garante que a mesma referência da função seja passada para o filho,
  // permitindo que o React.memo funcione corretamente.
  const handleItemClick = useCallback(() => {
    alert('Você clicou em um item!');
  }, []);

  return (
    <div>
      <input
        type="text"
        placeholder="Digite para filtrar..."
        onChange={e => setTermoDeFiltro(e.target.value)}
      />
      <button onClick={() => setContador(c => c + 1)}>
        Forçar Re-Render (Contador: {contador})
      </button>
      <ul>
        {itensFiltrados.slice(0, 20).map(item => (
          <ItemDaLista key={item} item={item} onClick={handleItemClick} />
        ))}
      </ul>
    </div>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **`useMemo` vs. `useCallback` vs. `React.memo`:** A distinção ficou clara:
      * **`useMemo`:** Memoriza um **valor calculado** (o resultado de uma função). Evita recálculos caros.
      * **`useCallback`:** Memoriza a **definição de uma função**. Evita que funções sejam recriadas a cada renderização.
      * **`React.memo`:** "Envolve" um componente para impedir que ele re-renderize se suas `props` não mudarem.
  * **A Analogia Chave:** "Bolo Pronto vs. Receita do Bolo".
      * `useMemo` te dá o **bolo pronto** (o valor final, o array já filtrado).
      * `useCallback` te dá a **receita do bolo** (a função, que pode ser passada para outros usarem).
  * **Otimização Consciente:** Discutimos o perigo da "otimização prematura". Esses hooks só devem ser usados quando há um problema de performance real e mensurável.
  * **Ferramentas Profissionais:** Introduzimos o **React DevTools Profiler** como a ferramenta correta para identificar gargalos de performance.

### **Conclusões Gerais da Iniciativa**

1.  **O Formato Funcionou:** A dinâmica de "apresentação guiada" dos exercícios se provou muito eficaz, permitindo discussões profundas e focadas.
2.  **A Interação Direta é Poderosa:** Fazer perguntas diretas para membros específicos da equipe foi um sucesso, quebrando a passividade e revelando que o conhecimento estava sendo absorvido.
3.  **Conhecimento se Constrói em Camadas:** As sessões mostraram como os conceitos se conectam, desde `props` até os hooks de otimização, formando uma base sólida de conhecimento.

Este ciclo de estudo foi um excelente investimento no nosso crescimento técnico. Parabéns a todos pela participação e pelas discussões\!

### **Soluções dos exercícios: Pílula de Conhecimento 03 em Prática**

Esta série de encontros foi extremamente produtiva. As discussões nos levaram de conceitos básicos de JavaScript a decisões de arquitetura em componentes React, solidificando nosso entendimento sobre como construir UIs dinâmicas e robustas. O documento a seguir consolida o código de cada exercício e os principais aprendizados extraídos das discussões em equipe.

-----

#### **Exercício 1: A Estrutura Principal com `if / else`**

##### A Solução em Código

```jsx
import React from 'react';

const PainelDeUsuario = () => (
  <div>
    <h1>Bem-vindo(a) de volta!</h1>
    <button>Sair</button>
  </div>
);

const TelaDeLogin = () => (
  <div>
    <h1>Por favor, faça o login.</h1>
    <button>Entrar</button>
  </div>
);

export default function SistemaDeAutenticacao({ isLoggedIn }) {
  // A lógica condicional é resolvida ANTES do return do JSX.
  if (isLoggedIn) {
    return <PainelDeUsuario />;
  } else {
    return <TelaDeLogin />;
  }
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Clareza Estrutural:** A equipe concluiu que a principal vantagem do `if / else` neste cenário não é performance, mas sim **clareza e estrutura**. É a abordagem mais legível para quando uma condição determina a renderização de componentes inteiramente diferentes, como a troca de uma "página".
  * **Statement vs. Expression:** A discussão aprofundou-se em um conceito fundamental. Entendemos que:
      * **Expression** é um código que resolve para um valor (ex: `1 + 1`, `isLoggedIn === true`).
      * **Statement** é um código que realiza uma ação, mas não tem um valor de retorno (ex: `if/else`, `for`).
      * O JSX, dentro das chaves `{ }`, espera uma **expression**, e é por isso que um `if / else` não pode ser usado diretamente ali.

-----

#### **Exercício 2: Alternância Rápida com Operador Ternário**

##### A Solução em Código

```jsx
import React, { useState } from 'react';

export default function BotaoDeTema() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <button
      onClick={() => setIsDarkMode(!isDarkMode)}
      style={{
        backgroundColor: isDarkMode ? '#222' : '#FFF',
        color: isDarkMode ? '#FFF' : '#222',
      }}
    >
      {isDarkMode ? 'Ativar Modo Claro' : 'Ativar Modo Escuro'}
    </button>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Expression em Ação:** Conectando com a discussão anterior, André lembrou corretamente que o ternário, por ser uma **expression**, é perfeito para uso dentro do JSX.
  * **Elegância para Casos Simples:** A equipe concordou que para alternar entre dois valores (seja texto, estilos ou componentes simples), o ternário é a solução mais concisa e elegante.
  * **Má Prática:** A discussão deixou claro que **aninhamento de ternários** (`cond1 ? val1 : cond2 ? val2 : val3`) deve ser evitado, pois torna o código rapidamente ilegível.

-----

#### **Exercício 3: Mostrando e Ocultando com `&&` (e a Armadilha do Zero)**

##### A Solução em Código

```jsx
import React, { useState } from 'react';

export default function ContadorDeCarrinho() {
  const [itemCount, setItemCount] = useState(0);

  return (
    <div>
      <h2>Itens no Carrinho: {itemCount}</h2>
      <button onClick={() => setItemCount(itemCount + 1)}>Adicionar Item</button>
      <button onClick={() => setItemCount(itemCount > 0 ? itemCount - 1 : 0)}>Remover Item</button>
      <hr />
      <h3>Notificações do Carrinho:</h3>
      {/* Implementação intencionalmente problemática para demonstrar o bug. */}
      {itemCount && <p>Você tem itens no seu carrinho!</p>}
    </div>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **O Bug do Valor "Falsy":** A equipe entendeu o comportamento de **curto-circuito** do JavaScript. Quando `itemCount` é `0` (um valor "falsy"), a expressão `itemCount && <p>...</p>` retorna o próprio `0`, que o React Web renderiza na tela.
  * **React Web vs. React Native:** Ressaltamos a diferença crítica: no React Web, isso é um bug visual; no React Native, seria um **erro fatal** que quebraria a aplicação, pois números não podem ser renderizados fora de um componente `<Text>`.

-----

#### **Exercício 4: A Solução Definitiva para o `&&`**

##### A Solução em Código

```jsx
import React, { useState } from 'react';

let taskId = 0;

export default function ListaDeTarefas() {
  const [tasks, setTasks] = useState([]);

  const handleAddTask = () => {
    setTasks([...tasks, { id: taskId++, text: `Nova tarefa #${taskId}` }]);
  };

  return (
    <div>
      <button onClick={handleAddTask}>Adicionar Tarefa</button>
      
      {/* CONDIÇÃO SEGURA: `tasks.length > 0` sempre resultará em um booleano. */}
      {tasks.length > 0 && (
        <div>
          <h2>Suas Tarefas</h2>
          <ul>
            {tasks.map(task => <li key={task.id}>{task.text}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **A Solução Booleana:** A solução para o bug do exercício anterior ficou clara: a condição à esquerda do `&&` deve sempre resultar em um **booleano puro** (`true` ou `false`). A expressão `tasks.length > 0` faz exatamente isso.
  * **Dupla Negação (`!!`):** Leonardo explicou corretamente que o operador `!!` força a conversão de qualquer valor para seu equivalente booleano (ex: `!!0` é `false`, `!!'texto'` é `true`), sendo uma alternativa útil.
  * **Estrutura de Código:** Caio levantou um ponto importante sobre comparar `&&` com um componente separado contendo um `if`. A conclusão foi que, embora logicamente similar, para renderizar um único elemento ou um pequeno bloco, a abordagem `&&` é muito mais prática e concisa do que criar um novo componente apenas para isso.

-----

#### **Exercício Final: O Painel de Controle (Colocando Tudo Junto)**

##### A Solução em Código

```jsx
import React, { useState, useEffect } from 'react';

export default function PainelDeControle() {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setUserData({ name: 'Ewerton', isAdmin: true });
      setIsLoading(false);
    }, 2000);
  }, []);

  // 1. `if / else`: Ideal para estados de "tela cheia" que bloqueiam o resto da UI.
  if (isLoading) {
    return <p>Carregando...</p>;
  }
  if (error) {
    return <p style={{ color: 'red' }}>Erro: {error}</p>;
  }

  return (
    <div>
      <h1>Painel de Controle</h1>
      <p>
        Olá,{' '}
        {/* 2. Operador Ternário: Perfeito para alternar entre dois valores. */}
        <strong>{userData.name ? userData.name : 'Visitante'}</strong>!
      </p>

      {/* 3. Operador `&&`: Ótimo para mostrar ou ocultar um único elemento. */}
      {userData.isAdmin && <span style={{ color: 'green', fontWeight: 'bold' }}>[Admin]</span>}
    </div>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **A Ferramenta Certa para o Trabalho:** Este exercício final solidificou o caso de uso de cada técnica.
      * **`if / else`:** A equipe (liderada pela explicação de Leonardo) entendeu que é a melhor escolha para estados de alto nível, como `isLoading` e `error`, pois eles interrompem a renderização do resto do componente, tornando a lógica mais limpa e segura.
      * **Operador Ternário:** Leonardo também identificou que o ternário foi perfeito para exibir o nome de usuário, pois havia exatamente **dois estados possíveis**: o nome ou "Visitante".
      * **Operador `&&`:** Nátaly concluiu corretamente que o `&&` foi a escolha ideal para o selo de "Admin" porque era um cenário de **exibir ou não exibir**, sem uma alternativa "else".

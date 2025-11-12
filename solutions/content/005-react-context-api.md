### **Soluções dos exercícios: Pílula de Conhecimento 05 em Prática**

Esta série de encontros nos guiou desde a identificação do problema de "prop drilling" até a implementação de uma solução de estado global robusta, escalável e otimizada usando a Context API. As discussões reforçaram a importância de centralizar, encapsular e otimizar a lógica de estado global.

-----

#### **Exercício 1: O Problema (Simulação de Prop Drilling)**

##### A Solução em Código (Demonstrando o Problema)

```jsx
import React, { useState } from 'react';

// 3. Neto (Consumidor)
const CabecalhoDoUsuario = ({ user }) => {
  return <p>Olá, {user.name}</p>;
};

// 2. Filho (Intermediário - O "Prop Driller")
const PaginaDePerfil = ({ user }) => {
  // Este componente não usa 'user', apenas o repassa.
  return (
    <div>
      <h2>Página de Perfil</h2>
      <CabecalhoDoUsuario user={user} />
    </div>
  );
};

// 1. Pai (Dono do Estado)
export default function App() {
  const [user, setUser] = useState({ name: 'Visitante' });

  return (
    <main>
      <h1>App (Demonstração de Prop Drilling)</h1>
      <PaginaDePerfil user={user} />
    </main>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Identificação do Problema:** A equipe identificou o fluxo onde `PaginaDePerfil` atua como um "atravessador" de props.
  * **Problema de Manutenção:** A principal desvantagem discutida (mencionada por Caio) é a **rastreabilidade**. Em uma aplicação com muitos níveis, encontrar a origem de uma prop (`user`) ou para onde ela vai se torna um pesadelo de manutenção, exigindo "pular de arquivo em arquivo".

-----

#### **Exercício 2: Criando o Contexto e o Provedor**

##### A Solução em Código (Refatoração Inicial)

```jsx
import React, { useState, createContext } from 'react';

// --- 1. Criação do Contexto ---
export const AuthContext = createContext(null);

// --- 2. Criação do Provedor ---
export const AuthProvider = ({ children }) => {
  // O estado agora vive aqui, encapsulado.
  const [user, setUser] = useState({ name: 'Visitante' });

  return (
    // O Provider "provê" o estado para todos os componentes filhos.
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- App.js Refatorado ---
export default function App() {
  return (
    <AuthProvider>
      <main>
        <h1>App (com Contexto)</h1>
        <PaginaDePerfil /> 
      </main>
    </AuthProvider>
  );
}
// ... (Componentes PaginaDePerfil e CabecalhoDoUsuario refatorados 
//      para não passar/receber props, mas ainda incompletos)
```

##### Resumo da Discussão e Principais Aprendizados

  * **Centralização da Lógica:** A equipe (com resposta de Nátaly) concluiu que toda a lógica de estado (`useState`) e as funções de negócio (`login`, `logout`) devem ser **encapsuladas dentro do `AuthProvider`**.
  * **Má Prática (Passar o `setter`):** Você identificou que passar `setUser` diretamente no `value` não é uma boa prática, pois expõe o atualizador de estado sem controle. A abordagem correta é criar funções específicas (`login`).

-----

#### **Exercício 3: Consumindo o Contexto com `useContext`**

##### A Solução em Código

```jsx
import React, { useState, createContext, useContext } from 'react';

// --- Contexto e Provider (do Exercício 2) ---
const AuthContext = createContext(null);
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Visitante' });
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Componente Consumidor (AGORA FUNCIONA) ---
const CabecalhoDoUsuario = () => {
  // O hook useContext recebe o Contexto e retorna o 'value' do Provider.
  const { user } = useContext(AuthContext);

  return <p>Olá, {user.name}</p>;
};

// --- App.js e PaginaDePerfil (iguais ao Exercício 2) ---
const PaginaDePerfil = () => (
  <div>
    <h2>Página de Perfil</h2>
    <CabecalhoDoUsuario />
  </div>
);

export default function App() {
  return (
    <AuthProvider>
      <main>
        <h1>App (useContext)</h1>
        <PaginaDePerfil />
      </main>
    </AuthProvider>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **O que `useContext` retorna?** Gean respondeu corretamente: ele retorna o que foi passado na prop `value` do `Provider`.
  * **Risco de Consumir Fora do Provider:** A equipe (com ajuda de Mateus) discutiu que se `useContext` fosse usado fora do `AuthProvider`, ele retornaria o valor inicial (`null`), e a tentativa de desestruturar `user` de `null` causaria um **erro fatal (crash)**.

-----

#### **Exercício 4: A Melhor Prática (Hook Customizado e Funções)**

##### A Solução em Código (O Padrão Ideal)

```jsx
import React, { useState, createContext, useContext } from 'react';

// --- 1. Criação do Contexto ---
const AuthContext = createContext(null);

// --- 2. Criação do Provedor (Agora com Lógica Encapsulada) ---
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Visitante' });

  // Funções de lógica de negócio vivem encapsuladas aqui
  const login = (nome) => {
    setUser({ name: nome });
  };
  const logout = () => {
    setUser({ name: 'Visitante' });
  };

  // O 'value' agora expõe apenas o que é seguro e necessário
  const value = { user, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// --- 3. Hook Customizado (A Melhor Prática) ---
const useAuth = () => {
  const context = useContext(AuthContext);

  // Verificação de segurança para evitar o erro do Exercício 3
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// --- 4. Componentes Consumidores (Usando o Hook Customizado) ---
const CabecalhoDoUsuario = () => {
  const { user } = useAuth(); // Consumo limpo e seguro
  return <p>Olá, {user.name}</p>;
};

const BotoesDeAcao = () => {
  const { login, logout } = useAuth();
  return (
    <div>
      <button onClick={() => login('Ewerton')}>Fazer Login</button>
      <button onClick={logout}>Fazer Logout</button>
    </div>
  );
};
```

##### Resumo da Discussão e Principais Aprendizados

  * **Vantagens do Hook Customizado:** Mateus identificou corretamente as duas maiores vantagens de usar `useAuth`:
    1.  **Segurança:** A verificação `if (!context)` previne o crash da aplicação.
    2.  **Encapsulamento/Reaproveitamento:** Simplifica o consumo nos componentes, que só precisam importar `useAuth`.
  * **Compartilhando Comportamento:** A equipe concluiu (com Nátaly) que o `Provider` permite compartilhar não apenas o estado (dados), mas também as **funções** (comportamento) que modificam esse estado.

-----

#### **Desafio Bônus: Otimizando com `useMemo` e `useCallback`**

##### A Solução em Código (O Padrão Otimizado)

```jsx
import React, { 
  useState, 
  createContext, 
  useContext, 
  useMemo, // Importa useMemo
  useCallback // Importa useCallback
} from 'react';

const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Visitante' });
  const [theme, setTheme] = useState('light'); // Estado extra para simular o problema

  // 1. Estabilizamos a função 'login' com useCallback.
  // Ela só será recriada se suas dependências (nenhuma) mudarem.
  const login = useCallback((nome) => {
    setUser({ name: nome });
  }, []); 

  // 2. Estabilizamos a função 'logout'.
  const logout = useCallback(() => {
    setUser({ name: 'Visitante' });
  }, []);

  // 3. Estabilizamos o objeto 'value' com useMemo.
  // Este objeto SÓ será recriado se 'user', 'login', ou 'logout' mudarem.
  const value = useMemo(() => ({
    user,
    login,
    logout,
  }), [user, login, logout]); // Array de dependências

  return (
    <AuthContext.Provider value={value}>
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Mudar Tema ({theme})
      </button>
      {children}
    </AuthContext.Provider>
  );
};

// ... (O resto da aplicação, incluindo o hook useAuth, permanece o mesmo)
```

##### Resumo da Discussão e Principais Aprendizados

  * **O Problema:** A equipe entendeu que, sem otimização, mudar o estado `theme` faria o `AuthProvider` re-renderizar. Isso criaria um **novo** objeto `value` e **novas** funções `login`/`logout`, pois `{...}` e `() => {}` são sempre novas referências. Isso forçaria todos os componentes consumidores (como `CabecalhoDoUsuario`) a re-renderizar, mesmo que `user` não tenha mudado.
  * **A Solução (`useCallback`):** Gean explicou corretamente que `useCallback` "congela" (memoiza) a função, evitando que ela seja recriada a cada renderização, a menos que suas dependências mudem. (A "receita do bolo").
  * **A Solução (`useMemo`):** Você explicou que `useMemo` faz o mesmo, mas para o *valor de retorno* da função (o objeto `value`). Ele "congela" o objeto e só o recria se `user`, `login`, ou `logout` mudarem. (O "bolo pronto").
  * **Resultado:** Clicar em "Mudar Tema" agora re-renderiza o `AuthProvider`, mas `useCallback` e `useMemo` pulam a recriação. O `value` permanece o *mesmo objeto* de antes, e os componentes consumidores não re-renderizam desnecessariamente.

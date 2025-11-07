###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/004-jsx-lists.md)

# 📘 Pílula de Conhecimento 05 — React Context API: Compartilhando Estado Global

Em uma aplicação React, é comum precisarmos compartilhar dados entre componentes distantes na árvore de componentes. Passar props manualmente através de vários níveis intermediários é um processo conhecido como **"prop drilling"** (perfuração de props), que torna o código verboso e difícil de manter.

A **Context API** é a solução nativa do React para esse problema. Ela cria um "canal" global que permite a um componente pai disponibilizar dados para qualquer um de seus descendentes, não importa quão profundos eles estejam, sem a necessidade de passar props manualmente.

---

## 🛠️ O Fluxo de Trabalho em 3 Passos

A implementação da Context API segue um padrão simples e lógico.

### Passo 1: Criar o Contexto com `createContext`

Primeiro, criamos o "canal" de comunicação. Esta função retorna um objeto com dois componentes: `Provider` e `Consumer`.

```tsx
// src/contexts/AuthContext.tsx
import { createContext } from 'react';

// O valor inicial (null) é usado se um componente tentar consumir o contexto
// fora de um Provider.
export const AuthContext = createContext(null);
```

### Passo 2: Fornecer o Estado com o Provider

O componente `Provider` é usado para "envolver" a parte da sua aplicação que precisa de acesso aos dados. Ele aceita uma prop `value`, que é onde você define os dados e funções que serão compartilhados.

```tsx
// src/contexts/AuthContext.tsx
import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Todos os componentes dentro de AuthProvider poderão acessar `user` e `setUser`.
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

### Passo 3: Consumir o Estado com `useContext`

Finalmente, qualquer componente filho dentro do `Provider` pode "se inscrever" e acessar os dados compartilhados usando o hook `useContext`.

```tsx
// src/components/Profile.tsx
import React, { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';

const Profile = () => {
  // O hook recebe o objeto de contexto e retorna o `value` do Provider mais próximo.
  const { user } = useContext(AuthContext);

  if (!user) {
    return <Text>Nenhum usuário logado.</Text>;
  }

  return <Text>Usuário logado: {user.name}</Text>;
};
```

---

## 🚀 A Melhor Prática: Criando um Hook Customizado

Para tornar o uso do seu contexto mais limpo, seguro e reutilizável, a melhor prática é criar um hook customizado que encapsula a lógica do `useContext`.

Veja a estrutura completa e recomendada:

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Criar o contexto
const AuthContext = createContext(null);

// 2. Criar o Provider, com toda a lógica de estado
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Lógica para carregar dados persistidos ao iniciar o app
  useEffect(() => {
    const loadUserFromStorage = async () => {
      const storedUser = await AsyncStorage.getItem('@user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    loadUserFromStorage();
  }, []);

  const signIn = async (userData) => {
    setUser(userData);
    await AsyncStorage.setItem('@user', JSON.stringify(userData));
  };

  const signOut = async () => {
    setUser(null);
    await AsyncStorage.removeItem('@user');
  };

  const value = { user, isLoading, signIn, signOut };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// 3. Criar o Hook customizado para consumir o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
};
```

**Vantagens dessa abordagem:**
* **Encapsulamento:** Toda a lógica de autenticação fica isolada no `AuthProvider`.
* **Facilidade de Uso:** Os componentes consomem tudo com uma única chamada: `const { user, signIn } = useAuth();`.
* **Segurança:** O check `if (!context)` garante que o hook não seja usado fora do provider, evitando erros.

---

## 🤔 Context API vs. Redux: Quando usar cada um?

Embora ambos gerenciem estado, eles servem a propósitos diferentes:

* **Context API:**
    * **Ideal para:** Estado que muda com baixa frequência, como dados de autenticação, tema (claro/escuro), idioma ou configurações do usuário.
    * **Vantagem:** Simples, nativo do React, sem dependências externas.
    * **Cuidado:** Pode causar re-renderizações desnecessárias em componentes que consomem o contexto se o `value` do provider for recriado a cada render. Use `useMemo` para otimizar o objeto `value` se necessário.

* **Redux (ou Zustand, Jotai):**
    * **Ideal para:** Estado global complexo e que muda com alta frequência, como o estado de um editor de texto, um carrinho de compras complexo ou dados de UI que vários componentes manipulam.
    * **Vantagem:** Ferramentas poderosas (Redux DevTools, middleware), performance otimizada para atualizações frequentes e um fluxo de dados mais previsível e escalável (actions, reducers).

É totalmente possível e comum usar ambos: **Redux** para o estado global complexo da aplicação e **Context API** para estados mais "locais" ou de escopo específico, como o controle de um modal.

---

## ✅ Conclusão

A **Context API** é a ferramenta padrão do React para resolver o problema de **prop drilling** de forma limpa e eficiente. É a escolha perfeita para compartilhar dados que não mudam a todo momento, como informações de sessão, tema e configurações.

Ao criar um **Provider** para encapsular a lógica e um **hook customizado** para consumir os dados, você obtém uma arquitetura de estado global que é ao mesmo tempo simples, robusta e fácil de manter.

👉 [Clique aqui para praticar com exercícios](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/exercises/005-react-context-api.md)

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/006-design-system.md) 👉

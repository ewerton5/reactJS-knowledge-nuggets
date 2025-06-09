###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/004-jsx-lists.md)

# 📘 Pílula de Conhecimento 05 — React Context API: Compartilhando Estado Global de Forma Simples

No desenvolvimento com React, quando precisamos compartilhar dados entre componentes que não são diretamente pai e filho, temos duas opções muito comuns: usar bibliotecas como Redux ou a **Context API do React**. A **Context API** permite gerenciar e compartilhar estados de forma mais simples e nativa, sem a necessidade de passar props manualmente em vários níveis da árvore de componentes.

---

## 🔧 **Criação de um Contexto com `createContext`**

O primeiro passo para utilizar a Context API é criar o contexto:

```tsx
import { createContext } from 'react';

export const AuthContext = createContext(null);
```

Esse contexto será o canal de comunicação entre os componentes.

---

## 🧩 **Criando o Provider e Englobando os Componentes**

Para que os componentes tenham acesso ao contexto, eles precisam estar dentro de um **Provider**. É no Provider que você define quais dados serão compartilhados:

```tsx
import React, { useState } from 'react';
import { AuthContext } from './AuthContext';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

Na prática, isso significa que qualquer componente "filho" dentro de `AuthProvider` pode acessar `user` e `setUser`.

---

## 🧪 **Consumindo o Contexto com `useContext`**

Com o contexto criado e o Provider em volta dos componentes, podemos consumi-lo com o hook `useContext`:

```tsx
import React, { useContext } from 'react';
import { AuthContext } from './AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);

  return (
    <Text>Usuário logado: {user?.name}</Text>
  );
};
```

---

## 🧵 **Combinando com outros Hooks: `useState`, `useEffect`, `useMemo`**

O Contexto é apenas um container. Dentro do provider, podemos usar quantos hooks forem necessários para enriquecer a lógica:

```tsx
import React, { useEffect } from 'react';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Simulação de carregamento do usuário com AsyncStorage
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) setUser(JSON.parse(storedUser));
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
```

---

## 📦 **Mesclando Redux com Context API**

Embora o Redux tenha seu próprio sistema de Provider, é possível usar `useSelector` e `useDispatch` junto com um contexto local. Isso permite, por exemplo, combinar estados globais (Redux) com estados locais (Context):

```tsx
import { useSelector, useDispatch } from 'react-redux';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const theme = useSelector((state) => state.theme);
  const dispatch = useDispatch();

  return (
    <View>
      <Text>Olá, {user.name}</Text>
      <Text>Tema atual: {theme}</Text>
    </View>
  );
};
```

---

## 🔐 **Contexto com Persistência: AsyncStorage + Context**

Uma estratégia comum em apps mobile é usar o **AsyncStorage** para manter dados persistidos e resgatá-los no início da aplicação:

```tsx
useEffect(() => {
  const checkLogin = async () => {
    const savedUser = await AsyncStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  };

  checkLogin();
}, []);
```

---

## 🔁 **Estrutura Reutilizável de Contexto**

Aqui vai um padrão limpo e escalável para organizar seus contextos:

```tsx
// context/AuthContext.js
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
```

Com isso, em qualquer componente você pode fazer:

```tsx
import { useAuth } from './context/AuthContext';

const Header = () => {
  const { user } = useAuth();
  return <Text>Bem-vindo, {user?.name}</Text>;
};
```

---

## 🧠 **Resumo Prático**

* **`createContext`** cria o canal.
* **Provider** disponibiliza os dados para os filhos.
* **`useContext`** consome esses dados.
* Pode ser usado junto com **`useState`**, **`useEffect`**, **Redux (`useSelector`, `useDispatch`)** e **AsyncStorage**.
* Ideal para estados compartilhados em várias telas: tema, autenticação, idioma, carrinho etc.

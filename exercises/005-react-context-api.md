## 🚀 **Oficina Prática: Gerenciando Estado Global com a Context API**

Olá, equipe\! A pílula de hoje nos mostrou como parar de "perfurar props" (prop drilling) e compartilhar dados de forma eficiente com a Context API. Os exercícios abaixo nos guiarão, passo a passo, na construção de um sistema de autenticação, aplicando as melhores práticas.

### **Instruções de Setup:**

1.  Abra um ambiente de desenvolvimento React (CodeSandbox, StackBlitz ou seu projeto local).
2.  Vamos criar uma mini-aplicação. Você pode criar os componentes em arquivos separados ou no mesmo arquivo `App.js` para facilitar.

-----

### **🧠 Exercício 1: Simulação de Prop Drilling (perfuração de props)**.

**Objetivo:** Sentir na prática o problema do "prop drilling", passando props manualmente por componentes que não as utilizam.

**Tarefa:** Crie a seguinte estrutura de componentes. `App` é o dono do estado `user`, e `CabecalhoDoUsuario` precisa exibir o nome do usuário.

1.  **`App`**:
      * Deve conter um `useState` para `user`, inicializado com `{ name: 'Visitante' }`.
      * Renderiza o componente `<PaginaDePerfil user={user} />`.
2.  **`PaginaDePerfil`**:
      * Recebe `user` como prop.
      * Renderiza o componente `<CabecalhoDoUsuario user={user} />`. (Note que `PaginaDePerfil` não usa `user`, apenas o repassa).
3.  **`CabecalhoDoUsuario`**:
      * Recebe `user` como prop.
      * Renderiza o texto: `Olá, {user.name}`.

**Pontos para discussão:**

  * O que aconteceria se tivéssemos 5 níveis de componentes entre `App` e `CabecalhoDoUsuario`?
  * Qual é a principal desvantagem de manutenção dessa abordagem?

-----

### **🛠️ Exercício 2: Criando o Contexto e o Provedor (10 minutos)**

**Objetivo:** Começar a refatorar a solução anterior. Vamos criar o "canal" de comunicação (Contexto) e o "Provedor" (Provider) que conterá o estado.

**Tarefa:**

1.  **Crie o Contexto:** Em um arquivo (ou no topo do `App.js`), crie o `AuthContext`:
    ```jsx
    import { createContext } from 'react';
    export const AuthContext = createContext(null);
    ```
2.  **Crie o Provedor (`AuthProvider`):**
      * Crie um novo componente `AuthProvider` que recebe `{ children }` como prop.
      * **Mova** o `useState` do `user` (do `App` do Exercício 1) para dentro do `AuthProvider`.
      * O `AuthProvider` deve retornar o `AuthContext.Provider` envolvendo os `{children}`.
      * Na prop `value` do Provider, passe o estado: `value={{ user, setUser }}`.
3.  **Refatore o `App`:**
      * Remova o `useState` do `App`.
      * Envolva o `<PaginaDePerfil />` com o seu novo `<AuthProvider />`.
      * Remova a prop `user` de `<PaginaDePerfil />`.
4.  **Refatore `PaginaDePerfil`:**
      * Remova a prop `user` que ela recebia e repassava.

*Neste ponto, a aplicação irá quebrar no `CabecalhoDoUsuario`, pois ele não recebe mais a prop `user`. O próximo exercício corrigirá isso.*

**Pontos para discussão:**

  * O que é o `children` em um componente React?
  * Onde toda a lógica de estado e as funções (como `login`, `logout`) deveriam viver, de acordo com a pílula?

-----

### **🎧 Exercício 3: Consumindo o Contexto com `useContext` (10 minutos)**

**Objetivo:** Corrigir a aplicação do Exercício 2, fazendo o componente `CabecalhoDoUsuario` "escutar" o contexto.

**Tarefa:**

1.  Abra o componente `CabecalhoDoUsuario`.
2.  Remova a prop `user` que ele (agora incorretamente) espera.
3.  Importe o `useContext` do React e o `AuthContext` que você criou.
4.  Dentro do componente, chame o hook `useContext` para acessar os dados:
    ```jsx
    const { user } = useContext(AuthContext);
    ```
5.  Renderize o nome do usuário como antes: `Olá, {user.name}`.

*Agora, a aplicação deve funcionar novamente, mas sem nenhum "prop drilling"\!*

**Pontos para discussão:**

  * O que o `useContext` retorna?
  * O que aconteceria se usássemos `useContext(AuthContext)` em um componente que *não* está envolvido pelo `AuthProvider`?

-----

### **🚀 Exercício 4: A Melhor Prática - Hook Customizado e Funções (15 minutos)**

**Objetivo:** Implementar o padrão completo e recomendado pela pílula: encapsular a lógica no Provider e criar um hook customizado para consumo e segurança.

**Tarefa:**

1.  **Melhore o `AuthProvider`:**
      * Adicione uma função `login` dentro do `AuthProvider` que atualiza o estado:
        ```javascript
        const login = (nome) => {
          setUser({ name: nome });
        };
        ```
      * Passe essa função `login` no `value` do Provider: `value={{ user, login }}`.
2.  **Crie o Hook Customizado (`useAuth`):**
      * Crie uma nova função `useAuth` (fora de qualquer componente).
      * Dentro dela, chame `const context = useContext(AuthContext);`.
      * Adicione a **verificação de segurança** da pílula:
        ```javascript
        if (!context) {
          throw new Error('useAuth deve ser usado dentro de um AuthProvider');
        }
        return context;
        ```
3.  **Refatore `CabecalhoDoUsuario`:**
      * Substitua `const { user } = useContext(AuthContext);` por `const { user } = useAuth();`.
4.  **Crie um novo componente `BotaoDeLogin`:**
      * Este componente deve usar o hook customizado: `const { login } = useAuth();`.
      * Renderize um `<button>` que, ao ser clicado (`onClick`), chama `login('Usuário Logado')`.
5.  Adicione o `<BotaoDeLogin />` dentro do `App` (ou `PaginaDePerfil`) para testar.

**Pontos para discussão:**

  * Quais são as duas grandes vantagens de usar o hook `useAuth` em vez de `useContext(AuthContext)` diretamente em todos os componentes?
  * Como este padrão nos permite compartilhar não apenas dados (estado), mas também comportamento (funções)?

-----

### **⚙️ Desafio Bônus: Otimizando com `useMemo`**

**Objetivo:** Aplicar o conceito de otimização de performance mencionado na pílula para evitar re-renderizações desnecessárias.

**Cenário:**
Imagine que no nosso `AuthProvider` (Exercício 4), nós também temos um estado de `theme`:

```jsx
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({ name: 'Visitante' });
  const [theme, setTheme] = useState('light'); // NOVO ESTADO

  const login = (nome) => setUser({ name: nome });

  // A CADA RENDER, um NOVO objeto de valor é criado.
  const value = { user, login }; 

  return (
    <AuthContext.Provider value={value}>
      {/* Botão apenas para simular a mudança de tema */}
      <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        Mudar Tema
      </button>
      {children}
    </AuthContext.Provider>
  );
};
```

**O Problema:** Quando o botão "Mudar Tema" é clicado, o `AuthProvider` re-renderiza. A linha `const value = { user, login };` cria um **novo objeto** na memória. Todos os componentes que consomem o contexto (como `CabecalhoDoUsuario`) irão re-renderizar, mesmo que `user` ou `login` não tenham mudado.

**Sua Tarefa:**
Refatore a definição do `value` no `AuthProvider` usando o hook `useMemo` para garantir que o objeto `value` só seja recriado se `user` ou `login` realmente mudarem. (Dica: `login` também precisará ser estabilizado com `useCallback`).

**Pontos para discussão:**

  * Por que `useMemo` é necessário aqui?
  * Qual seria o array de dependências correto para o `useMemo` (e `useCallback`)?

###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/022-auth.md)

# 📘 Pílula de Conhecimento 23 — Zustand: Gerenciamento de Estado Global com Simplicidade

Enquanto o Redux é uma solução robusta e estruturada para gerenciamento de estado, sua verbosidade e complexidade podem ser excessivas para muitos projetos. O **Zustand** surge como uma alternativa poderosa, oferecendo um gerenciamento de estado global de forma minimalista, flexível e com muito menos boilerplate.

Seu nome, que em alemão significa "estado", reflete sua filosofia: fornecer uma maneira simples e direta de gerenciar o estado da sua aplicação.

## 1\. O Conceito Central: A Store Unificada

A principal diferença do Zustand para o Redux é a sua simplicidade arquitetural. Em vez de separar o estado em *actions*, *reducers* e *selectors*, o Zustand agrupa tudo em uma única "store" criada com um hook customizado. Esta store contém tanto as **variáveis de estado** quanto as **funções que modificam esse estado**.

  * **Menos Boilerplate:** Não há necessidade de `dispatch`, `action types` ou `reducers` complexos.
  * **Flexibilidade:** Você pode lidar com lógica síncrona e assíncrona (chamadas de API) diretamente dentro das funções da sua store, sem a necessidade de middlewares como Saga ou Thunk.

## 2\. Criando sua Primeira Store com `create`

A criação de uma store é feita com a função `create` do Zustand. Ela recebe uma função que define o estado inicial e as ações.

  * **`set`**: Uma função para atualizar o estado.
  * **`get`**: Uma função para ler o estado atual (útil dentro de outras ações).

**Exemplo: Uma store de autenticação**

```ts
// src/store/authStore.ts
import { create } from 'zustand';
import { loginService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';

// 1. Defina a tipagem do seu estado e das suas ações
interface AuthState {
  isAuthenticated: boolean;
  user: { name: string; email: string } | null;
  isLoading: boolean;
  login: (credentials: Credentials) => Promise<void>;
  logout: () => void;
}

// 2. Crie a store com a função `create`
export const useAuthStore = create<AuthState>((set, get) => ({
  // Estado inicial
  isAuthenticated: false,
  user: null,
  isLoading: false,

  // Ações para modificar o estado
  login: async (credentials) => {
    set({ isLoading: true }); // Atualiza o estado de loading
    try {
      const userData = await loginService(credentials);
      set({ user: userData, isAuthenticated: true, isLoading: false });
      await AsyncStorage.setItem('@token', userData.token); // Persistência manual
    } catch (error) {
      set({ isLoading: false, error: 'Falha no login' });
    }
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
    AsyncStorage.removeItem('@token');
  },
}));
```

## 3\. Usando a Store nos Componentes

Para usar a store em um componente, basta importar o hook criado (`useAuthStore`) e chamá-lo.

### Acesso Otimizado com Selectors

Chamar o hook sem parâmetros (`const store = useAuthStore();`) faz com que o componente se re-renderize sempre que *qualquer* parte da store mudar. Para otimizar a performance, usamos uma **função seletora** para extrair apenas os pedaços de estado ou as ações que o componente realmente precisa.

**Exemplo de uso em um componente de Login:**

```tsx
import { useAuthStore } from '../store/authStore';

const LoginScreen = () => {
  // 1. Seleciona apenas a ação de login e o estado de loading
  const login = useAuthStore(state => state.login);
  const isLoading = useAuthStore(state => state.isLoading);

  const handleLogin = () => {
    // 2. Chama a ação diretamente, sem `dispatch`
    login({ email: 'test@test.com', password: '123' });
  };

  return (
    <View>
      <Button title="Entrar" onPress={handleLogin} disabled={isLoading} />
      {isLoading && <ActivityIndicator />}
    </View>
  );
};

// Em outro componente, para exibir o nome do usuário:
const UserProfile = () => {
  // Este componente só irá re-renderizar se o `user` mudar
  const user = useAuthStore(state => state.user);

  return <Text>Bem-vindo, {user?.name}</Text>;
}
```

## 4\. Persistindo o Estado com Middleware

O Zustand possui middlewares que adicionam funcionalidades extras à sua store. O mais comum é o `persist`, que salva e reidrata o estado automaticamente usando `AsyncStorage` (no mobile) ou `localStorage` (na web).

**Exemplo com o middleware `persist`:**

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const useAuthStore = create(
  // Envolve a store com o middleware `persist`
  persist<AuthState>(
    (set, get) => ({
      // ... seu estado e ações aqui
      isAuthenticated: false,
      user: null,
      // ...
    }),
    {
      name: 'auth-storage', // Nome da chave no armazenamento
      storage: createJSONStorage(() => AsyncStorage), // Define o motor de armazenamento
    }
  )
);
```

Com isso, o estado de autenticação será mantido mesmo que o usuário feche e reabra o aplicativo.

## 5\. Zustand vs. Redux: Qual Escolher?

  * **Zustand:**

      * **Prós:** Extremamente simples, leve, rápido de aprender e com mínimo boilerplate. Ótimo para projetos de todos os tamanhos, especialmente para quem acha Redux complexo.
      * **Contras:** Menos "opinativo", o que pode levar a menos padronização em equipes muito grandes se não houver convenções bem definidas.

  * **Redux:**

      * **Prós:** Arquitetura muito estruturada e previsível, com ferramentas de depuração poderosas (Redux DevTools). Ideal para aplicações muito complexas e equipes grandes que precisam de um fluxo de dados rígido.
      * **Contras:** Verboso, curva de aprendizado mais íngreme e pode ser excessivo para a maioria dos projetos.

## ✅ Conclusão

O **Zustand** é uma alternativa fantástica e moderna no mundo do gerenciamento de estado. Ele oferece o poder de um estado global sem o peso e a complexidade do Redux. Sua simplicidade, performance e flexibilidade o tornam uma escolha excelente para a maioria das aplicações React e React Native, permitindo que os desenvolvedores construam funcionalidades de forma mais rápida e com menos código.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/024-react-native-utilities-part-1.md) 👉

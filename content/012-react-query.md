###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/011-style.md)

# 📘 Pílula de Conhecimento 12 — React Query: Gerenciando o Estado do Servidor

No desenvolvimento React, separamos o estado em duas categorias:

1.  **Estado do Cliente:** Dados que vivem na UI (ex: estado de um modal, tema). Ferramentas como `useState` e Redux são perfeitas para isso.
2.  **Estado do Servidor:** Dados que vêm de uma API. Lidar com isso manualmente envolve gerenciar loading, erros, cache e revalidação.

É para simplificar o **Estado do Servidor** que existe o **TanStack Query** (React Query). Ele não substitui o Redux; ele é uma ferramenta especializada em buscar, armazenar em cache e sincronizar dados de APIs de forma automática e eficiente.

## 1\. Configuração Inicial

Para começar, você precisa criar um "cliente" e disponibilizá-lo para sua aplicação através de um `Provider`.

```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 1. Crie uma instância do cliente
const queryClient = new QueryClient();

const App = () => (
  // 2. Envolva sua aplicação com o Provider
  <QueryClientProvider client={queryClient}>
    {/* Resto da sua aplicação */}
  </QueryClientProvider>
);
```

-----

## 2\. Buscando Dados com `useQuery`

O hook `useQuery` é usado para qualquer operação de busca de dados (requisições GET). Ele gerencia automaticamente o cache, o estado de carregamento e os erros para você.

**Parâmetros Principais:**

  * **`queryKey`**: Uma chave única para identificar essa busca. Geralmente é um array. Se algum valor na chave mudar, o React Query automaticamente busca os dados novamente.
  * **`queryFn`**: A função assíncrona que efetivamente busca os dados e retorna uma promise.

**Valores Retornados:**

  * `data`: Os dados retornados pela sua `queryFn`.
  * `isLoading`: `true` enquanto a primeira busca está em andamento.
  * `isFetching`: `true` sempre que uma busca em background está acontecendo.
  * `isError`: `true` se a busca falhou.
  * `error`: O objeto de erro, caso ocorra.

A grande vantagem: se você sair e voltar para esta tela, o React Query servirá os dados do cache instantaneamente e fará uma busca silenciosa em background para ver se há algo novo.

### Duas Formas de Chamar o `useQuery`

#### Abordagem 1: Objeto de Configuração (Recomendada)

Nesta abordagem, você passa um único objeto com todas as configurações.

```tsx
import { useQuery } from '@tanstack/react-query';
import api from './services/api'; // Sua instância do axios/fetch

function TodosList() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['todos', page, userId], // Chave única para esta query
    queryFn: async () => {
      const response = await api.get('/todos');
      return response.data;
    },// A função de busca
    enabled: !!userId, // Opção: só executa se userId existir
  });

  if (isLoading) {
    return <Text>Carregando...</Text>;
  }

  if (isError) {
    return <Text>Ocorreu um erro!</Text>;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}
```

  * **Vantagens:**
      * **Clareza:** As propriedades nomeadas (`queryKey`, `queryFn`) tornam o código auto-descritivo.
      * **Reatividade Automática:** Se uma variável de estado (como `page`) usada dentro da `queryKey` mudar, o React Query automaticamente refaz a busca. Esta é a principal vantagem.
  * **Desvantagens:**
      * Ligeiramente mais verboso.

#### Abordagem 2: Argumentos Separados

Nesta abordagem, os parâmetros são passados em uma ordem específica.

```tsx
import { useQuery } from '@tanstack/react-query';
import api from './services/api'; // Sua instância do axios/fetch

function TodosList() {
  const { data, isLoading } = useQuery(
    ['todos', page],   // 1º argumento: queryKey
    async () => {
      const response = await api.get('/todos');
      return response.data;
    }, // 2º argumento: queryFn
    { enabled: !!userId } // 3º argumento: objeto de opções
  );

  if (isLoading) {
    return <Text>Carregando...</Text>;
  }

  if (isError) {
    return <Text>Ocorreu um erro!</Text>;
  }

  return (
    <FlatList
      data={data}
      renderItem={({ item }) => <Text>{item.title}</Text>}
      keyExtractor={(item) => item.id}
    />
  );
}
```

  * **Vantagens:**
      * Mais conciso para queries muito simples.
  * **Desvantagens:**
      * Menos explícito (a ordem importa).
      * Considerado um padrão mais antigo; a documentação moderna prioriza a abordagem de objeto.

-----

## 3\. Modificando Dados com `useMutation`

Para operações que alteram dados no servidor (`POST`, `PUT`, `DELETE`), usamos o hook `useMutation`.

Ele não gerencia cache diretamente, mas fornece uma função `mutate` para disparar a operação e callbacks para reagir ao sucesso ou erro.

### Duas Formas de Chamar o `useMutation`

#### Abordagem 1: Objeto de Configuração (Recomendada)

```tsx
import { useMutation } from '@tanstack/react-query';

function AddTodoForm() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return api.post('/todos', newTodo);
    },
    // Callbacks para reagir ao resultado
    onSuccess: () => {
      console.log('Todo criado com sucesso!');
    },
    onError: () => {
      console.error('Falha ao criar todo.');
    },
  });

  const handleSubmit = () => {
    mutation.mutate({ title: 'Nova Tarefa', completed: false });
  };

  return (
    <View>
      <Button
        title="Adicionar Tarefa"
        onPress={handleSubmit}
        disabled={mutation.isPending} // Desabilita o botão durante a mutação
      />
    </View>
  );
}
```

  * **Vantagens:**
      * **Consistência:** Segue o mesmo padrão recomendado do `useQuery`.
      * **Legibilidade:** Propriedades nomeadas são mais claras.
  * **Desvantagens:**
      * Um pouco mais verboso.

#### Abordagem 2: Argumentos Separados

```tsx
import { useMutation } from '@tanstack/react-query';

function AddTodoForm() {
  const mutation = useMutation({
    mutationFn: (newTodo) => {
      return api.post('/todos', newTodo);
    },
    // Callbacks para reagir ao resultado
    onSuccess: () => {
      console.log('Todo criado com sucesso!');
    },
    onError: () => {
      console.error('Falha ao criar todo.');
    },
  });
  const mutation = useMutation(
    (newTodo) => {
      return api.post('/todos', newTodo);
    }, // 1º argumento: mutationFn
    {
      // Callbacks para reagir ao resultado
      onSuccess: () => {
        console.log('Todo criado com sucesso!');
      },
      onError: () => {
        console.error('Falha ao criar todo.');
      },
    } // 2º argumento: objeto de opções
  );

  const handleSubmit = () => {
    mutation.mutate({ title: 'Nova Tarefa', completed: false });
  };

  return (
    <View>
      <Button
        title="Adicionar Tarefa"
        onPress={handleSubmit}
        disabled={mutation.isPending} // Desabilita o botão durante a mutação
      />
    </View>
  );
}
```

  * **Vantagens:**
      * Ligeiramente mais curto.
  * **Desvantagens:**
      * Menos comum e pode parecer menos coeso.

-----

## 4\. Sincronizando o Cache: Callbacks e Ações Manuais

Manter a UI sincronizada após uma mutação é a parte mais importante.

### Callbacks de Mutação

O `useMutation` oferece callbacks poderosos para reagir aos resultados:

  * `onSuccess`: Executado **apenas se a mutação tiver sucesso**. Ideal para invalidar queries, mostrar notificações de sucesso ou redirecionar o usuário.
  * `onError`: Executado **apenas se a mutação falhar**. Perfeito para exibir mensagens de erro.
  * `onSettled`: Executado **ao final da mutação, independentemente de sucesso ou falha**. Ideal para tarefas de "limpeza", como esconder um spinner de carregamento (`setLoading(false)`).

### Ações Manuais com `useQueryClient`

O hook `useQueryClient` dá controle total sobre o cache.

  * `invalidateQueries`: Marca os dados de uma query como "stale" (desatualizados). O React Query irá **buscar os dados novamente em background** na próxima vez que forem necessários, enquanto exibe os dados antigos do cache. Isso resulta em uma **atualização suave**.
  * `resetQueries`: **Remove a query do cache completamente**, revertendo-a ao seu estado inicial. Na próxima vez, a query será executada como se fosse a primeira vez, exibindo o estado de `isLoading`. Isso resulta em uma **atualização "hard reset"**.

**Exemplo Completo com Invalidação:**

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

function TodoApp() {
  const queryClient = useQueryClient(); // 1. Acessa o cliente

  // Busca a lista de todos
  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

  // Cria a mutação para adicionar um novo todo
  const addTodoMutation = useMutation({
    mutationFn: createTodo,
    onSuccess: () => {
      // 2. Em caso de sucesso, invalida a query da lista
      // Isso fará com que a lista seja atualizada automaticamente
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
    onSettled: () => {
      console.log("Mutação finalizada (sucesso ou erro).");
    }
  });

  const handleAddTodo = () => {
    addTodoMutation.mutate({ title: 'Aprender React Query' });
  };
  // ...
}
```

Essa estratégia de **mutação + invalidação** é o padrão ouro para manter a UI sincronizada com o servidor de forma eficiente.

-----

## ✅ Conclusão

React Query muda a forma como pensamos sobre dados em aplicações React. Ele nos liberta de gerenciar manualmente estados de loading, erros e cache de API, permitindo focar na construção da UI.

  * **Não é um substituto do Redux:** Eles são ferramentas para problemas diferentes. React Query gerencia o **estado do servidor**, enquanto Redux e outras ferramentas gerenciam o **estado do cliente**.
  * **Performance:** O cache inteligente faz com que as aplicações se sintam muito mais rápidas e responsivas.
  * **Código mais simples:** Reduz drasticamente a quantidade de código boilerplate que normalmente escrevemos para lidar com dados assíncronos.

Para a maioria das aplicações que consomem APIs, adotar o React Query é uma das melhores decisões para aumentar a produtividade e a qualidade da experiência do usuário em aplicações que consomem APIs.

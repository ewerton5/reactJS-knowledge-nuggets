## 🚀 **Oficina Prática: O Fim do Boilerplate com React Query**

Olá, equipe! Chegou a hora de aposentar os infinitos `useState(false)` para `isLoading` e `try/catch` espalhados pelos componentes. Vamos praticar o gerenciamento de **Estado do Servidor** usando o TanStack Query.

### **Instruções de Setup:**

1. Assumam que o pacote `@tanstack/react-query` está instalado.
2. Considerem que temos uma função simulada `api.get('/produtos')` e `api.post('/produtos', dados)`.

---

### **🏗️ Exercício 1: Setup e Separação de Estados (5 minutos)**

**Objetivo:** Configurar o provedor global e entender a diferença entre Estado do Cliente e Estado do Servidor.

**Tarefa:**
1. Complete o código do `App.tsx` para fornecer o contexto do React Query para a aplicação.
2. Responda mentalmente: Onde você guardaria a informação de "Tema Escuro/Claro" e onde guardaria a "Lista de Usuários Cadastrados"?

```tsx
// App.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelaProdutos } from './TelaProdutos';

// 1. Instancie o cliente aqui
const queryClient = ???;

export default function App() {
  return (
    // 2. Envolva a aplicação com o Provider
    <QueryClientProvider client={???}>
      <TelaProdutos />
    </QueryClientProvider>
  );
}

```

**Pontos para discussão:**

* Se o Redux já gerencia o estado global, por que a pílula diz que o React Query **não é** um substituto do Redux, mas sim uma ferramenta para problemas diferentes?

---

### **🔍 Exercício 2: O Poder do `useQuery` (10 minutos)**

**Objetivo:** Substituir a dupla `useEffect` + `useState` por uma única chamada declarativa.

**Cenário:** Precisamos buscar uma lista de produtos na montagem do componente.

**Tarefa:** Complete o hook `useQuery` usando a **Abordagem 1 (Objeto de Configuração)** recomendada na pílula.

```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export function ListaProdutos() {
  // 1. Extraia data, isLoading e isError do hook
  const { ??? } = useQuery({
    // 2. Defina uma chave única em formato de array
    queryKey: [???], 
    // 3. Passe a função que busca os dados
    queryFn: async () => {
      const response = await api.get('/produtos');
      return response.data;
    }
  });

  // 4. Trate os estados de carregamento e erro
  if (???) return <Text>Carregando produtos...</Text>;
  if (???) return <Text>Deu ruim na busca!</Text>;

  return (
    <FlatList 
      data={data} 
      renderItem={({ item }) => <Text>{item.nome}</Text>} 
    />
  );
}

```

**Pontos para discussão:**

* O que acontece se o usuário sair dessa tela (ir para o Perfil, por exemplo) e depois voltar para a `ListaProdutos`? A tela vai mostrar "Carregando produtos..." de novo ou vai mostrar os dados instantaneamente?

---

### **🔑 Exercício 3: A Magia do `queryKey` (Dinâmico) (10 minutos)**

**Objetivo:** Usar variáveis na `queryKey` para refazer buscas automaticamente (Reatividade Automática).

**Cenário:** Agora nossa lista tem um filtro de categoria (ex: "eletronicos", "roupas"). Quando a categoria muda, queremos buscar os produtos correspondentes.

**Tarefa:** Modifique a `queryKey` para que o React Query saiba que deve refazer a busca sempre que a `categoria` mudar.

```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function ListaFiltrada() {
  const [categoria, setCategoria] = useState('eletronicos');

  const { data, isLoading } = useQuery({
    // 1. Como avisar ao React Query que essa busca depende da 'categoria'?
    queryKey: ['produtos', ???], 
    
    queryFn: async () => {
      // Passamos a categoria como parâmetro para a API
      const response = await api.get(`/produtos?categoria=${categoria}`);
      return response.data;
    }
  });

  return (
    // ... renderização dos botões de filtro e da lista
  );
}

```

**Pontos para discussão:**

* No React tradicional, teríamos que colocar a `categoria` no array de dependências de um `useEffect`. Por que a abordagem do `queryKey` em array é considerada mais segura e poderosa?

---

### **✍️ Exercício 4: Alterando Dados com `useMutation` (15 minutos)**

**Objetivo:** Criar um novo dado no servidor e gerenciar o estado do botão de envio.

**Cenário:** Um formulário para adicionar um novo produto.

**Tarefa:** Configure o `useMutation` com a função de POST e desabilite o botão enquanto a requisição estiver acontecendo.

```tsx
import { useMutation } from '@tanstack/react-query';
import { api } from './api';

export function NovoProdutoForm() {
  // 1. Configure a mutation usando a abordagem de objeto
  const mutation = useMutation({
    mutationFn: (novoProduto) => {
      return api.post('/produtos', novoProduto);
    },
    onSuccess: () => console.log('Cadastrado!'),
    onError: () => console.log('Erro ao cadastrar.')
  });

  const handleSalvar = () => {
    // 2. Dispare a mutação passando os dados
    mutation.???({ nome: 'Teclado Mecânico', preco: 300 });
  };

  return (
    <Button 
      title="Salvar Produto" 
      onPress={handleSalvar} 
      // 3. Desabilite o botão durante o loading da mutação (não use isLoading, use a prop correta para mutations)
      disabled={mutation.???} 
    />
  );
}

```

**Pontos para discussão:**

* Por que o `useMutation` **não** precisa de uma `queryKey` como o `useQuery`?
* Qual é a diferença entre os callbacks `onSuccess` e `onSettled`?

---

### **🔄 Exercício 5: O Padrão Ouro (Mutação + Invalidação) (10 minutos)**

**Objetivo:** Sincronizar a UI com o servidor após uma alteração, forçando a lista a se atualizar sozinha.

**Cenário:** No exercício anterior, cadastramos o "Teclado Mecânico", mas a lista da tela inicial não se atualizou porque os dados antigos ainda estão no cache.

**Tarefa:** Use o `queryClient` para invalidar o cache da lista de produtos assim que a mutação der sucesso.

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function NovoProdutoForm() {
  // 1. Acesse o client do React Query
  const queryClient = ???;

  const mutation = useMutation({
    mutationFn: (novoProduto) => api.post('/produtos', novoProduto),
    
    onSuccess: () => {
      // 2. O POST deu certo. Como dizemos ao React Query: 
      // "Ei, os dados da chave ['produtos'] estão velhos, busque de novo!" ?
      queryClient.???({ queryKey: ['produtos'] });
    }
  });

  // ...
}

```

**Pontos para discussão:**

* A pílula menciona `invalidateQueries` e `resetQueries`. Por que o `invalidateQueries` causa uma "atualização suave" (o usuário continua vendo a lista velha até a nova chegar) enquanto o `resetQueries` causaria um "hard reset" (a tela piscaria para o estado de loading)?

---

Bom código! Vamos ver quem consegue se libertar do `useEffect` de uma vez por todas.

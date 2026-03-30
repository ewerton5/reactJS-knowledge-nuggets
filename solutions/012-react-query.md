### **Soluções dos exercícios: Pílula de Conhecimento 12 em Prática**

Esta pílula revolucionou a forma de lidar com requisições, introduzindo a separação entre **Estado do Cliente** (UI/Local) e **Estado do Servidor** (API/Cache).

---

#### **🏗️ Exercício 1: Setup e Separação de Estados**

**Objetivo:** Configurar o provedor global do React Query e entender o que vai para o cache e o que fica no estado local.

**Solução em Código:**
```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TelaProdutos } from './TelaProdutos';

// 1. Instanciamos o cliente do React Query
const queryClient = new QueryClient();

export default function App() {
  return (
    // 2. Envolvemos a aplicação com o Provider, passando o cliente
    <QueryClientProvider client={queryClient}>
      <TelaProdutos />
    </QueryClientProvider>
  );
}
```

**Pontos de Discussão Detalhados:**
* **Tema (Dark/Light) vs. Lista de Usuários:** A equipe concluiu que o Tema é um **Estado do Cliente** (deve ser salvo localmente, ex: `AsyncStorage`, para estar disponível assim que o app abrir). Já a Lista de Usuários é um **Estado do Servidor** (perfeito para o React Query cachear na memória RAM e otimizar navegações).
* **React Query substitui o Redux?** Não. O Ewerton e a Nátaly explicaram que eles resolvem problemas diferentes. O Redux é excelente para o estado da interface (e pode salvar um grande bloco JSON no AsyncStorage de forma otimizada), enquanto o React Query foca exclusivamente em sincronizar e cachear dados que vêm da API.

---

#### **🔍 Exercício 2: O Poder do `useQuery`**

**Objetivo:** Substituir `useEffect` e variáveis manuais (`isLoading`, `data`, `error`) por uma única chamada declarativa.

**Solução em Código:**
```tsx
import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export function ListaProdutos() {
  // 1. Extraímos os três estados essenciais
  const { data, isLoading, isError } = useQuery({
    // 2. Chave única para identificar este cache
    queryKey: ['produtos'], 
    // 3. Função que busca os dados
    queryFn: async () => {
      const response = await api.get('/produtos');
      return response.data;
    }
  });

  if (isLoading) return <Text>Carregando produtos...</Text>;
  if (isError) return <Text>Deu ruim na busca!</Text>;

  return <FlatList data={data} renderItem={({ item }) => <Text>{item.nome}</Text>} />;
}
```


**Pontos de Discussão Detalhados:**
* **A Mágica do Cache:** O Mateus acertou em cheio: se o usuário sair da tela e voltar, não verá a tela de "Carregando" novamente. Os dados aparecem **instantaneamente**, pois o React Query os busca da memória RAM e faz apenas uma revalidação silenciosa em background.
* **Múltiplas Contas (Bonus):** O Ewerton perguntou como lidar com multi-contas (tipo Instagram). A solução do Gean foi perfeita: adicionar o ID à chave `['produtos', userId]`. O React Query cria "gavetas" separadas na memória RAM para cada usuário, isolando o cache.

---

#### **🔑 Exercício 3: A Magia da `queryKey` Dinâmica**

**Objetivo:** Automatizar a revalidação de dados ao alterar filtros, sem precisar de `useEffect`.

**Solução em Código:**
```tsx
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

export function ListaFiltrada() {
  const [categoria, setCategoria] = useState('eletronicos');

  const { data, isLoading } = useQuery({
    // A queryKey "observa" a variável. Mudou a categoria, ele refaz a busca.
    queryKey: ['produtos', categoria], 
    
    queryFn: async () => {
      const response = await api.get(`/produtos?categoria=${categoria}`);
      return response.data;
    }
  });

  // ...
}
```

**Pontos de Discussão Detalhados:**
* **Por que é melhor que `useEffect`?**
    1. **Sincronia e Cache:** Se você voltar para um filtro anterior ("eletrônicos"), ele não gasta rede de novo; entrega do cache imediatamente.
    2. **Race Conditions (O Ponto de Ouro):** O Leonardo destacou que o React Query previne condições de corrida. Se você alternar rapidamente entre filtros no `useEffect`, a tela pode bugar exibindo a resposta atrasada da requisição anterior. O React Query cancela ou ignora requisições velhas automaticamente.



---

#### **✍️ Exercício 4: Alterando Dados com `useMutation`**

**Objetivo:** Criar um novo dado no servidor e lidar com o estado de envio e botões.

**Solução em Código:**
```tsx
import { useMutation } from '@tanstack/react-query';
import { api } from './api';

export function NovoProdutoForm() {
  const mutation = useMutation({
    mutationFn: (novoProduto) => api.post('/produtos', novoProduto),
    onSuccess: () => console.log('Sucesso!'),
    onError: () => console.log('Erro!'),
    onSettled: () => console.log('Finalizou (com erro ou sucesso)!')
  });

  return (
    <Button 
      title="Salvar" 
      onPress={() => mutation.mutate({ nome: 'Teclado Mecânico', preco: 300 })} 
      // Propriedade correta para verificar carregamento em mutações:
      disabled={mutation.isPending} 
    />
  );
}
```

**Pontos de Discussão Detalhados:**
* **Por que não tem `queryKey`?** A Nátaly explicou que mutações não armazenam os dados retornados no cache. Elas servem para executar ações (criar, editar, deletar), não para guardar consultas, por isso não precisam de uma chave de memória.
* **Os Callbacks e `onSettled`:** O Mateus definiu o `onSettled` como a ação executada após o término, independentemente do resultado. O Ewerton complementou brilhantemente com o conceito de **Optimistic Updates** (Atualização Otimista): você pode mudar um *Switch* na tela imediatamente antes do servidor responder. Se o `onError` ocorrer, você reverte o *Switch*. O `onSettled` limpa os *loadings* finais.

---

#### **🔄 Exercício 5: O Padrão Ouro (Mutação + Invalidação)**

**Objetivo:** Atualizar a UI automaticamente após uma mutação bem-sucedida.

**Solução em Código:**
```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';

export function NovoProdutoForm() {
  // 1. Acessamos a instância do client
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (novoProduto) => api.post('/produtos', novoProduto),
    
    onSuccess: () => {
      // 2. Avisamos ao React Query que a chave ['produtos'] está velha!
      queryClient.invalidateQueries({ queryKey: ['produtos'] });
    }
  });

  // ...
}
```

**Pontos de Discussão Detalhados:**
* **`invalidateQueries` vs. `resetQueries`:**
    * A Nátaly e o Ewerton esclareceram perfeitamente: o **`invalidateQueries`** apenas marca o cache da memória RAM como "desatualizado". Ele continua mostrando a lista antiga na tela enquanto busca a nova em background. O resultado é uma **atualização suave**, sem piscar a tela.
    * Já o **`resetQueries`** apaga brutalmente o cache da memória RAM. Se o usuário estiver na tela, ela vai ficar em branco e mostrar o *spinner* de carregamento (`isLoading: true`), causando uma experiência menos fluida.

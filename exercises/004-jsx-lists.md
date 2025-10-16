### 🚀 **Oficina Prática: Renderizando Listas com Performance Profissional**

Olá, equipe\! A pílula de hoje abordou um dos tópicos de performance mais importantes no desenvolvimento: como renderizar listas de dados de forma eficiente. Os exercícios abaixo foram criados para solidificar nosso conhecimento sobre a prop `key`, o uso do `.map()` e, principalmente, o poder da `FlatList` no React Native.

### **Instruções de Setup:**

1.  Os exercícios são conceituais e baseados em trechos de código. Você pode pensar sobre eles ou, se preferir, criar pequenos componentes em um ambiente React/React Native (CodeSandbox, StackBlitz, Expo Snack) para testar as ideias.
2.  Foco total em entender o **"porquê"** de cada resposta.

-----

### **🔁 Exercício 1: O `.map()` e a `key` Fundamental (10 minutos)**

**Objetivo:** Entender a sintaxe básica do `.map()` e a importância de fornecer uma `key` estável e única.

**Tarefa:** Analise o código abaixo que renderiza uma lista de produtos.

```jsx
const produtos = [
  { id: 'p1', nome: 'Notebook Gamer' },
  { id: 'p2', nome: 'Mouse Vertical' },
  { id: 'p3', nome: 'Teclado Mecânico' }
];

function ListaDeProdutos() {
  return (
    <ul>
      {produtos.map((produto, index) => (
        <li key={index}> 
          {produto.nome}
        </li>
      ))}
    </ul>
  );
}
```

Há um antipadrão (má prática) perigoso neste código. Qual é ele e por que é considerado um problema, especialmente se a lista de produtos pudesse ser reordenada ou se um item fosse adicionado no início? Qual seria a forma correta de definir a `key` neste caso?

**Pontos para discussão:**

  * O que o React usa a `key` para fazer durante o processo de reconciliação (atualização da UI)?
  * Se um novo produto fosse adicionado no início do array, o que aconteceria com os índices de todos os outros itens? Como isso confundiria o React?

-----

### **📱 Exercício 2: Entendendo a Estrutura da `FlatList` (10 minutos)**

**Objetivo:** Familiarizar-se com as props essenciais da `FlatList` e sua função.

**Tarefa:** Você recebeu um array de dados de usuários:

```javascript
const usuarios = [
  { userId: 1, name: 'Alice' },
  { userId: 2, name: 'Bob' },
  { userId: 3, name: 'Charlie' }
];
```

Complete o componente `<ListaDeUsuarios />` abaixo, preenchendo as props `data`, `renderItem` e `keyExtractor` para que ele renderize corretamente uma lista com os nomes dos usuários.

```jsx
import { FlatList, Text, View } from 'react-native';

const ListaDeUsuarios = () => {
  const usuarios = [
    { userId: 1, name: 'Alice' },
    { userId: 2, name: 'Bob' },
    { userId: 3, name: 'Charlie' }
  ];
  
  // Crie um componente para o item da lista
  const UserItem = ({ nome }) => (
    <View style={{ padding: 10 }}>
      <Text>{nome}</Text>
    </View>
  );

  return (
    <FlatList
      data={/* O que vai aqui? */}
      renderItem={/* Como você renderiza o UserItem para cada usuário? */}
      keyExtractor={/* Como você extrai uma key única e estável de cada usuário? */}
    />
  );
};
```

**Pontos para discussão:**

  * O que é "virtualização" e por que ela torna a `FlatList` muito mais performática que o `.map()` para listas longas?
  * Por que a `FlatList` tem uma prop `keyExtractor` separada em vez de apenas usar a `key` no componente renderizado, como no `.map()`?

-----

### **🚀 Exercício 3: Otimizando com `useCallback` (10 minutos)**

**Objetivo:** Entender como e por que `useCallback` previne re-renderizações desnecessárias nos itens de uma `FlatList`.

**Tarefa:** O componente `FeedDeNoticias` abaixo funciona, mas tem um problema de performance sutil. Toda vez que o estado `filtroAtivo` muda (por exemplo, ao clicar em um botão de filtro), a função `renderizaPost` é recriada, o que pode fazer com que todos os componentes `<PostCard />` visíveis sejam re-renderizados, mesmo que seus dados não tenham mudado.

Refatore o código para usar `useCallback` e memoizar a função `renderizaPost`, resolvendo o problema.

**Código original:**

```jsx
const FeedDeNoticias = ({ posts }) => {
  const [filtroAtivo, setFiltroAtivo] = useState(false);

  const renderizaPost = ({ item }) => {
    return <PostCard post={item} />;
  };

  return (
    <View>
      <Button title="Alternar Filtro" onPress={() => setFiltroAtivo(!filtroAtivo)} />
      <FlatList
        data={posts}
        renderItem={renderizaPost}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};
```

**Pontos para discussão:**

  * Em JavaScript, `() => {} === () => {}` é `true` ou `false`? Como isso se relaciona com a necessidade do `useCallback` aqui?
  * O `useCallback` sozinho resolve todo o problema? O que mais seria necessário no componente `<PostCard />` para que a otimização seja 100% eficaz? (Dica: `React.memo`).

-----

### **⚙️ Exercício 4: Fine-Tuning de Performance (15 minutos)**

**Objetivo:** Identificar a otimização de performance mais impactante para uma `FlatList` com itens de tamanho fixo.

**Tarefa:** Você está construindo uma galeria de fotos onde cada item da lista é um card quadrado de `120x120` pixels (incluindo margens). O scroll da `FlatList` parece um pouco "engasgado" em dispositivos mais lentos, especialmente ao rolar rapidamente.

Analisando as props de otimização da pílula (`initialNumToRender`, `maxToRenderPerBatch`, `windowSize`, `getItemLayout`), qual delas forneceria a melhoria de performance mais significativa para este cenário específico? Como você a implementaria no código?

```jsx
const ITEM_HEIGHT = 120; // A altura de cada item é fixa e conhecida

<FlatList
  data={photos}
  renderItem={renderPhoto}
  keyExtractor={(item) => item.id}
  // Qual prop de otimização poderosa você adicionaria aqui?
/>
```

**Pontos para discussão:**

  * O que a `FlatList` precisa fazer por padrão para saber onde posicionar cada item?
  * Como a prop `getItemLayout` elimina essa necessidade e melhora a performance do scroll?

-----

### **🧩 Exercício 5: Estruturando a Lista (10 minutos)**

**Objetivo:** Usar os componentes de apoio da `FlatList` para construir uma UI de lista mais completa e amigável.

**Tarefa:** Crie um componente `ListaDeContatos` que atenda aos seguintes requisitos, utilizando as props corretas da `FlatList`:

1.  Exiba um título `<h2>Meus Contatos</h2>` que role junto com a lista.
2.  Se a lista de contatos estiver vazia, exiba uma mensagem como "Nenhum contato encontrado.".
3.  Renderize uma linha cinza fina (`<View style={{ height: 1, backgroundColor: '#CCC' }} />`) entre cada contato.
4.  No final da lista, exiba um indicador de carregamento (`<ActivityIndicator />`) se uma prop `carregandoMais` for `true`.

Você não precisa escrever o componente inteiro, apenas identificar qual prop da `FlatList` seria usada para cada um dos 4 requisitos acima.

**Pontos para discussão:**

  * Por que usar essas props (`ListHeaderComponent`, `ListEmptyComponent`, etc.) é melhor do que tentar implementar a mesma lógica com `if/else` fora da `FlatList`?
  * Qual é o caso de uso mais comum para a `ListFooterComponent` em aplicações do mundo real?

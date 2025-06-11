###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/003-conditional-rendering.md)

# 📘 Pílula de Conhecimento 04 — Listas em JSX, a prop `key` e a performance da `FlatList`

Exibir coleções de dados — seja um feed de notícias, um catálogo de produtos ou uma lista de mensagens — é uma das tarefas mais comuns no desenvolvimento de UIs. A forma como renderizamos essas listas tem um impacto direto e massivo na performance da aplicação, especialmente em dispositivos móveis.

---

## 🔁 A Abordagem Fundamental: Renderizando Listas com `.map()`

A maneira mais básica de renderizar uma lista em React é usar a função `.map()` do JavaScript para transformar um array de dados em um array de elementos JSX.

```jsx
const frutas = ['Banana', 'Maçã', 'Laranja'];

return (
  <View>
    {frutas.map((fruta) => (
      <Text key={fruta}>{fruta}</Text>
    ))}
  </View>
);
```

Essa abordagem é simples e funciona bem para listas pequenas e estáticas. No entanto, ela tem uma grande desvantagem: **renderiza todos os itens do array de uma só vez**, o que pode causar sérios problemas de performance com listas longas.

---

### 🗝️ A Peça-Chave da Performance: A Prop `key`

Ao renderizar uma lista, o React precisa de uma forma de identificar cada item de maneira única para otimizar as atualizações. É aqui que entra a prop `key`.

Pense na `key` como o "RG" de cada elemento na lista. Ela permite que o algoritmo de reconciliação (Virtual DOM) saiba exatamente qual item foi adicionado, modificado ou removido, **atualizando apenas aquele item específico** em vez de re-renderizar a lista inteira.

A `key` deve ser uma string ou número que seja:
* **Única** entre os irmãos da lista.
* **Estável e Previsível:** não deve mudar entre renderizações.

```jsx
{usuarios.map((user) => (
  <Text key={user.id}>{user.nome}</Text> // user.id é uma key perfeita!
))}
```

🛑 **Nunca use o índice do array (`index`) como `key`!**
Usar `map((item, index) => <Component key={index} />)` é uma má prática perigosa. Se a ordem dos itens na lista mudar (por exemplo, ao adicionar um item no início ou ao ordenar a lista), os índices mudam, confundindo o React. Isso pode levar a bugs de renderização, dados incorretos sendo exibidos e comportamento imprevisível da UI.

---

## 📱 A Solução Profissional no React Native: `<FlatList />`

Para resolver o problema de performance do `.map()`, o React Native oferece o componente `<FlatList />`. Sua principal vantagem é a **virtualização**: ele renderiza apenas os itens que estão visíveis na tela (mais um pequeno buffer), mantendo o consumo de memória e o uso de CPU baixos, independentemente do tamanho da lista.

### 🧱 Estrutura Básica

```jsx
import { FlatList } from 'react-native';

<FlatList
  data={dados} // O array de dados
  renderItem={({ item }) => <MeuCard item={item} />} // Função que renderiza cada item
  keyExtractor={(item) => item.id.toString()} // Função que extrai a key única
/>
```
A `FlatList` abstrai o loop de renderização, oferecendo uma API declarativa e altamente otimizada.

---

### 🚀 Otimizando a `FlatList`

Para extrair o máximo de performance, algumas práticas são essenciais.

#### `useCallback` para Memoizar Funções
A cada renderização do componente pai, funções como `renderItem` são recriadas. Isso pode fazer com que os itens da lista sejam re-renderizados desnecessariamente, mesmo que seus dados não tenham mudado. Usar `useCallback` memoiza a função, garantindo que ela só seja recriada se suas dependências mudarem.

```jsx
const renderItem = useCallback(({ item }) => {
  return <MeuCard info={item} />;
}, []); // Array de dependências vazio se a função não depende de props/estado

<FlatList
  data={dados}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
/>
```

#### Props para Fine-Tuning de Performance
A `FlatList` possui um arsenal de props para ajustar seu comportamento:

| Prop                  | Função                                                                         |
| --------------------- | ------------------------------------------------------------------------------ |
| `initialNumToRender`  | Define quantos itens renderizar no primeiro carregamento.                      |
| `maxToRenderPerBatch` | Número de itens renderizados por lote durante o scroll.                        |
| `windowSize`          | Define o "tamanho da janela" de itens renderizados fora da área visível.       |
| `getItemLayout`       | Informa à `FlatList` o tamanho fixo dos itens, **evitando cálculos de medição**.|

`getItemLayout` é uma das otimizações mais impactantes se seus itens tiverem altura fixa.

```jsx
<FlatList
  // ...outras props
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  getItemLayout={(data, index) => (
    { length: 80, offset: 80 * index, index } // length = altura do item
  )}
/>
```

---

### 🧩 Componentes de Apoio da `FlatList`

A `FlatList` também vem com props para renderizar componentes comuns em listas:

* `ListHeaderComponent`: Um cabeçalho no topo da lista.
* `ListFooterComponent`: Um rodapé no final da lista (ótimo para loaders de paginação).
* `ItemSeparatorComponent`: Um componente para ser renderizado entre cada item (ex: uma linha divisória).
* `ListEmptyComponent`: Um componente para ser exibido quando o array `data` está vazio.

---

### 🧰 O Ecossistema de Listas

A `FlatList` é a base para outros componentes de lista mais especializados:

* **`SectionList`**: Nativa do React Native, para listas agrupadas por seções (ex: agenda de contatos).
* **`DraggableFlatList`**: Para listas reordenáveis com gestos de arrastar e soltar.
* **`FlashList` (da Shopify)**: Uma alternativa super otimizada à `FlatList`, que reescreve a lógica de renderização para ser ainda mais rápida. É considerada o novo padrão para listas de alta performance.

---

### ✅ Conclusão

No React Native, a escolha é clara: **use `FlatList` (ou `FlashList`) por padrão para qualquer lista de dados dinâmica.** O uso de `.map()` deve ser a exceção, reservado apenas para listas muito pequenas e estáticas (ex: 5-10 itens).

Investir tempo na configuração correta da `FlatList` — usando uma `key` estável, memoizando `renderItem` com `useCallback` e ajustando as props de otimização — é um dos melhores retornos de investimento para garantir uma aplicação mobile fluida, rápida e profissional.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/005-react-context-api.md) 👉

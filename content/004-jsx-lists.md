###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/003-conditional-rendering.md)

# 📘 Pílula de Conhecimento 04 — Listas em JSX, a prop `key`, `FlatList` e performance no React Native

## 🔁 Renderizando listas no JSX

No React, é comum representar listas de elementos a partir de arrays. A estrutura mais simples é usando `.map()` diretamente no JSX:

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

A depender do `flexDirection`, os elementos são renderizados **em linha (row)** ou **em coluna (column)**.

---

### 🗝️ A prop `key` — identificador essencial

A prop `key` serve para que o **Virtual DOM** saiba **qual item deve ser atualizado** sem renderizar a lista inteira novamente. Ela deve ser **única, estável e previsível**.

```jsx
{usuarios.map((user) => (
  <Text key={user.id}>{user.nome}</Text>
))}
```

⚠️ **Evite usar o `index`** como `key`, especialmente em listas ordenáveis (`sort`, `reverse`, etc.). Isso pode causar bugs visuais, duplicações ou perdas de elementos na tela.

---

## 📱 FlatList no React Native — performance é prioridade

Diferente de `.map()`, que renderiza **todos os elementos de uma vez**, a `FlatList` só renderiza os visíveis na tela. Isso evita sobrecarga de memória e melhora muito a performance em **apps mobile**.

### 🧱 Estrutura básica:

```jsx
<FlatList
  data={dados}
  renderItem={({ item }) => <MeuCard item={item} />}
  keyExtractor={(item) => item.id.toString()}
/>
```

A `FlatList` substitui o uso do `.map()` no React Native por uma abordagem mais controlada e performática.

---

### ⚙️ `keyExtractor` em vez da `key` direta

Como a `FlatList` **não usa JSX diretamente** (ela delega a renderização internamente), você deve passar a chave única via `keyExtractor`:

```jsx
<FlatList
  data={usuarios}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => <Text>{item.nome}</Text>}
/>
```

---

### 🚀 Otimizando a `FlatList` com `useCallback`

Para evitar re-renderizações desnecessárias dos componentes internos da lista, use o hook `useCallback`. Isso é indicado **especialmente para**:

* `renderItem`
* `ListHeaderComponent`
* `ListFooterComponent`

```jsx
const renderItem = useCallback(({ item }) => {
  return <MeuCard info={item} />;
}, [/* deps */]);

const header = useCallback(() => <Text>🔝 Cabeçalho</Text>, []);
const footer = useCallback(() => <Text>🔚 Rodapé</Text>, []);

<FlatList
  data={dados}
  keyExtractor={(item) => item.id.toString()}
  renderItem={renderItem}
  ListHeaderComponent={header}
  ListFooterComponent={footer}
/>
```

Sem isso, cada mudança de estado pode forçar re-renderizações desnecessárias e quebrar a performance da `FlatList`.

---

### ⚙️ Props de otimização

A `FlatList` possui diversas props pensadas para tunar o desempenho:

| Prop                  | Função                                                                |
| --------------------- | --------------------------------------------------------------------- |
| `initialNumToRender`  | Quantos itens serão renderizados inicialmente                         |
| `maxToRenderPerBatch` | Quantos itens serão renderizados por lote (batch)                     |
| `windowSize`          | Define quantas "telas" acima/abaixo do viewport serão renderizadas    |
| `getItemLayout`       | Retorna altura ou largura fixa dos itens, evitando medições dinâmicas |

📌 Exemplo com otimização:

```jsx
<FlatList
  data={itens}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={5}
  getItemLayout={(data, index) => (
    { length: 80, offset: 80 * index, index }
  )}
/>
```

> `getItemLayout` é excelente quando seus itens têm tamanho fixo. Isso evita cálculos dinâmicos e melhora muito o scroll.

---

### 🧩 Componentes adicionais úteis

* `ListHeaderComponent`: renderiza um elemento acima da lista (scrolla junto)
* `ListFooterComponent`: renderiza um elemento abaixo da lista (scrolla junto)
* `ItemSeparatorComponent`: usado para renderizar separadores entre os itens
* `ListEmptyComponent`: renderiza um fallback quando `data.length === 0`

```jsx
<FlatList
  data={itens}
  renderItem={renderItem}
  keyExtractor={(item) => item.id.toString()}
  ListEmptyComponent={<Text>Nenhum item encontrado.</Text>}
  ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#ccc' }} />}
/>
```

---

### 🧰 Outras listas baseadas em `FlatList`

* **`SectionList`**: ideal para listas agrupadas por seção (ex: contatos por letra)
* **`DraggableFlatList`**: permite reordenar itens com `drag and drop`
* **`SwipeListView`**: adiciona ações ao deslizar (ex: deletar)
* **`FlashList` (Shopify)**: performance extrema para listas gigantes

Essas bibliotecas aproveitam a base da `FlatList`, mas adicionam funcionalidades específicas.

---

### ✅ Conclusão

Use `FlatList` sempre que lidar com listas no React Native. Evite `.map()` diretamente em elementos grandes. A `FlatList` foi feita **pensando em performance**, e usar bem suas props e boas práticas pode evitar dores de cabeça com lentidão, travamentos e consumo excessivo de memória.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/005-react-context-api.md) 👉

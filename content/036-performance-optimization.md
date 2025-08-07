###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/035-parallel-development.md)

# 📘 Pílula de Conhecimento 36 — Otimização de Performance em React

Embora o React seja performático por padrão, aplicações complexas podem sofrer com lentidão, carregamentos demorados e "engasgos" na interface. Felizmente, o ecossistema React oferece um conjunto de ferramentas poderosas para diagnosticar e resolver esses gargalos, garantindo uma experiência de usuário fluida e responsiva.

## 1\. `React.lazy` e `Suspense`: Carregamento Sob Demanda (Code-Splitting)

**O Problema:** Por padrão, todos os componentes da sua aplicação são incluídos no "bundle" inicial de JavaScript. Se você tiver componentes muito pesados (com bibliotecas grandes) que não são exibidos na tela inicial, eles ainda assim estão aumentando o tempo de carregamento do seu app.

**A Solução:** O **`React.lazy`** permite "dividir o código" (code-splitting), fazendo com que um componente seja carregado sob demanda, apenas quando ele for realmente necessário. O **`<Suspense>`** é um componente que exibe uma UI de fallback (como um loading) enquanto o componente "preguiçoso" está sendo carregado.

  * **Caso de Uso:** Um modal de chamada de vídeo que usa bibliotecas pesadas. Ele só deve ser carregado quando o usuário clicar no botão para iniciar a chamada, e não no carregamento inicial do app.

**Exemplo:**

```tsx
import React, { lazy, Suspense } from 'react';
import { View, Button, ActivityIndicator } from 'react-native';

// 1. Importa o componente pesado usando React.lazy
const VideoCallModal = lazy(() => import('./components/VideoCallModal'));

const HomeScreen = () => {
  const [isModalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <Button title="Iniciar Chamada" onPress={() => setModalVisible(true)} />
      
      {isModalVisible && (
        // 2. Envolve o componente "preguiçoso" com o Suspense
        <Suspense fallback={<ActivityIndicator size="large" />}>
          <VideoCallModal onClose={() => setModalVisible(false)} />
        </Suspense>
      )}
    </View>
  );
};
```

-----

## 2\. Otimizando Listas Grandes com `FlatList`

**O Problema:** Renderizar listas com centenas ou milhares de itens complexos pode consumir muita memória e deixar o scroll lento e "engasgado".

**A Solução:** A `FlatList` possui props de otimização para controlar como e quando os itens são renderizados.

  * **Principais Props de Otimização:**
      * **`initialNumToRender`**: Número de itens a serem renderizados no carregamento inicial.
      * **`maxToRenderPerBatch`**: Número de itens a serem renderizados por lote durante o scroll.
      * **`windowSize`**: Define o "tamanho da janela" de itens renderizados fora da área visível. Um valor maior melhora a percepção do scroll, mas consome mais memória.
      * **`getItemLayout`**: A otimização mais poderosa para listas com itens de **altura fixa**. Ao fornecer o tamanho exato de cada item, você permite que a `FlatList` pule cálculos de layout complexos, tornando o scroll muito mais rápido.

**Exemplo:**

```tsx
<FlatList
  data={longaListaDeDados}
  initialNumToRender={10}
  maxToRenderPerBatch={5}
  windowSize={11}
  getItemLayout={(data, index) => (
    // Se cada item tem 80 de altura
    { length: 80, offset: 80 * index, index }
  )}
  renderItem={({ item }) => <MeuItemDeLista item={item} />}
/>
```

-----

## 3\. Memoização: Evitando Re-renderizações Desnecessárias

Memoização é a técnica de armazenar em cache o resultado de uma operação para evitar re-executá-la desnecessariamente.

### `React.memo` - Para Componentes

Envolve um componente funcional e impede que ele seja re-renderizado se suas `props` não tiverem mudado.

### `useCallback` - Para Funções

Retorna uma versão "memoizada" de uma função, que só é recriada se uma de suas dependências mudar. É crucial para passar funções como props para componentes filhos memoizados com `React.memo`.

### `useMemo` - Para Valores Calculados

Memoriza o **resultado** de uma função cara. A função só é re-executada se uma de suas dependências mudar.

**Exemplo Combinado:**

```tsx
import React, { memo, useCallback, useState, useMemo } from 'react';

// 1. O filho é memoizado, só re-renderiza se as props mudarem.
const ItemBotao = memo(({ onPress, title }) => {
  console.log(`Renderizando botão: ${title}`);
  return <Button title={title} onPress={onPress} />;
});

const ParentComponent = () => {
  const [count, setCount] = useState(0);

  // 2. A função `handlePress` é memoizada com useCallback.
  // Ela não será recriada a cada render do ParentComponent.
  const handlePress = useCallback(() => {
    console.log("Botão clicado!");
  }, []);
  
  // 3. Este cálculo caro só será re-executado se 'count' mudar.
  const calculoCaro = useMemo(() => {
    // ...operação pesada...
    return count * 1000;
  }, [count]);

  return (
    <View>
      <Button title="Re-renderizar Pai" onPress={() => setCount(c => c + 1)} />
      {/* Como `handlePress` é estável, o ItemBotao não irá re-renderizar
          quando o componente pai for atualizado pelo contador. */}
      <ItemBotao onPress={handlePress} title="Botão Memoizado" />
    </View>
  );
};
```

-----

## Bônus: Ferramentas Adicionais

  * **`shouldComponentUpdate`**: O precursor do `React.memo` para **componentes de classe**. Permite um controle manual sobre a re-renderização, mas para componentes funcionais, `React.memo` é a abordagem moderna.
  * **`InteractionManager`**: Permite adiar a execução de tarefas pesadas (como uma grande computação de dados) para **depois** que as animações e transições terminarem, garantindo que a UI permaneça fluida.

## ✅ Conclusão

Otimização de performance é um processo contínuo de identificar e resolver gargalos. As ferramentas do React nos dão controle total sobre o ciclo de renderização.

  * Use **`React.lazy`** para dividir o código e acelerar o carregamento inicial.
  * Ajuste as props da **`FlatList`** para listas grandes e complexas.
  * Use **`React.memo`**, **`useCallback`** e **`useMemo`** de forma estratégica para evitar renderizações e cálculos desnecessários.

Aplicar essas técnicas nos locais certos é o que transforma uma aplicação funcional em uma aplicação com uma experiência de usuário excepcional.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/037-react-native-deploy.md) 👉

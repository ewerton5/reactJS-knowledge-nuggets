###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/023-zustand.md)

# 📘 Pílula de Conhecimento 24 — Utilidades do React Native (Parte 1)

O React Native oferece um conjunto rico de APIs e hooks que funcionam como uma ponte para o mundo nativo, permitindo que seu código JavaScript interaja com funcionalidades do dispositivo e responda a eventos do sistema operacional. Dominar essas ferramentas é essencial para criar aplicações ricas e com comportamento profissional.

## `AppState`

Permite monitorar se seu aplicativo está em primeiro plano (`active`), em segundo plano (`background`) ou `inactive` (um estado de transição, como ao receber uma chamada).

  * **Caso de Uso:** Pausar um vídeo quando o app vai para o background, atualizar dados quando o app volta a ficar ativo, ou gerenciar o status de "online" de um usuário em um chat.

**Exemplo:**

```tsx
import React, { useState, useEffect } from 'react';
import { AppState } from 'react-native';

const AppStateExample = () => {
  const [appState, setAppState] = useState(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      console.log('App State mudou para:', nextAppState);
      setAppState(nextAppState);
    });

    // Limpeza: remove o listener quando o componente é desmontado
    return () => {
      subscription.remove();
    };
  }, []);

  return <Text>Estado atual do App: {appState}</Text>;
};
```

-----

## `useFocusEffect` (do React Navigation)

Um hook especial que executa um efeito sempre que a tela entra em foco. É uma versão do `useEffect` otimizada para navegação.

  * **Caso de Uso:** Buscar dados atualizados de uma API toda vez que o usuário navega para uma tela, em vez de apenas uma vez quando ela é montada.
  * **Diferença para `useEffect`:** `useEffect(..., [])` roda apenas uma vez. `useFocusEffect` roda toda vez que a tela se torna o foco principal.

**Exemplo:**

```tsx
import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback } from 'react';

function ProfileScreen() {
  useFocusEffect(
    useCallback(() => {
      // Lógica a ser executada quando a tela ganha foco
      console.log('Tela de Perfil em foco, buscando dados...');
      const unsubscribe = api.subscribeToProfileUpdates();

      // Lógica de limpeza, executada quando a tela perde o foco
      return () => {
        console.log('Tela de Perfil perdeu o foco.');
        unsubscribe();
      };
    }, [])
  );

  return <View>{/* ... */}</View>;
}
```

-----

## `NetInfo`

Uma biblioteca da comunidade (`@react-native-community/netinfo`) para obter informações sobre a conexão de rede do dispositivo.

  * **Caso de Uso:** Verificar se o usuário está online antes de tentar fazer uma requisição, exibir um aviso de "Você está offline" ou habilitar/desabilitar funcionalidades com base na conexão. Essencial para estratégias de *Offline First*.

**Exemplo:**

```tsx
import React from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

const NetworkIndicator = () => {
  const netInfo = useNetInfo();

  return (
    <View>
      <Text>Tipo de Conexão: {netInfo.type}</Text>
      <Text>Está Conectado? {netInfo.isConnected ? 'Sim' : 'Não'}</Text>
    </View>
  );
};
```

-----

## `Keyboard`

Uma API para interagir e obter informações sobre o teclado nativo.

  * **Caso de Uso:** Fechar o teclado programaticamente quando o usuário toca fora de um input, ou ajustar a UI (subir um formulário) quando o teclado aparece para que ele não cubra os campos de texto.

**Exemplo:**

```tsx
import React, { useEffect } from 'react';
import { Keyboard, TextInput, Button } from 'react-native';

const KeyboardExample = () => {
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => console.log('Teclado apareceu!')
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => console.log('Teclado escondeu!')
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View>
      <TextInput placeholder="Digite algo..." />
      <Button title="Fechar Teclado" onPress={() => Keyboard.dismiss()} />
    </View>
  );
};
```

-----

## `BackHandler` (Android-Only)

Permite detectar e customizar o comportamento do botão "voltar" do sistema Android.

  * **Caso de Uso:** Impedir que o usuário volte acidentalmente de uma tela crítica, ou exibir um alerta de confirmação como "Você tem certeza que deseja sair do aplicativo?".

**Exemplo:**

```tsx
import React from 'react';
import { BackHandler, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

const ExitConfirmationScreen = () => {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Atenção!', 'Você deseja sair do aplicativo?', [
          { text: 'Não', onPress: () => null, style: 'cancel' },
          { text: 'Sim', onPress: () => BackHandler.exitApp() },
        ]);
        // `return true` previne o comportamento padrão de voltar a tela
        return true;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => subscription.remove();
    }, [])
  );

  return <Text>Pressione o botão de voltar do Android.</Text>;
};
```

-----

## `Dimensions` e `useWindowDimensions`

Fornecem as dimensões (largura e altura) da tela do dispositivo.

  * **`Dimensions.get('window')`:** Obtém as dimensões uma única vez. Não atualiza se o usuário rotacionar a tela.
  * **`useWindowDimensions()`:** Um hook que retorna as dimensões e **se atualiza automaticamente** quando elas mudam (ex: rotação). **Esta é a abordagem moderna e recomendada.**

**Exemplo:**

```tsx
import React from 'react';
import { useWindowDimensions, View, StyleSheet } from 'react-native';

const ResponsiveComponent = () => {
  const { width, height } = useWindowDimensions();

  const isPortrait = height > width;

  return (
    <View style={isPortrait ? styles.portraitContainer : styles.landscapeContainer}>
      {/* ... */}
    </View>
  );
};
```

-----

## `InteractionManager`

Uma ferramenta de performance que permite agendar a execução de tarefas "pesadas" para **depois** que qualquer animação ou interação (como uma transição de tela) tenha sido concluída.

  * **Caso de Uso:** Você navega para uma nova tela com uma animação de slide. Em vez de fazer uma requisição pesada à API *durante* a animação (o que poderia causar "engasgos"), você a agenda com o `InteractionManager` para que ela só comece quando a animação terminar, mantendo a UI fluida.

**Exemplo:**

```tsx
import React, { useEffect } from 'react';
import { InteractionManager } from 'react-native';

const SmoothScreen = ({ navigation }) => {
  useEffect(() => {
    // Adia a execução de tarefas pesadas
    const handle = InteractionManager.runAfterInteractions(() => {
      console.log('Animação de transição concluída. Buscando dados agora...');
      fetchHeavyData();
    });

    return () => handle.cancel();
  }, []);

  return <Text>Esta tela aparece com uma animação suave!</Text>;
};
```

## ✅ Conclusão

Dominar essas APIs e hooks nativos é o que permite criar aplicações React Native que se sentem verdadeiramente "nativas". Eles são as ferramentas que dão a você o controle sobre o ciclo de vida do app, interações do usuário e o hardware do dispositivo, resultando em uma experiência final mais polida, performática e profissional.

###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/037-react-native-deploy.md)

# 📘 Pílula de Conhecimento 38 — Animações em React Native

Animações são essenciais para criar uma experiência de usuário moderna e intuitiva. Elas guiam o foco do usuário, fornecem feedback visual e tornam a interface mais agradável. No React Native, temos duas abordagens principais para criar animações: a API **`Animated`**, que é nativa do React Native, e a biblioteca **`React Native Reanimated`**, uma solução mais poderosa e performática da comunidade.

> **Animação via Código vs. GIF:**
> Enquanto um GIF é um arquivo de vídeo pré-renderizado que pode ser pesado e não interativo, as animações via código são calculadas em tempo real. Elas são leves, performáticas e podem responder dinamicamente a interações do usuário, como gestos de arrastar e tocar.

## 1\. A API Nativa: `Animated`

A API `Animated` é a solução de animação que já vem com o React Native. Ela funciona primariamente no "lado" do JavaScript, onde a lógica da animação calcula o valor de cada quadro e o envia para a thread de UI nativa.

  * **Blocos de Construção:**

      * **`Animated.Value`**: Um valor especial que pode ser animado. Geralmente inicializado com `new Animated.Value(0)`.
      * **`Animated.timing()` / `Animated.spring()`**: Funções que definem *como* o valor será animado. `timing` é baseado em duração, enquanto `spring` simula uma mola física (efeito "elástico").
      * **`Animated.View`, `Animated.Text`, etc.**: Componentes especiais que sabem como receber um `Animated.Value` em suas propriedades de estilo.
      * **`Animated.sequence()` / `Animated.parallel()`**: Funções para orquestrar múltiplas animações, executando-as em sequência ou ao mesmo tempo.

  * **Otimização Essencial: `useNativeDriver: true`**
    Esta é a otimização mais importante da API `Animated`. Ao usar `useNativeDriver: true`, você envia a animação completa para a thread de UI nativa de uma só vez. A animação então roda de forma independente, sem precisar se comunicar com a thread JavaScript a cada quadro, resultando em uma performance muito mais fluida.

**Exemplo: Animação de Fade-in com `Animated`**

```tsx
import React, { useRef, useEffect } from 'react';
import { Animated, Button } from 'react-native';

const FadeInView = () => {
  // 1. Inicializa o valor animado para a opacidade
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    // 2. Define a animação com `Animated.timing`
    Animated.timing(fadeAnim, {
      toValue: 1, // Anima para opacidade 1
      duration: 1000, // Em 1 segundo
      useNativeDriver: true, // Otimização crucial!
    }).start(); // 3. Inicia a animação
  };

  return (
    <>
      {/* 4. Usa o Animated.View e aplica o valor animado ao estilo */}
      <Animated.View style={{ opacity: fadeAnim }}>
        <Text>Eu apareci suavemente!</Text>
      </Animated.View>
      <Button title="Iniciar Animação" onPress={fadeIn} />
    </>
  );
};
```

## 2\. A Evolução: `React Native Reanimated`

**React Native Reanimated** é uma biblioteca da comunidade que se tornou o padrão para animações de alta performance. Sua grande vantagem é que ela permite que as animações e a lógica de gestos rodem **inteiramente na thread de UI nativa**, eliminando completamente a comunicação com a thread JavaScript durante a animação.

  * **Por que Reanimated?** É a escolha ideal para animações complexas e interativas, especialmente aquelas que respondem a gestos do usuário (arrastar, pinçar, etc.), onde a performance e a resposta imediata são cruciais.

  * **Novos Blocos de Construção (v2+):**

      * **`useSharedValue`**: O equivalente ao `Animated.Value`. É um valor "compartilhado" que pode ser lido e modificado tanto pela thread de UI quanto pela de JS.
      * **`useAnimatedStyle`**: Um hook que cria um objeto de estilo reativo. Ele "escuta" as mudanças nos `sharedValues` e atualiza a UI de forma eficiente.
      * **`withTiming()` / `withSpring()`**: Funções que envolvem a atualização de um `sharedValue`, dizendo a ele para animar até o novo valor.
      * Os componentes `Animated.View`, `Animated.Text` vêm da própria `react-native-reanimated`.

**Exemplo: Animação de Fade-in com `Reanimated`**

```tsx
import React from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Button } from 'react-native';

const ReanimatedFadeInView = () => {
  // 1. Inicializa o valor compartilhado para a opacidade
  const opacity = useSharedValue(0);

  // 2. Cria o estilo animado que reage às mudanças no valor de opacidade
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const fadeIn = () => {
    // 3. Atualiza o valor com uma animação de timing
    opacity.value = withTiming(1, { duration: 1000 });
  };

  return (
    <>
      {/* 4. Usa o Animated.View e aplica o estilo animado */}
      <Animated.View style={animatedStyle}>
        <Text>Eu também apareci suavemente!</Text>
      </Animated.View>
      <Button title="Iniciar Animação" onPress={fadeIn} />
    </>
  );
};
```

## 3\. Boas Práticas de Performance

Para animações fluidas, a regra de ouro é evitar alterar o layout da tela.

  * **Anime `transform` e `opacity`:** Propriedades como `width`, `height`, `margin` ou `padding` forçam o motor de layout a recalcular tudo, o que é lento. Em vez disso, prefira animar as propriedades `transform` (`translateX`, `translateY`, `scale`, `rotate`) e `opacity`. Essas animações podem ser executadas de forma muito mais eficiente pela thread de UI.

## ✅ Conclusão

Ambas as bibliotecas são capazes de criar belas animações, mas a escolha depende da complexidade e da necessidade de performance.

  * **`Animated` API:** Suficiente para animações simples e diretas (como fade-ins, pop-ups). Lembre-se de **sempre** usar `useNativeDriver: true`.
  * **`React Native Reanimated`:** A escolha padrão e recomendada para qualquer animação interativa, baseada em gestos, ou em cenários onde a performance máxima é essencial. É a ferramenta profissional para criar animações nativas de 60 FPS.

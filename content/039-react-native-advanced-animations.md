###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/038-react-native-animations.md)

# 📘 Pílula de Conhecimento 39 — Animações Avançadas: Interpolação e Lottie

Para ir além de animações simples de opacidade ou movimento, precisamos de técnicas que nos permitam criar transições mais ricas e complexas. A **interpolação** é a ferramenta de código para isso, enquanto o **Lottie** nos permite renderizar animações vetoriais complexas criadas por designers.

## 1\. Interpolação: Mapeando Valores para Animações Ricas

**Interpolar** significa mapear um intervalo de valores de entrada para um intervalo de valores de saída. Em animações, usamos isso para pegar um único valor animado (como o progresso de uma animação de 0 a 1) e traduzi-lo em diferentes propriedades de estilo, como rotação, cor ou escala.

Pense nisso como definir o "caminho" entre dois "polos" de uma animação. Tanto a API `Animated` quanto a `Reanimated` oferecem funções de interpolação.

### Casos de Uso e Exemplos

#### Rotação (`rotate`)

O caso de uso mais clássico é criar um *spinner* de carregamento. Mapeamos o progresso da animação (0 a 1) para um giro completo (0 a 360 graus).

```tsx
import { Animated, Easing } from 'react-native';

const animatedValue = new Animated.Value(0);

// Animação em loop
Animated.loop(
  Animated.timing(animatedValue, {
    toValue: 1,
    duration: 1500,
    easing: Easing.linear,
    useNativeDriver: true,
  })
).start();

// Mapeia a entrada [0, 1] para a saída ['0deg', '360deg']
const rotation = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

// Uso no estilo do componente
// <Animated.View style={{ transform: [{ rotate: rotation }] }} />
```

#### Transição de Cor (`backgroundColor`)

A interpolação também funciona com cores. O motor de animação calcula as cores intermediárias para criar uma transição suave.

```tsx
// Mapeia o progresso [0, 1] para uma transição de cinza para verde
const backgroundColor = animatedValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['rgb(200,200,200)', 'rgb(0,255,0)'],
});
```

> **Nota:** A biblioteca `Reanimated` oferece uma função otimizada para isso, a `interpolateColor`.

#### Animações Não-Lineares (`scale`)

Você pode adicionar múltiplos pontos nos intervalos para criar efeitos mais complexos, como um "pulso".

```tsx
// A animação vai de 1 -> 1.2 -> 1, criando um efeito de pulsação
const scale = animatedValue.interpolate({
  inputRange: [0, 0.5, 1],
  outputRange: [1, 1.2, 1],
});

// Uso no estilo do componente
// <Animated.View style={{ transform: [{ scale }] }} />
```

## 2\. Lottie: Animações de After Effects no seu App

**O Problema:** Criar animações vetoriais altamente complexas (personagens, ícones detalhados, etc.) apenas com código é extremamente difícil e demorado.

**A Solução: Lottie.**
Lottie é uma biblioteca criada pela Airbnb que renderiza animações feitas no **Adobe After Effects** que foram exportadas como um arquivo **JSON**.

### Vantagens do Lottie sobre GIFs

  * **Leveza:** Um arquivo JSON é muito menor que um GIF ou vídeo.
  * **Qualidade Vetorial:** A animação é renderizada como vetor, então ela pode ser redimensionada para qualquer tamanho sem perder qualidade.
  * **Performance:** As animações são renderizadas nativamente, sendo muito mais performáticas.
  * **Controle Programático:** Você pode controlar a animação via código (play, pause, loop, reverter, etc.).

### O Fluxo de Trabalho

1.  Um designer ou animador cria uma animação vetorial no **Adobe After Effects**.
2.  Usando o plugin **Bodymovin**, a animação é exportada como um único arquivo `.json`.
3.  No seu app React Native, você usa a biblioteca `lottie-react-native` para renderizar esse arquivo JSON.

**Exemplo de Código:**

```tsx
import React, { useRef, useEffect } from 'react';
import LottieView from 'lottie-react-native';
import { Button } from 'react-native';

const LottieAnimation = () => {
  const animationRef = useRef<LottieView>(null);

  useEffect(() => {
    // Inicia a animação assim que o componente é montado
    animationRef.current?.play();
  }, []);

  return (
    <View>
      <LottieView
        ref={animationRef}
        source={require('./animations/my-awesome-animation.json')}
        style={{ width: 200, height: 200 }}
        loop={true}
        autoPlay={false} // Controlamos via ref
      />
      <Button title="Reiniciar Animação" onPress={() => animationRef.current?.reset()} />
    </View>
  );
};
```

## ✅ Conclusão

Aprender a usar **interpolação** e **Lottie** abre um novo leque de possibilidades para a UI das suas aplicações.

  * Use a **interpolação** para criar animações ricas e dinâmicas baseadas em código, ligando um valor animado a múltiplas propriedades de estilo de forma criativa.
  * Use o **Lottie** quando precisar de animações complexas, ilustrativas e de alta qualidade, que seriam impraticáveis de se construir manualmente.

Saber quando usar cada técnica permite que você escolha a ferramenta certa para o trabalho, seja para uma transição de UI fluida ou para uma animação de onboarding encantadora.

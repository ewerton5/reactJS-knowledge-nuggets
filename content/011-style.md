###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/010-redux.md)

# 📘 Pílula de Conhecimento 11 — Estilização de Componentes em React

A estilização é o que dá vida e identidade a uma aplicação. No ecossistema React, especialmente no React Native, aplicamos estilos de uma forma que mescla conceitos do CSS tradicional com o poder do JavaScript, permitindo a criação de interfaces dinâmicas e reutilizáveis. Vamos explorar as principais abordagens: `StyleSheet`, `styled-components` e as propriedades de estilo essenciais.

## 1\. A Base: Estilização Nativa com `StyleSheet`

O React Native fornece um módulo nativo, o `StyleSheet`, para criar objetos de estilo de forma otimizada.

  * **Sintaxe:** As propriedades CSS são escritas em **`camelCase`** (ex: `backgroundColor`) em vez de `kebab-case`.
  * **Valores:** Unidades como `px` são desnecessárias; números puros são tratados como "density-independent pixels" (DP), garantindo consistência entre diferentes telas.

**Exemplo de uso:**

```tsx
import { View, Text, StyleSheet } from 'react-native';

const MeuComponente = () => (
  <View style={styles.container}>
    <Text style={styles.title}>Olá, Mundo!</Text>
  </View>
);

// `StyleSheet.create` cria um objeto de estilos otimizado
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
});
```

É possível também combinar múltiplos estilos usando um array, onde o último estilo sobrescreve os anteriores: `style={[styles.base, styles.variacao]}`

-----

## 2\. O Poder do CSS-in-JS com `styled-components`

A biblioteca `styled-components` é uma das mais populares para estilização em React e React Native. Ela permite criar componentes que já vêm com seus estilos encapsulados, usando a sintaxe familiar do CSS.

**Principais Vantagens:**

  * **Theming:** Compartilhe um tema (cores, fontes, espaçamentos) em toda a aplicação usando um `ThemeProvider`.
  * **Estilos Dinâmicos:** Altere estilos facilmente com base nas props do componente.
  * **Sintaxe CSS:** Escreva CSS puro (com `kebab-case`) dentro de template literals.

### Adicionando Fontes Customizadas no React Native

Diferente da web, para usar uma fonte customizada (ex: `Poppins-Regular.ttf`) no React Native, é preciso "linkar" o arquivo da fonte aos projetos nativos (iOS e Android).

**Passo a passo:**

1.  Crie uma pasta de assets, por exemplo: `src/assets/fonts/` e adicione seus arquivos `.ttf` ou `.otf` nela.
2.  Crie um arquivo `react-native.config.js` na raiz do seu projeto com o seguinte conteúdo:
    ```js
    module.exports = {
      project: {
        ios: {},
        android: {},
      },
      assets: ['./src/assets/fonts/'], // Caminho para a pasta de fontes
    };
    ```
3.  Execute o comando de linking no terminal:
    `npx react-native-asset`

Após esses passos, você pode usar o nome da fonte (o nome "PostScript", não o nome do arquivo) em seus estilos: `font-family: 'Poppins-Regular';`

**Exemplo de Configuração e Uso do `styled-components`**

**1. Crie um tema:**

```ts
// src/theme.ts
export const theme = {
  colors: {
    primary: '#6200ee',
    background: '#ffffff',
    text: '#000000',
  },
  fonts: {
    // Agora você pode usar sua fonte customizada
    main: 'Poppins-Regular',
    bold: 'Poppins-Bold',
  },
};
```

**2. Envolva a aplicação com o `ThemeProvider`:**

```tsx
// App.tsx
import { ThemeProvider } from 'styled-components/native';
import { theme } from './src/theme';

const App = () => (
  <ThemeProvider theme={theme}>
    {/* Resto da sua aplicação */}
  </ThemeProvider>
);
```

**3. Crie e use componentes estilizados:**

```tsx
import styled from 'styled-components/native';

// Acessa as propriedades do tema via props
const Container = styled.View`
  flex: 1;
  background-color: ${(props) => props.theme.colors.background};
  align-items: center;
  justify-content: center;
`;

// Estilo dinâmico baseado em uma prop `isPrimary`
const Title = styled.Text<{ isPrimary?: boolean }>`
  font-family: ${(props) => props.theme.fonts.bold};
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.isPrimary ? props.theme.colors.primary : props.theme.colors.text)};
`;

// Uso no componente
const Tela = () => (
  <Container>
    <Title isPrimary>Título Principal</Title>
    <Title>Título Secundário</Title>
  </Container>
);
```

-----

## 📖 Guia Rápido de Propriedades CSS Essenciais

Abaixo estão algumas das propriedades de estilo mais comuns, com links para a documentação da W3Schools. Lembre-se que no React Native (`StyleSheet`), elas são escritas em `camelCase`.

  * **Layout (Flexbox & Grid)**

      * [`display`](https://www.w3schools.com/cssref/pr_class_display.php) - Define como um elemento é renderizado. No React Native, o padrão é `flex`, enquanto na web é `block` ou `inline`.
      * [`flex`](https://www.google.com/search?q=%5Bhttps://www.w3schools.com/cssref/css3_pr_flex.php%5D\(https://www.w3schools.com/cssref/css3_pr_flex.php\)): É a propriedade principal que configura a "elasticidade" de um item. Ela é um atalho para três ajustes:
        * [`flex-grow`](https://www.google.com/search?q=%5Bhttps://www.w3schools.com/cssref/css3_pr_flex-grow.php%5D\(https://www.w3schools.com/cssref/css3_pr_flex-grow.php\)) **(Capacidade de Esticar):** Se sobrar espaço na caixa, esse valor define o quanto o item vai esticar para preenchê-lo. Um valor `0` significa que ele fica do mesmo tamanho. Um valor `1` ou mais faz com que ele cresça e "absorva" o espaço vago.
        * [`flex-shrink`](https://www.google.com/search?q=%5Bhttps://www.w3schools.com/cssref/css3_pr_flex-shrink.php%5D\(https://www.w3schools.com/cssref/css3_pr_flex-shrink.php\)) **(Capacidade de Encolher):** Se faltar espaço na caixa, esse valor define o quanto o item pode se comprimir. Um valor `0` o torna "rígido", tentando não encolher. Um valor `1` permite que ele se esprema para caber.
        * [`flex-basis`](https://www.google.com/search?q=%5Bhttps://www.w3schools.com/cssref/css3_pr_flex-basis.php%5D\(https://www.w3schools.com/cssref/css3_pr_flex-basis.php\)) **(Tamanho Padrão):** É o tamanho "ideal" ou o ponto de partida do item. O navegador primeiro reserva esse espaço e depois decide se precisa esticá-lo (`grow`) ou encolhê-lo (`shrink`) com base no espaço disponível.
      * [`justify-content`](https://www.w3schools.com/cssref/css3_pr_justify-content.php) - Alinha os itens ao longo do eixo principal (horizontal por padrão).
      * [`align-items`](https://www.w3schools.com/cssref/css3_pr_align-items.php) - Alinha os itens ao longo do eixo transversal (vertical por padrão).
      * [`align-self`](https://www.w3schools.com/cssref/css3_pr_align-self.php) - Sobrescreve o `align-items` para um item específico.
      * [`gap`](https://www.w3schools.com/cssref/css3_pr_gap.php) - Define o espaçamento entre os itens de um container flex ou grid.
      * [`grid`](https://www.w3schools.com/cssref/pr_grid.php) - Habilita o layout em grade, muito poderoso para layouts complexos na web. (Não suportado nativamente no React Native).

  * **Posicionamento e Dimensões**

      * [`position`](https://www.w3schools.com/cssref/pr_class_position.php) - Especifica como um elemento é posicionado no documento. Seu comportamento é ajustado pelas propriedades `top`, `right`, `bottom` e `left`.
        * **Contexto de Posicionamento:** É essencial para criar layouts complexos e sobrepor elementos. Um elemento com `position: absolute` se orienta pelo ancestral posicionado (`relative`, `absolute`, `fixed` ou `sticky`) mais próximo.
        * **Padrão na Web vs. React Native:** Uma diferença crucial é o valor padrão. Na Web (CSS), o padrão é **`static`**, onde o elemento segue o fluxo normal da página. Em React Native, o padrão é **`relative`**, o que significa que todo elemento já pode servir como referência para filhos absolutos sem configuração adicional.
      * [`width`](https://www.w3schools.com/cssref/pr_dim_width.php) / [`height`](https://www.w3schools.com/cssref/pr_dim_height.php) - Definem a largura e altura. Use com cuidado; prefira layouts flexíveis que se ajustam ao pai e aos filhos com `flex`.
      * [`margin`](https://www.w3schools.com/cssref/pr_margin.php) - Espaçamento **externo** ao redor do elemento.
      * [`padding`](https://www.w3schools.com/cssref/pr_padding.php) - Espaçamento **interno** do elemento, entre a borda e o conteúdo.
      * [`z-index`](https://www.w3schools.com/cssref/pr_pos_z-index.php) - Controla a ordem de empilhamento de elementos posicionados.

  * **Estilos Visuais e de Texto**

      * [`background`](https://www.w3schools.com/cssref/css3_pr_background.php) - Propriedade abreviada para cor, imagem, etc. No React Native, usa-se `backgroundColor` para cor e o componente [`<ImageBackground>`](https://reactnative.dev/docs/imagebackground) para imagens.
      * [`border`](https://www.w3schools.com/cssref/pr_border.php) - Define a borda de um elemento.
      * [`opacity`](https://www.w3schools.com/cssref/css3_pr_opacity.php) - Controla a transparência do elemento.
      * [`font`](https://www.w3schools.com/cssref/pr_font_font.php) - Propriedade abreviada para estilo, peso, tamanho e família da fonte.
      * [`text-align`](https://www.w3schools.com/cssref/pr_text_text-align.php) - Alinha o texto horizontalmente (`center`, `left`, `right`, `justify`).
      * [`text-decoration`](https://www.w3schools.com/cssref/pr_text_text-decoration.php) - Adiciona linhas ao texto (`underline`, `line-through`).
      * [`letter-spacing`](https://www.w3schools.com/cssref/pr_text_letter-spacing.php) - Controla o espaçamento entre os caracteres.
      * [`line-height`](https://www.w3schools.com/cssref/pr_dim_line-height.php) - Define a altura da linha do texto.

  * **Interatividade e Efeitos**

      * [`cursor`](https://www.w3schools.com/cssref/pr_class_cursor.php) - Muda o cursor do mouse (apenas para web).
      * [`overflow`](https://www.w3schools.com/cssref/pr_pos_overflow.php) - Controla o que acontece quando o conteúdo ultrapassa o tamanho do container (`hidden`, `scroll`).
      * [`transform`](https://www.w3schools.com/cssref/css3_pr_transform.php) - Aplica transformações 2D ou 3D a um elemento (rotacionar, escalar, mover).
      * [`scrollbar-color`](https://www.w3schools.com/cssref/css_pr_scrollbar-color.php) - Customiza a cor da barra de rolagem (apenas web). No React Native, usa-se props como `indicatorStyle` em componentes de lista.

-----

## 🎮 Dica Interativa: Aprenda Flexbox Jogando\!

Flexbox é a base para criar layouts no React Native. Uma forma divertida de dominar suas propriedades é através de jogos interativos.

  * **Knights of the Flexbox Table:** [https://knightsoftheflexboxtable.com/](https://knightsoftheflexboxtable.com/)

-----

## ✅ Conclusão

A estilização no ecossistema React é flexível e poderosa.

  * Comece com **`StyleSheet`** no React Native para uma solução nativa e otimizada.
  * Adote **`styled-components`** quando precisar de um sistema de temas robusto, fontes customizadas e estilos dinâmicos baseados em props.
  * Tenha o guia de propriedades como uma referência rápida, sempre prestando atenção às diferenças entre a web e o mobile.

Dominar essas ferramentas permite criar interfaces consistentes, bonitas e fáceis de manter.

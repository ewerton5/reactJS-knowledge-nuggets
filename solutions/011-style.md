### **Soluções dos exercícios: Pílula de Conhecimento 11 em Prática**

Esta série de encontros abordou os maiores desafios de layout no React Native e na Web, focando em como o Flexbox resolve problemas de responsividade, quebra de linha, sobreposições e acessibilidade usando `styled-components`.

---

#### **📱 Exercício 1: O Formulário Mobile (Teclado vs. Flexbox)**

**Objetivo:** Manter a tela responsiva usando `space-between` e `flex-basis` para evitar que o teclado esmague os inputs ou esconda os botões.

**Solução em Código:**

```tsx
const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  padding: 20px;
  /* Afasta a logo para o topo, inputs pro meio e botão pro rodapé */
  justify-content: space-between; 
`;

const InputWrapper = styled.View`
  /* Define o tamanho "ideal" de partida no eixo principal */
  flex-basis: 120px;
  flex-shrink: 1; /* Permite comprimir um pouco se o teclado esmagar muito */
  justify-content: center;
`;

```

**Pontos de Discussão Detalhados:**

* **`space-between` vs. `margin-top` fixo:** Foi discutido que usar margens fixas (como `margin-top: 200px`) engessa o layout. Quando o teclado sobe, esse espaço não diminui, empurrando itens para fora da tela. O `space-between` calcula o espaço restante dinamicamente, mantendo tudo visível.
* **`flex-basis` vs. `height` fixo:** Travar o `height` deixa o elemento rígido, causando sobreposição quando o teclado aparece. O `flex-basis` atua como um tamanho sugerido: *"tente ter 120px, mas se o teclado subir, você pode encolher"*, o que evita quebra de layout.

---

#### **💻 Exercício 2: O Desafio do Wrap (Web)**

**Objetivo:** Quebrar linhas de forma flexível sem criar buracos no layout.

**Solução em Código:**

```tsx
const TagContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap; /* Permite pular para a próxima linha */
`;

const Tag = styled.div`
  background-color: #eee;
  padding: 10px 15px;
  border-radius: 8px;
  
  flex-basis: 100px; /* Tamanho mínimo base */
  flex-grow: 1;      /* Estica para preencher o resto da linha se sobrar espaço */
`;

```

**Pontos de Discussão Detalhados:**

* **O fim dos espaços vazios:** Se usássemos `width: 100px` rígido, o final das linhas ficaria com "buracos" quando não coubesse mais uma tag inteira. A combinação de `flex-basis` com `flex-grow: 1` garante que as tags se estiquem como chiclete para alinhar perfeitamente com a borda direita.
* **Performance (Web vs. Mobile):** Usamos o cenário Web para lembrar que no React Native não devemos renderizar listas grandes com `.map` dentro de `ScrollView`, pois isso trava a CPU. O `<FlatList>` é mandatório lá por possuir virtualização.

---

#### **🥞 Exercício 3: A Batalha das Sobreposições (Absolute vs. Margin Negativa)**

**Objetivo:** Saber quando "arrancar" o elemento do fluxo (`absolute`) e quando apenas "puxá-lo" (`margin`).

**Solução em Código (Abordagem Vencedora):**

```tsx
const AvatarMargin = styled.Image`
  width: 100px; height: 100px; border-radius: 50px;
  align-self: center;
  /* Puxa para cima, invadindo a capa, MAS mantendo-se no fluxo do documento */
  margin-top: -50px; 
`;

```

**Pontos de Discussão Detalhados:**

* **Mantendo o Fluxo:** A margem negativa é melhor aqui porque os elementos abaixo do avatar (como o nome do usuário) percebem que ele subiu e sobem junto, mantendo o espaçamento natural.
* **O perigo do `position: absolute`:** Se usássemos `absolute`, o avatar seria removido do fluxo da página. O nome do usuário iria ignorá-lo e subir direto para a capa, escondendo-se atrás da foto.
* **Quando usar Absolute?** Apenas quando o elemento **não deve** empurrar ou interferir no layout dos vizinhos (ex: botão de "X" de fechar em um modal, ou bolinha de notificação sobre um ícone).

---

#### **📏 Exercício 4: O Fim do `width` e `height` Fixos**

**Objetivo:** Criar componentes responsivos para qualquer tela sem travar dimensões, focando em acessibilidade.

**Solução em Código:**

```tsx
const BotaoBom = styled.TouchableOpacity`
  background-color: #000;
  align-items: center;
  border-radius: 8px;

  /* Respiro lateral: adapta-se a qualquer largura de tela */
  margin: 0 16px; 

  /* Volume vertical: altura ditada pelo conteúdo interno */
  padding: 16px 0; 
`;

```

**Pontos de Discussão Detalhados:**

* **Acessibilidade (O vilão do `height` fixo):** Foi discutido que se um usuário aumentar a fonte do celular por problemas de visão, um botão com `height: 60px` fixo irá cortar o texto. Ao usar `padding`, a altura é calculada de dentro para fora: se a fonte cresce, o botão cresce junto.
* **Resiliência de Tela:** Evitar `width` fixo previne que botões fiquem gigantes em tablets ou vazem em telas estreitas.

---

#### **💅 Exercício 5: Condicionais Elegantes no CSS-in-JS (A Aula em Inglês!)**

**Objetivo:** Passar props dinâmicas para componentes estilizados sem sujar a árvore do React (JSX).

**Solução em Código:**

```tsx
interface BtnProps {
  isDanger?: boolean;
  isDisabled?: boolean;
}

export const BotaoAcao = styled.TouchableOpacity<BtnProps>`
  padding: 16px;
  border-radius: 8px;
  
  /* Ternário usando 'Question Mark' (?) e 'Colon' (:) */
  background-color: ${(props) => props.isDanger ? '#FF0000' : '#6200EE'};

  /* Controle de opacidade condicional */
  opacity: ${(props) => props.isDisabled ? 0.5 : 1};
`;

```

**Pontos de Discussão Detalhados:**

* **Limpando o JSX:** A principal diferença entre essa abordagem e usar arrays de estilos condicionais (ex: `style={[styles.btn, isDanger && styles.red]}`) é a limpeza do código. O componente renderizado no JSX fica puramente declarativo: `<BotaoAcao isDanger isDisabled />`.
* **Encapsulamento Lógico:** Toda a responsabilidade visual de decidir qual cor ou opacidade usar fica encapsulada onde pertence: dentro do arquivo de estilos (`styled-components`). E de quebra, a equipe aprendeu (ou relembrou) que `?` é *Question Mark* e `:` é *Colon* em inglês!

## 🚀 **Oficina Prática: Dominando Layouts com `styled-components`**

Olá, equipe! A pílula de hoje nos mostra que estilizar no ecossistema React vai muito além de pintar a tela. Vamos usar o poder do `styled-components` para resolver problemas reais de layout, transitando entre cenários Web e Mobile, e entendendo como o Flexbox resolve 99% dos nossos problemas.

### **Instruções de Setup:**

1. Assumam que todos os componentes abaixo são criados usando `styled-components` (Web ou Native).
2. O foco é entender o comportamento das propriedades CSS em cenários dinâmicos.

---

### **📱 Exercício 1: O Formulário Mobile (Teclado vs. Flexbox) (15 minutos)**

**Objetivo:** Manter a tela responsiva usando `space-between` e `flex-basis` para evitar que o teclado "esmague" o conteúdo.

**Cenário (Mobile):** Uma tela de Login com Logo no topo, Inputs no meio e Botão no rodapé. Quando o teclado abre, a tela encolhe.

**Tarefa:** Complete as propriedades dos *styled-components* abaixo.

1. Afaste os blocos usando a propriedade correta no `Container`.
2. Garanta que o bloco de inputs tenha um tamanho "ideal" de partida sem travar a altura fixa.

```tsx
import styled from 'styled-components/native';
import { KeyboardAvoidingView } from 'react-native';

// 1. O Container precisa distribuir os 3 elementos (Logo, Inputs, Botão) 
// empurrando o topo e o rodapé para as extremidades.
const Container = styled(KeyboardAvoidingView)`
  flex: 1;
  padding: 20px;
  /* Qual a propriedade para afastar os itens? */
  justify-content: ???; 
`;

// 2. O bloco de inputs precisa de um tamanho base (ex: 120px) para não sumir 
// quando o teclado subir, mas ainda deve ser flexível.
const InputWrapper = styled.View`
  /* Qual propriedade define o tamanho ideal de partida no eixo principal? */
  flex-basis: ???;
  flex-shrink: 1; /* Permite comprimir um pouco se faltar muito espaço */
  justify-content: center;
`;

export function FormularioLogin() {
  return (
    <Container behavior="padding">
      <Logo>App Logo</Logo>
      <InputWrapper>
        <Input placeholder="E-mail" />
        <Input placeholder="Senha" />
      </InputWrapper>
      <BotaoEntrar>Entrar</BotaoEntrar>
    </Container>
  );
}

```

**Pontos para discussão:**

* Por que usar `justify-content: space-between` é uma solução mais limpa do que colocar `margin-top: 200px` no botão para empurrá-lo para baixo?
* Qual a diferença de comportamento entre travar um `height: 120px` e usar `flex-basis: 120px` quando a tela é achatada pelo teclado?

---

### **💻 Exercício 2: O Desafio do Wrap (Web) (10 minutos)**

**Objetivo:** Quebrar linhas de forma flexível sem criar "buracos" no layout, usando a tríade do flex.

**Cenário (Web):** Uma lista de tags. Algumas têm textos longos, outras curtos. Elas devem preencher a linha e quebrar para a linha de baixo naturalmente.

**Tarefa:** Complete o código do container e das tags.

```tsx
import styled from 'styled-components';

const TagContainer = styled.div`
  display: flex;
  gap: 10px;
  /* 1. Como permitimos que os itens pulem para a próxima linha? */
  ???
`;

const Tag = styled.div`
  background-color: #eee;
  padding: 10px 15px;
  border-radius: 8px;
  
  /* 2. Queremos que a tag ocupe PELO MENOS 100px, 
     mas que CRESÇA para preencher o resto da linha se sobrar espaço. */
  flex-basis: ???;
  flex-grow: ???;
`;

// Uso (Lembrando que na Web usamos .map tranquilamente)
export function ListaDeTags({ tags }) {
  return (
    <TagContainer>
      {tags.map(tag => <Tag key={tag}>{tag}</Tag>)}
    </TagContainer>
  );
}

```

**Pontos para discussão:**

* No React Native, por que evitamos renderizar listas grandes com `.map` dentro de um `<ScrollView>` e preferimos o componente `<FlatList>`?
* Se usássemos `width: 100px` nas tags (Web ou Mobile), o que aconteceria com o espaço em branco no final de uma linha que não cabe mais uma tag inteira?

---

### **🥞 Exercício 3: A Batalha das Sobreposições (Absolute vs. Margin Negativa) (15 minutos)**

**Objetivo:** Saber quando "arrancar" o elemento do fluxo (`absolute`) e quando "puxá-lo" (`margin`).

**Cenário:** Um Card de Perfil. Há uma Capa (retangular) e um Avatar (redondo). O Avatar deve ficar exatamente na linha divisória (metade dentro da capa, metade fora). E abaixo dele, vem o Nome do usuário.

**Tarefa:** Analise e debata as duas abordagens em `styled-components`.

**Abordagem A (Margin Negativa):**

```tsx
const AvatarMargin = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  align-self: center;
  /* Puxa o avatar para cima, invadindo a capa. Ele CONTINUA no fluxo da página. */
  margin-top: -50px; 
`;
const Nome = styled.Text`
  text-align: center;
  margin-top: 10px; /* O nome flui naturalmente abaixo do avatar */
`;

```

**Abordagem B (Position Absolute):**

```tsx
const AvatarAbsolute = styled.Image`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  position: absolute; /* Arranca o elemento do fluxo do documento */
  top: 100px;
  left: 50%;
  transform: translateX(-50px);
`;
const Nome = styled.Text`
  text-align: center;
  /* Como o avatar foi "arrancado", o Nome sobe e se esconde atrás dele! 
     Precisamos forçar uma margem gigante para compensar. */
  margin-top: 60px; 
`;

```

**Pontos para discussão:**

* Como visto acima, a margem negativa é muito útil para sobreposições onde os elementos seguintes (o nome) precisam respeitar o espaço da imagem. Em quais cenários práticos o `position: absolute` seria a escolha correta e obrigatória? (Dica: pense em ícones flutuantes ou modais).

---

### **📏 Exercício 4: Dimensões Fluidas vs. Fixas (10 minutos)**

**Objetivo:** Criar componentes que se adaptam ao conteúdo e ao tamanho da tela.

**Cenário:** Um desenvolvedor criou um botão com medidas rígidas. Se a tela for um celular muito estreito, o botão vaza. Se a fonte aumentar, o texto corta.

**Código Ruim:**

```tsx
const BotaoRuim = styled.TouchableOpacity`
  background-color: #000;
  width: 320px; /* ERRO: Não responsivo */
  height: 60px; /* ERRO: Corta texto se a fonte crescer */
  justify-content: center;
  align-items: center;
`;

```

**Tarefa:** Refatore esse `styled-component` abolindo o `width` e o `height`. Use propriedades internas e externas para dar forma ao botão.

```tsx
const BotaoBom = styled.TouchableOpacity`
  background-color: #000;
  align-items: center;
  border-radius: 8px;

  /* 1. Como dar "respiro" nas laterais do botão em relação à tela? */
  margin: 0 ???; 

  /* 2. Como dar "volume" (altura) ao botão baseado no texto de dentro? */
  padding: ??? 0; 
`;

```

**Pontos para discussão:**

* Por que projetar com `padding` e `margin` cria layouts muito mais resilientes a diferentes resoluções do que amarrar a interface com `height` e `width` fixos?

---

### **💅 Exercício 5: Condicionais Elegantes no CSS-in-JS (5 minutos)**

**Objetivo:** Passar props dinâmicas para componentes estilizados sem sujar a árvore do React.

**Cenário:** Você tem um botão que pode ser primário ou de "perigo" (vermelho), e ele pode estar desabilitado (opacidade reduzida).

**Tarefa:** Complete a interpolação (`${}`) usando *arrow functions* no `styled-components`.

```tsx
import styled from 'styled-components/native';

// Definimos uma interface para as props (TypeScript)
interface BtnProps {
  isDanger?: boolean;
  isDisabled?: boolean;
}

export const BotaoAcao = styled.TouchableOpacity<BtnProps>`
  padding: 16px;
  border-radius: 8px;
  
  /* 1. Se isDanger for true, use '#FF0000', senão use '#6200EE' */
  background-color: ${(props) => /* ??? */};

  /* 2. Se isDisabled for true, opacity é 0.5, senão é 1 */
  opacity: ${(props) => /* ??? */};
`;

// Uso: <BotaoAcao isDanger isDisabled={false}>Deletar Conta</BotaoAcao>

```

**Pontos para discussão:**

* Qual a diferença entre tratar estilos condicionais usando as `props` do `styled-components` versus criar arrays lógicos no estilo antigo (ex: `style={[styles.btn, isDanger && styles.danger]}`)? Qual facilita mais a leitura do componente final?

👉 [Clique aqui para ver as soluções dos exercícios](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/solutions/011-style.md)

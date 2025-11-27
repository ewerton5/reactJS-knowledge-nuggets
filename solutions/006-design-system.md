### **Soluções dos exercícios: Pílula de Conhecimento 06 em Prática**

Esta série de encontros focou na arquitetura e organização de projetos React/React Native. Transformamos uma estrutura caótica em uma base sólida, aplicando conceitos de *Design System*, *Root Imports*, *Barrel Files* e componentes flexíveis.

-----

#### **Exercício 1: O Desafio da Reorganização**

**Cenário:** Um projeto legado (`projeto-caos`) com todos os arquivos misturados na raiz.

**Solução Proposta (Árvore de Arquivos):**

```text
src/
├── assets/
│   ├── images/
│   │   ├── logo-pequena.png
│   │   ├── background.jpg
│   │   └── index.ts          (Novo: exportação centralizada)
│   └── svgs/
│       ├── util-setas.svg
│       └── index.ts          (Novo: exportação centralizada)
├── components/
│   ├── Button/               (PrimaryButton renomeado/movido)
│   │   ├── index.tsx
│   │   └── styles.ts         (Estilos isolados do componente)
│   ├── Card/
│   │   ├── index.tsx
│   │   └── styles.ts
│   └── index.ts              (Barrel file dos componentes)
├── navigation/               (ou routes/)
│   └── AppNavigator.tsx      (routes.tsx renomeado)
├── redux/
│   ├── userSlice.ts          (userRedux.ts renomeado)
│   └── store.ts
├── screens/
│   ├── Login/
│   │   └── index.tsx
│   └── UserProfile/
│       └── index.tsx
├── services/                 (Pasta criada para api.ts)
│   └── api.ts
└── styles/                   (Para estilos globais/temas)
    └── theme.ts
```

##### Resumo da Discussão e Principais Aprendizados

  * **Identificação de Categorias:** A equipe, guiada por você, conseguiu alocar corretamente os arquivos soltos em suas respectivas pastas (`screens`, `assets`, `redux`).
  * **A Pasta `services`:** Um ponto crucial da discussão foi o destino do arquivo `api.ts`.
      * A equipe debateu entre `utils` e `services`.
      * A conclusão foi que `services` é o local mais apropriado para integrações externas (API, Firebase, Analytics), enquanto `utils` deve ser reservado para funções auxiliares puras e genéricas (como formatação de moeda ou data) que podem ser usadas em qualquer contexto.
  * **Componentes em Pastas Próprias:** Nátaly respondeu corretamente sobre a vantagem de mover `Card.tsx` para `components/Card/index.tsx`.
      * Isso permite **co-locação**: manter arquivos relacionados (estilos, testes, tipos) junto com o componente, facilitando a manutenção e evitando arquivos gigantes ou estilos globais difíceis de rastrear.
  * **Index como Padrão:** Você reforçou que nomear o arquivo principal de uma pasta como `index.tsx` (ou `index.ts`) permite importá-lo referenciando apenas o nome da pasta (ex: `import Card from './components/Card'`), o que limpa as importações.

-----

#### **Exercício 2: O Poder do Barrel File (Index.ts)**

**Objetivo:** Simplificar importações usando a técnica de exportação centralizada (Barrel Files).

**Solução em Código:**

**1. Criando o arquivo `src/components/index.ts`:**

```ts
// Exportamos o 'default' de cada componente, dando a ele um nome explícito.
export { default as Header } from './Header';
export { default as Avatar } from './Avatar';
export { default as Button } from './Button';
export { default as Label } from './Label';
```

**2. Nova importação no `UserProfile.tsx`:**

```tsx
// Antes: 4 linhas, caminhos repetitivos
// import { Header } from '../../components/Header/index'; ...

// Agora: 1 linha, limpa e direta
import { Header, Avatar, Button, Label } from '../../components';
```

**Resumo da Discussão e Aprendizados:**

  * **Praticidade:** A equipe concordou que agrupar as importações limpa o código e facilita a leitura.
  * **Manutenibilidade (Ponto Chave):** Mateus identificou corretamente que, se o nome da pasta de um componente mudar, basta atualizar o arquivo `index.ts`. Todos os outros arquivos que importam desse índice **não precisam ser alterados**, o que é uma enorme vantagem de manutenção.
  * **Performance:** Houve uma dúvida sobre se importar tudo de um único lugar afetaria a performance (bundle size). Você esclareceu que, para aplicações React Native compiladas, isso geralmente não é um problema significativo, pois o bundler (Metro) é inteligente o suficiente para incluir apenas o que é usado, e todo o código acaba sendo compilado de qualquer forma. O problema real seria em bibliotecas compartilhadas ou cenários de *tree-shaking* muito específicos na web, mas para o contexto do app, a organização compensa.

-----

#### **Exercício 3: Adeus `../../../../` (Root Imports)**

**Objetivo:** Substituir importações relativas longas por *Path Aliases* absolutos.

**Solução em Código:**

**Importação Antiga (Relativa):**

```tsx
import ArrowLeft from '../../../../../assets/svgs/ArrowLeft';
```

**Nova Importação (Absoluta com Alias):**

```tsx
// O '@' (ou '~') atua como um atalho direto para a pasta 'src'
import ArrowLeft from '@/assets/svgs/ArrowLeft';
```

**Resumo da Discussão e Aprendizados:**

  * **Configuração:** Você mostrou rapidamente como isso é configurado (no `babel.config.js` ou `tsconfig.json`), definindo que um caractere (como `@`) aponta para a raiz `src`.
  * **A Regra de Ouro da Refatoração:** A pergunta sobre mover arquivos gerou o insight principal:
      * **Com Importação Relativa (`../../`):** Se você move o arquivo que contém a importação para outra pasta, o caminho relativo **quebra** e precisa ser recalculado manualmente (ex: de 4 `../` para 3 `../`).
      * **Com Root Import (`@/`):** Como explicado por Silvio (Felon), o caminho **não muda**. Ele é absoluto a partir da raiz. Você pode mover o arquivo para qualquer lugar do projeto e a importação `@/assets/...` continuará funcionando perfeitamente.
  * **Curiosidade:** Caio compartilhou que o `@` é lido como "at" (em/no) em inglês, o que ajuda a lembrar: `import ... from @/components` = "importar ... **de** components".

-----

#### **Exercício 4: O Componente Wrapper Flexível**

**Objetivo:** Criar um componente que aceita props customizadas (`label`) E repassa todas as outras props para o componente nativo.

**Solução em Código:**

```tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Recebemos `label` explicitamente, e agrupamos TUDO que sobrar em `rest`
export function CustomInput({ label, ...rest }) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TextInput 
        style={styles.input}
        // SOLUÇÃO AQUI: Espalhamos as props restantes no componente nativo
        {...rest}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 }
});
```

**Principais Aprendizados:**

  * **Spread Operator (`...rest`):** A equipe (com explicação de Gean e Caio) entendeu que isso garante a **flexibilidade**. O `CustomInput` pode receber `placeholder`, `onChangeText`, `style` extra ou qualquer prop futura do `TextInput` sem precisar de alteração no código.
  * **Escalabilidade:** Isso permite criar variações de componentes ou composições complexas mantendo a interface limpa e compatível com o padrão do React Native.

-----

#### **Desafio Bônus: Organização de Imagens (iOS)**

**Objetivo:** Lidar com densidade de pixels (`@2x`, `@3x`).

**Solução:**
Manter todos os arquivos (`icon.png`, `icon@2x.png`, `icon@3x.png`) na **mesma pasta** e importar apenas o arquivo base (`icon.png`).

**Principais Aprendizados:**

  * **Convenção Automática:** A equipe (Nátaly) identificou corretamente que o React Native (e o iOS) seleciona automaticamente a imagem correta baseada na densidade da tela do dispositivo, desde que os arquivos estejam na mesma pasta. Separar em pastas diferentes quebraria esse comportamento.

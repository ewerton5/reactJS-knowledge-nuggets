## 🚀 **Oficina Prática: O Arquiteto de Software**

Olá, equipe\! A pílula de hoje não foi sobre "como fazer funcionar", mas sobre "como fazer bem feito e organizado". Vamos treinar nosso olhar crítico para estrutura de projetos. O objetivo é transformar o caos em ordem.

### **Instruções de Setup:**

1.  Não é necessário criar um projeto novo completo. Vocês podem fazer esses exercícios em um editor de texto simples (VSCode, Notepad) ou mentalmente, escrevendo a estrutura.
2.  Para o **Exercício 4**, usem um CodeSandbox ou apenas escrevam o código do componente.

-----

### **📁 Exercício 1: O Desafio da Reorganização (10 minutos)**

**Objetivo:** Aplicar a estrutura de pastas recomendada para separar responsabilidades.

**Cenário:** Você entrou em um projeto onde o desenvolvedor anterior salvou todos os arquivos na raiz ou em pastas aleatórias. A estrutura atual é esta:

```text
projeto-caos/
├── App.tsx
├── UserProfile.tsx      (Tela)
├── logo-pequena.png
├── api.ts
├── styles.ts
├── PrimaryButton.tsx    (Componente reutilizável)
├── Login.tsx            (Tela)
├── routes.tsx
├── util-setas.svg
├── background.jpg
├── Card.tsx             (Componente reutilizável)
└── userRedux.ts
```

**Tarefa:**
Reescreva essa árvore de arquivos organizando-a dentro de uma pasta `src/`, seguindo as categorias aprendidas (assets, components, screens, navigation, redux, etc.). Crie as subpastas que julgar necessárias.

**Pontos para discussão:**

  * Onde você colocou o arquivo `api.ts`? (A pílula não especificou, mas onde ele se encaixaria melhor numa estrutura escalável?)
  * Qual a vantagem de separar `PrimaryButton` e `Card` em pastas próprias (ex: `components/Button/index.tsx`) ao invés de deixar o arquivo solto?

-----

### **🧩 Exercício 2: O Poder do Barrel File (Index.ts) (5 minutos)**

**Objetivo:** Simplificar importações usando a técnica de exportação centralizada.

**Cenário:** Na tela `UserProfile.tsx`, as importações estão assim:

```tsx
// UserProfile.tsx (Antes)
import { Header } from '../../components/Header/index';
import { Avatar } from '../../components/Avatar/index';
import { Button } from '../../components/Button/index';
import { Label } from '../../components/Label/index';
```

**Tarefa:**

1.  Escreva como deveria ser o arquivo `src/components/index.ts` para agrupar esses componentes.
2.  Reescreva as importações do `UserProfile.tsx` utilizando esse novo arquivo index.

**Pontos para discussão:**

  * Além de diminuir linhas de código, qual a vantagem disso se decidirmos mudar o nome da pasta do componente `Avatar` no futuro?
  * Existe alguma desvantagem em carregar todos os componentes de um único lugar? (Performance vs. Praticidade).

-----

### **🪝 Exercício 3: Adeus `../../../../` (Root Imports) (5 minutos)**

**Objetivo:** Entender a legibilidade ganha com *Path Aliases*.

**Cenário:** Você está trabalhando em um componente muito profundo na árvore, localizado em `src/screens/Settings/Profile/Edit/EditForm.tsx`. Você precisa importar um ícone de seta que está lá na base do projeto.

**Importação Atual:**

```tsx
import ArrowLeft from '../../../../../assets/svgs/ArrowLeft';
```

**Tarefa:**
Considerando que configuramos o `babel-plugin-root-import` (ou o `tsconfig` no ReactJS) para usar o símbolo `@` como alias para a pasta `src`, reescreva a importação acima.

**Pontos para discussão:**

  * Se refatorarmos o projeto e movermos o arquivo `EditForm.tsx` para outra pasta, o que acontece com a importação antiga (com `../`) e o que acontece com a nova (com `@/`)?

-----

### **🔁 Exercício 4: O Componente "Wrapper" Flexível (15 minutos)**

**Objetivo:** Criar um componente reutilizável que aceita todas as props do componente original (Spread Operator).

**Tarefa:**
Vamos criar um componente chamado `CustomInput` para o nosso Design System.

1.  Ele deve ser baseado no `TextInput` do React Native (ou `input` do HTML/React).
2.  Ele deve ter um estilo padrão (ex: borda cinza, padding 10px).
3.  **O desafio:** Ele deve aceitar uma prop extra chamada `label` (texto que aparece acima do input), mas **também deve aceitar qualquer outra propriedade** que um Input normal aceitaria (`placeholder`, `onChangeText`, `secureTextEntry`, etc.) sem que precisemos declarar uma por uma.

**Esqueleto para completar:**

```tsx
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Defina a tipagem se quiser, ou use any para o exercício rápido
// interface Props extends TextInputProps { ... }

export function CustomInput({ label, ...rest }) { // Dica: use o ...rest
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TextInput 
        style={styles.input}
        // O que falta aqui para repassar todas as outras props?
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

**Pontos para discussão:**

  * O que o operador `...rest` (ou `...props`) faz exatamente nesse contexto?
  * Por que essa padronização é vital para um Design System? O que aconteceria se cada desenvolvedor criasse um input com uma borda de cor levemente diferente?

-----

### **🧠 Desafio Bônus: Organização de Imagens (Mental)**

**Objetivo:** Planejar a gestão de assets para múltiplas resoluções.

**Tarefa:**
Você recebeu um design no Figma que tem um ícone de "Sacola de Compras". O designer exportou 3 arquivos para garantir a qualidade no iPhone:

  * `bag.png`
  * `bag@2x.png`
  * `bag@3x.png`

Como você organizaria esses arquivos na pasta `src/assets/images` e como faria a exportação deles no `index.ts` para que, ao usar na tela, o React Native escolha automaticamente a melhor resolução?

**Pontos para discussão:**

  * O React Native lida nativamente com os sufixos `@2x` e `@3x`. Como a estrutura de pastas ajuda ou atrapalha esse comportamento automático?

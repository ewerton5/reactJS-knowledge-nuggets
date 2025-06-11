###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/005-react-context-api.md)

# 📘 Pílula de Conhecimento 06 — Organização e Reutilização de Componentes (Design System na prática)

A organização de um projeto front-end ou mobile é um pilar fundamental para garantir um código limpo, escalável e de fácil manutenção. Ao adotar um **Design System** e boas práticas de estruturação, equipes de desenvolvimento conseguem construir aplicações de forma mais rápida e consistente.

## ✨ Por que usar um Design System?

Um Design System é um conjunto de padrões, componentes e diretrizes que unificam o design e o desenvolvimento de um produto. Ele funciona como uma "fonte única da verdade", garantindo que todos os elementos da interface do usuário sejam consistentes e reutilizáveis.

* **Reutilização de componentes visuais:** Evita a duplicação de código e acelera o desenvolvimento.
* **Consistência na experiência do usuário:** Garante que a interface seja coesa em todas as partes da aplicação.
* **Maior produtividade no desenvolvimento:** Desenvolvedores podem montar telas rapidamente usando peças prontas.
* **Facilidade na manutenção e evolução do código:** Uma mudança no componente base se reflete em todos os locais onde ele é usado.

---

## 📁 Estrutura de pastas recomendada

Uma estrutura de pastas bem definida é o primeiro passo para um projeto organizado. Ela separa as responsabilidades da aplicação em diretórios lógicos, tornando mais fácil encontrar, modificar e adicionar novas funcionalidades.

### 🧱 Exemplo para projetos React Native

A estrutura abaixo separa os **ativos** (imagens, fontes), **componentes** reutilizáveis, **telas**, **navegação** e **lógica de estado** (Redux), criando um esqueleto robusto e escalável para a aplicação.

```bash
src/
├── assets/
│   ├── images/
│   │   ├── banner.png
│   │   ├── banner2.png
│   │   └── index.ts
│   └── svgs/
│       ├── ArrowUp.tsx
│       ├── ArrowDown.tsx
│       └── index.ts
├── components/
│   ├── Button/
│   │   ├── index.tsx
│   │   └── styles.ts
│   └── index.ts
├── screens/
│   ├── Home/
│   │   ├── index.tsx
│   │   └── styles.ts
│   └── index.ts
├── navigation/
│   └── AppNavigator.tsx
├── redux/
│   ├── store.ts
│   ├── slices/
│   │   └── userSlice.ts
└── App.tsx
```

---

## 🧩 Organização de ícones SVG com exportação centralizada

Centralizar a exportação de ícones SVG em um único arquivo `index.ts` (conhecido como *barrel file*) simplifica sua importação em outras partes do código. Isso evita caminhos de importação longos e repetitivos, além de facilitar a localização e o gerenciamento dos ícones.

### 📂 `src/assets/svgs/index.ts`

```ts
export { default as ArrowUp } from "./ArrowUp";
export { default as ArrowLeft } from "./ArrowLeft";
export { default as ArrowRight } from "./ArrowRight";
export { default as ArrowDown } from "./ArrowDown";
```

---

## 🖼️ Organização de imagens com agrupamento

De forma semelhante aos ícones, agrupar todas as imagens estáticas (como PNGs e JPGs) em um objeto exportado por um `index.ts` cria um ponto de acesso único e organizado. Isso melhora a legibilidade e a manutenibilidade, além de permitir o uso de tipagem para autocompletar.

### 📂 `src/assets/images/index.ts`

```ts
import { ImageRequireSource } from "react-native";

import Banner from "./banner.png";
import Banner2 from "./banner2.png";

const Images: Record<string, ImageRequireSource> = {
  Banner,
  Banner2,
};

export default Images;
```

### 🖼️ **Boas práticas para iOS**

Plataformas como iOS exigem imagens em diferentes resoluções para se adaptar a telas com densidades de pixels variadas (ex: `@2x`, `@3x`). Essa prática garante que os recursos visuais sejam sempre nítidos e bem definidos, independentemente do dispositivo.

* iOS usa imagens baseadas na densidade da tela: `@2x`, `@3x`.
* Ferramentas para gerar essas imagens:
    * **Figma**: Oferece a funcionalidade de exportação com escalas diferentes.
    * Site externo: [https://nsimage.brosteins.com](https://nsimage.brosteins.com)

---

## 🔄 Organização de rotas

Manter as configurações de navegação em um diretório dedicado (`navigation` ou `routes`) centraliza a gestão do fluxo de telas da aplicação. Isso torna mais simples adicionar, remover ou proteger rotas, tanto em aplicações web quanto mobile.

### 📱 Exemplo com React Navigation (React Native)

O `AppNavigator` é o componente responsável por gerenciar toda a pilha de navegação do aplicativo, definindo quais telas existem e como o usuário transita entre elas.

```ts
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/Home";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

### 🌐 Exemplo com React Router DOM (ReactJS)

Para a web, o `React Router DOM` permite mapear URLs do navegador para componentes React específicos, controlando o que é renderizado em cada endereço.

```tsx
// src/routes/index.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../screens/Home";

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

---

## 🪝 Configurando Root Imports com `babel-plugin-root-import`

Os *Root Imports* (ou *alias de caminho*) permitem importar módulos usando um caminho absoluto a partir da raiz do projeto (`src/`) em vez de caminhos relativos (ex: `../../components/Button`). Isso elimina a confusão dos `../` e torna o código mais limpo e fácil de refatorar.

Normalmente usa-se `~` ou `@` como prefixo.

### 🔧 React Native (com Babel)

No ambiente React Native, o `babel-plugin-root-import` modifica a forma como o Babel resolve os caminhos dos módulos durante o processo de compilação.

```bash
npm install --save-dev babel-plugin-root-import
```

#### 📄 babel.config.js

Este arquivo de configuração instrui o Babel a tratar `@/` como um atalho para o diretório `src/`.

```js
module.exports = {
  presets: ["module:metro-react-native-babel-preset"],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        rootPathPrefix: "@",
        rootPathSuffix: "src",
      },
    ],
  ],
};
```

#### 📦 Exemplo de importação

Agora, as importações se tornam mais curtas, diretas e independentes da localização do arquivo atual.

```ts
import Button from "@/components/Button";
import Images from "@/assets/images";
```

---

## ⚛️ ReactJS com Webpack ou Vite

Em projetos web modernos com ferramentas como Vite ou Webpack, a configuração de *alias* é feita diretamente nos arquivos de configuração do bundler e do TypeScript.

### 🔧 Com Vite

Para o Vite, é necessário configurar o alias em dois locais: no `tsconfig.json` para que o TypeScript e o VSCode entendam os caminhos, e no `vite.config.ts` para que o próprio Vite resolva os módulos durante o build.

#### 📄 tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

#### 📄 vite.config.ts

```ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

---

### 🧱 Node.js (com `tsconfig-paths`)

Para usar alias de caminho em um projeto back-end com Node.js e TypeScript, a biblioteca `tsconfig-paths` pode ser usada para registrar os caminhos definidos no `tsconfig.json` antes de executar a aplicação.

#### 📄 tsconfig.json

```json
{
  "compilerOptions": {
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"]
    }
  }
}
```

#### 📄 package.json (incluir no script)

O comando `-r tsconfig-paths/register` "ensina" o Node.js a entender os caminhos com `@/` em tempo de execução.

```json
"scripts": {
  "start": "ts-node -r tsconfig-paths/register src/index.ts"
}
```

---

## 🧠 Dica extra: exportação de componentes globais

Essa é outra aplicação da técnica de *barrel file*. Ao exportar todos os componentes principais a partir de um `index.ts` na pasta `components`, você pode importá-los em uma única linha, mantendo o código das telas mais limpo.

### 📂 `src/components/index.ts`

```ts
export { default as Button } from "./Button";
export { default as Header } from "./Header";
export { default as Card } from "./Card";
```

### 💡 E o uso:

Em vez de três linhas de importação, usamos apenas uma, desestruturando os componentes necessários.

```tsx
import { Button, Header } from "@/components";
```

### 🔁 **Reutilização de Props**

Para criar componentes que "envolvem" outros (Wrapper Components) sem perder flexibilidade, é uma boa prática passar todas as propriedades do componente original usando o *spread operator* (`...`). Isso garante que seu componente customizado possa aceitar todas as props do componente que ele encapsula.

* Utilização de **desestruturação** para acessar variáveis internas.
* Passagem de props para componentes customizados reutilizando todos os parâmetros do original:

    ```tsx
    <CustomModal {...modalizeProps} />
    ```

---

## 📌 Conclusão

A organização de um projeto com base em um Design System vai muito além do visual: ela impacta diretamente na produtividade da equipe e na escalabilidade da aplicação. Invista tempo na estrutura inicial, aproveite ferramentas como *root imports* para limpar seu código e mantenha uma arquitetura de pastas clara e modular. Esses hábitos criam uma base sólida para o crescimento sustentável de qualquer projeto.

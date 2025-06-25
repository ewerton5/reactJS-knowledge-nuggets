###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/012-react-query.md)

# 📘 Pílula de Conhecimento 13 — Boas Práticas e Padronização de Código

Além de uma estrutura de pastas bem organizada, a longevidade e a manutenibilidade de um projeto dependem de um conjunto de regras e configurações que garantem a padronização do código. Essas regras são definidas em arquivos na raiz do projeto, que automatizam a formatação, a verificação de erros e a conformidade do código, permitindo que a equipe de desenvolvimento foque em construir funcionalidades.

## 1\. Gerenciamento de Ambiente e Segredos (`.env`)

O arquivo `.env` é usado para armazenar variáveis de ambiente. Seu principal objetivo é guardar informações sensíveis que não devem ser enviadas para o repositório do Git.

- **Utilização:** Armazenar chaves de API, tokens, senhas ou qualquer outra credencial.
- **Segurança:** O arquivo `.env` **deve sempre** estar listado no `.gitignore`.
- **Comunicação:** Crie um arquivo `.env.example` com a estrutura das variáveis necessárias, mas com valores vazios. Isso informa a outros desenvolvedores quais chaves eles precisam configurar em suas máquinas locais.
- **Controle de Ambiente:** Permite configurar diferentes comportamentos para desenvolvimento, teste e produção (ex: habilitar um mock de API como o MirageJS apenas em desenvolvimento).

**Exemplo de `.env.example`:**

```env
API_URL=
API_KEY=
# Ativa o mock de API (true/false)
REACT_APP_MIRAGE_ENABLED=
```

---

## 2\. Controle de Versão e Formatação

### `.gitignore`

Este arquivo instrui o Git sobre quais arquivos e pastas ignorar. O template padrão do React/React Native já inclui as pastas mais comuns, como `node_modules/`, `build/` e arquivos de sistema operacional.

### `.prettierrc`

O Prettier é um formatador de código opinativo. O arquivo `.prettierrc` define as regras de formatação (uso de aspas simples ou duplas, ponto e vírgula, etc.) para todo o projeto.

- **Importância:** Garante um estilo de código visualmente consistente, independentemente de quem o escreveu. Isso evita "ruído" nos _diffs_ do Git, onde as alterações seriam apenas de formatação.

**Exemplo de `.prettierrc.js`:**

```js
module.exports = {
  arrowParens: "avoid", // Não adiciona parênteses em arrow functions com um só parâmetro
  bracketSpacing: true, // Adiciona espaços entre chaves em literais de objeto.
  singleQuote: false, // Usa aspas duplas por padrão
  semi: true, // Adiciona ponto e vírgula no final das linhas
  trailingComma: "all", // Adiciona vírgula no final de objetos e arrays multilinhas
};
```

---

## 3\. Garantindo a Qualidade do Código com ESLint

O **ESLint** é a ferramenta mais importante para a qualidade do código. Ele analisa seu código estaticamente para encontrar problemas e forçar padrões. A configuração moderna (`flat config`) permite uma organização modular e clara.

- **Funções:**
  - **Encontrar Erros:** Aponta erros de sintaxe e bugs lógicos (ex: variáveis não utilizadas).
  - **Forçar Padrões:** Garante que o time siga as mesmas convenções (ex: ordem de importação, nomenclatura de variáveis).
  - **Melhorar a Legibilidade:** Sugere boas práticas que tornam o código mais limpo.

O arquivo `eslint.config.mjs` contém toda a sua configuração, incluindo plugins para tecnologias específicas (React, TypeScript, etc.) e as regras que devem ser aplicadas.

- **Plugins Essenciais:** A configuração integra plugins para TypeScript (`@typescript-eslint`), React (`eslint-plugin-react`), React Hooks, React Native e ordem de importação.

- **Regras Chave:** Algumas das regras mais impactantes configuradas são:

  - `prettier/prettier`: Integra as regras do Prettier, garantindo que a formatação seja tratada como parte da qualidade do código.
  - `import/order`: Força uma ordem lógica para os `import`, separando bibliotecas externas de componentes internos, o que melhora muito a legibilidade.
  - `react-hooks/rules-of-hooks` e `exhaustive-deps`: Regras **essenciais** que garantem o uso correto dos Hooks no React, evitando bugs complexos.
  - `@typescript-eslint/no-explicit-any`: Gera um aviso ao usar o tipo `any`, incentivando uma tipagem mais forte e segura.
  - `no-console`: Permite o uso de `console.warn`, `error` e `info`, mas gera um aviso para `console.log`, ajudando a evitar que logs de debug sejam enviados para produção.
  - `react/function-component-definition`: Padroniza a forma de declarar componentes (neste caso, como `arrow-function`).

- **Configuração por Arquivo:** Uma grande vantagem da `flat config` é a capacidade de aplicar regras diferentes para arquivos específicos, relaxando restrições em arquivos de configuração que não precisam seguir as mesmas regras da base de código da aplicação.

**Exemplo de regra no `.eslintrc.js`:**

```js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactNative from "eslint-plugin-react-native";
import prettierPlugin from "eslint-plugin-prettier";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts,jsx,tsx}"] },
  { languageOptions: { globals: globals.es2023 } },
  { ignores: ["node_modules", "android", "ios", "**/*.d.ts"] },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{ts,tsx,js}"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        ...globals.node,
        ...globals.browser,
        __DEV__: "readonly",
      },
    },
    settings: {
      react: { version: "detect" },
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
        node: true,
      },
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-native": reactNative,
      prettier: prettierPlugin,
      import: importPlugin,
    },
    rules: {
      "prettier/prettier": [
        "warn",
        {
          arrowParens: "avoid",
          bracketSameLine: false,
          bracketSpacing: true,
          singleQuote: false,
          trailingComma: "all",
        },
      ],
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling", "index"],
          ],
          pathGroups: [
            {
              pattern: "../**",
              group: "parent",
              position: "before",
            },
            {
              pattern: "./**",
              group: "sibling",
              position: "after",
            },
          ],
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "@typescript-eslint/no-unused-expressions": "off",
      "react-native/no-inline-styles": "warn",
      "no-shadow": "off",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "react/prop-types": "off",
      "react/jsx-props-no-spreading": "off",
      "react/no-unused-prop-types": "off",
      "no-unused-expressions": "off",
      "import/no-unresolved": "off",
      "no-console": ["warn", { allow: ["warn", "error", "info"] }],
      "react/require-default-props": "off",
      "react/jsx-filename-extension": [
        1,
        { extensions: [".tsx", ".ios.tsx", ".android.tsx", ".js"] },
      ],
      "no-nested-ternary": "off",
      "no-use-before-define": "off",
      "@typescript-eslint/no-use-before-define": ["error"],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/ban-ts-comment": ["warn"],
      "react/react-in-jsx-scope": "off",
      "import/prefer-default-export": "off",
      "no-underscore-dangle": "off",
      "react/function-component-definition": [
        "warn",
        { namedComponents: "arrow-function" },
      ],
    },
  },
  {
    files: [
      ".prettierrc.js",
      "jest.config.js",
      "babel.config.js",
      ".eslintrc.js",
      "react-native.config.js",
    ],
    languageOptions: { parserOptions: { project: null } },
    rules: { "no-undef": "off" },
  },
  {
    files: ["metro.config.js"],
    languageOptions: { parserOptions: { project: null } },
    rules: {
      "@typescript-eslint/no-require-imports": "off",
      "no-undef": "off",
    },
  },
  {
    files: ["__tests__/App.test.tsx"],
    rules: { "import/order": "off" },
  },
];
```

---

## 4\. Automação com Git Hooks (Husky & `lint-staged`)

Para garantir que as regras sejam sempre seguidas, automatizamos a verificação usando **Git Hooks**, que são scripts executados em momentos específicos do ciclo do Git.

- **`Husky`:** Uma ferramenta que facilita a configuração de Git Hooks.
- **`lint-staged`:** Um script que executa linters (como ESLint e Prettier) **apenas nos arquivos que foram modificados e estão no "stage"** para serem commitados. Isso torna a verificação extremamente rápida.
- **`commitlint`:** Garante que as mensagens de commit sigam um padrão convencional (ex: `feat: add new button`).

**O fluxo de pré-commit automatizado:**

1.  O desenvolvedor executa `git commit`.
2.  O **Husky** intercepta a ação e dispara o hook `pre-commit`.
3.  O hook executa o **`lint-staged`**.
4.  O `lint-staged` roda o **ESLint** e o **tsc** nos arquivos modificados.
5.  Se algum erro for encontrado e não puder ser corrigido automaticamente, o commit é **bloqueado**.
6.  Se tudo estiver certo, o commit é realizado.

Essa automação é a chave para manter a qualidade do código alta sem depender da verificação manual de cada desenvolvedor.

**Exemplo de `lint-staged.config.js`:**

```js
module.exports = {
  // Para todos os arquivos .ts e .tsx modificados...
  "*.{ts,tsx}": [
    "eslint --fix --max-warnings=0", // 1. Roda o ESLint, tenta corrigir e falha se houver qualquer aviso
    () => "tsc", // 2. Roda o compilador TypeScript para checar erros de tipo
    "git add", // 3. Adiciona os arquivos que o ESLint corrigiu
  ],
};
```

Este fluxo de pré-commit é um poderoso guardião da qualidade:

1.  **Formatação e Análise de Padrões:** O ESLint garante a conformidade do código. A regra `--max-warnings=0` é estrita e muito eficaz.
2.  **Verificação de Tipos:** O `tsc` garante que não há erros de tipagem, prevenindo uma classe inteira de bugs em tempo de execução.

## 5\. A Regra de Ouro: Preserve os Arquivos de Template

Projetos React Native vêm com vários arquivos de configuração essenciais (`metro.config.js`, `babel.config.js`, `jest.config.js`, etc.).

**É uma boa prática modificar esses arquivos o mínimo possível.**

Manter a estrutura original facilita enormemente o processo de **atualização de versão do React Native**. A ferramenta de upgrade compara seus arquivos com os da nova versão do template. Se os seus arquivos estiverem muito diferentes, a ferramenta não conseguirá aplicar as atualizações automaticamente, forçando um processo manual longo e propenso a erros. Mantenha-os limpos, e as atualizações serão muito mais suaves.

## ✅ Conclusão

Pode parecer um excesso de arquivos de configuração, mas juntos eles formam um ecossistema poderoso que serve como o "sistema imunológico" do seu projeto. Eles garantem que:

- **Segredos** fiquem seguros.
- O **estilo do código** seja uniforme.
- **Erros e más práticas** sejam pegos antes mesmo de chegarem ao repositório.
- A **colaboração em equipe** seja fluida e sem atritos de formatação.

Investir tempo em uma configuração sólida de padronização é o que permite que um projeto cresça de forma saudável e sustentável.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/014-automated-testing.md) 👉

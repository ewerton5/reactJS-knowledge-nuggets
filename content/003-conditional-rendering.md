###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/002-controlled-vs-uncontrolled.md)

# 📘 Pílula de Conhecimento 03 — Renderização Condicional

**Renderização condicional** é a técnica que permite ao React exibir ou ocultar componentes e elementos com base em uma condição. É o mecanismo fundamental que torna as interfaces "vivas", adaptando-se a diferentes cenários, como o status de login de um usuário, permissões, carregamento de dados ou qualquer outra variável de estado da aplicação.

---

## ✅ Estratégias de Renderização Condicional

Dominar as diferentes formas de renderização condicional permite escrever um código mais limpo e adequado para cada situação.

### 1. A Abordagem Clássica: `if / else`

A estrutura `if / else` tradicional do JavaScript é a mais explícita e poderosa. É ideal para cenários com lógica mais complexa ou quando você precisa retornar blocos de JSX completamente diferentes. Por sua natureza de ser uma declaração (statement) e não uma expressão, ela é utilizada **fora do `return` do JSX**.

```jsx
function AuthStatus({ isLoggedIn }) {
  if (isLoggedIn) {
    return <Dashboard />;
  } else {
    return <LoginScreen />;
  }
}
```

> 🔎 **Quando usar:** Perfeito para lógicas de múltiplas etapas ou quando a condição determina a estrutura inteira do componente a ser retornado.

---

### 2. A Escolha Rápida: Operador Ternário (`condição ? valor1 : valor2`)

O operador ternário é uma forma concisa de um `if / else` que funciona como uma expressão, tornando-o perfeito para ser usado **diretamente dentro do JSX**. Ele avalia uma condição e retorna um de dois valores.

```jsx
function AuthStatus({ isLoggedIn }) {
  return (
    <div>
      <h1>Bem-vindo!</h1>
      {isLoggedIn ? <Dashboard /> : <LoginScreen />}
    </div>
  );
}
```

> 🔁 **Quando usar:** Ideal para alternar entre dois componentes ou elementos de forma simples e legível. Evite aninhar ternários, pois isso pode rapidamente tornar o código confuso.

---

### 3. A Solução Elegante para Exibição Única: Operador Lógico `&&`

O operador lógico E (`&&`) aproveita o comportamento de **curto-circuito** do JavaScript para renderizar um elemento somente se uma condição for verdadeira.

```jsx
function Notifications({ messages }) {
  return (
    <div>
      {messages.length > 0 && <NotificationBadge count={messages.length} />}
    </div>
  );
}
```

**Como funciona?**
Se a expressão à esquerda do `&&` for "truthy" (verdadeira), o JavaScript avalia e retorna a expressão à direita (no caso, seu componente). Se for "falsy" (falsa), ele para e retorna o valor "falsy", e o React não renderiza nada (ou tenta renderizar o valor "falsy", como veremos a seguir).

> ✅ **Quando usar:** É a forma mais limpa e comum para exibir ou ocultar um único elemento com base em uma condição.

---

## ⚠️ Cuidado com Valores "Falsy" no Curto-Circuito `&&`

O curto-circuito com `&&` é poderoso, mas pode levar a bugs. Lembre-se que em JavaScript, os seguintes valores são "falsy": `false`, `0`, `""` (string vazia), `null`, `undefined` e `NaN`.

Se a condição for `0`, o React para web tentará renderizar `0` na tela.
**Exemplo de Bug no React para Web:**

```jsx
const [itemCount, setItemCount] = useState(0);

// Se itemCount for 0, isso irá renderizar o número 0 na tela!
return <div>{itemCount && <p>Você tem itens no carrinho.</p>}</div>;
```
Este comportamento já não é o ideal, mas no React Native, a consequência é muito pior.

---

## 🛑 Cuidado Essencial: React Native e a Renderização de Primitivos

Em React Native, a regra é muito mais estrita: **qualquer valor de texto, incluindo strings e números, NÃO pode ser renderizado diretamente no JSX**. Eles devem, obrigatoriamente, estar dentro de um componente `<Text>`.

Isso significa que o bug do `itemCount` sendo `0`, que apenas exibe um "0" na web, **causa um erro fatal que quebra a aplicação** em React Native. O mesmo vale para strings vazias.

**Código que QUEBRA em React Native:**
```jsx
// Ambas as linhas abaixo causarão o mesmo erro fatal em React Native.
{itemCount && <View />}      // Se itemCount for 0, tenta renderizar 0 -> ERRO
{errorMsg && <View />}       // Se errorMsg for "", tenta renderizar "" -> ERRO
```

O aplicativo irá travar e exibir o erro:
`Invariant Violation: Text strings must be rendered within a <Text> Component.`

**A Solução Definitiva (Web e Native):**
Para evitar o problema em ambas as plataformas, sempre garanta que a condição seja um booleano puro (`true` ou `false`).

```jsx
// Solução 1: Usar uma expressão lógica que retorne um booleano
return <View>{itemCount > 0 && <Component />}</View>;

// Solução 2: Converter explicitamente para booleano com a dupla negação (!!)
return <View>{!!errorMsg && <Component />}</View>;
```

---

## 🧠 Conclusão

A renderização condicional é essencial para a criação de UIs dinâmicas. Para escolher a melhor abordagem, siga esta regra prática:

* **Lógica complexa ou múltiplos retornos?** Use a declaração `if / else` fora do JSX.
* **Alternar entre duas opções dentro do JSX?** Use o **operador ternário (`? :)`**.
* **Mostrar ou ocultar um único elemento?** Use o **operador lógico `&&`**, mas **SEMPRE** garanta que a condição seja um booleano (`true`/`false`) para evitar bugs — especialmente o erro fatal de renderização no React Native.

Dominar essas técnicas e seus detalhes garantirá um código mais robusto, legível e seguro.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/004-jsx-lists.md) 👉

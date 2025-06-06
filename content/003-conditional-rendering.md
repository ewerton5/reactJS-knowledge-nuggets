###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/002-controlled-vs-uncontrolled.md)

# 📘 Pílula de Conhecimento 03 — Renderização Condicional

## 🧩 Conceito Geral

Em React, **renderização condicional** é a prática de exibir ou ocultar elementos com base em condições específicas do código. É uma técnica fundamental para exibir interfaces dinâmicas, adaptando a exibição de componentes de acordo com o estado da aplicação ou outras variáveis.

---

## ✅ Formas de Fazer Renderização Condicional

Existem diferentes formas de realizar renderização condicional em React, sendo as mais comuns:

### 1. Usando `if` ou `if-else`

Essa abordagem é a mais clássica e utiliza a estrutura condicional tradicional do JavaScript. Ideal para condições mais complexas ou múltiplas.

```jsx
if (isLoggedIn) {
  return <Dashboard />;
} else {
  return <LoginScreen />;
}
```

> 🔎 Dica: essa estrutura geralmente aparece fora do `return`.

---

### 2. Usando o Operador Ternário (`condição ? valor1 : valor2`)

O ternário é bastante usado dentro do JSX para retornar um componente ou outro, de forma enxuta.

```jsx
return (
  <>
    {isLoggedIn ? <Dashboard /> : <LoginScreen />}
  </>
);
```

> 🔁 Útil para condições simples e de fácil leitura. Evite ternários aninhados.

---

### 3. Usando o Operador Lógico `&&` (curto-circuito)

A renderização condicional também pode ser feita utilizando o operador **lógico E (`&&`)**, que se aproveita do comportamento de **curto-circuito** do JavaScript.

```jsx
return (
  <>
    {hasWarning && <WarningMessage />}
  </>
);
```

> Isso funciona porque, se `hasWarning` for `false`, o React ignora o segundo valor (o componente) e nada será renderizado.

---

## 💡 Como Funciona o Curto-Circuito

O operador `&&` em JavaScript **não retorna necessariamente `true` ou `false`** — ele retorna o valor do primeiro operando "falsy" encontrado ou o último valor, se todos forem "truthy".

**Exemplo:**

```js
console.log(true && "Olá");      // "Olá"
console.log(false && "Olá");     // false
```

Ou seja, no JSX:

```jsx
{condição && <Componente />}
```

Se `condição` for falsy (`false`, `null`, `undefined`, `0`, `""`...), o React renderiza nada.

---

## ⚠️ Observações sobre Tipagem e Avaliação Booleana

* Nem todo valor usado em uma expressão lógica é um `boolean`.
* No React, quando usamos uma variável em uma renderização condicional, o valor dela é **avaliado logicamente**, mesmo que não seja explicitamente do tipo `boolean`.

Exemplos:

```js
if (nome) { ... }         // funciona mesmo que `nome` seja uma string
Boolean(nome)             // força a conversão para boolean
!nome                     // negação lógica
```

Esse comportamento é útil, mas exige atenção: strings vazias, `0`, `null` ou `undefined` podem causar comportamento inesperado se não forem tratados corretamente.

---

## 📦 Casos Reais

### Exibição de Mensagens ou Componentes Opcionais

```jsx
{mensagemErro && <MensagemErro texto={mensagemErro} />}
```

### Botões e Permissões

```jsx
{isAdmin && <BotaoDeletar />}
```

### Alternância de componentes com ternário

```jsx
{modoEdicao ? <FormularioEdicao /> : <Visualizacao />}
```

---

## ⚠️ Observações sobre React native

* Não se deve usar uma string como condição lógica em um curto circuito dentro do `JSX` pois gerará o erro:

```
Invariant Violation: Text strings must be rendered within a <Text> Component.
```

* Opte por forçar a conversão para booleano usando `Boolean`, uma dupla negação `!!`, ou um operador ternário.

---

## 🧠 Conclusão

A renderização condicional é uma técnica indispensável para criar aplicações React dinâmicas e responsivas ao estado da interface.

* Use `if` quando as condições forem complexas ou fora do JSX.
* Prefira o **operador ternário** para retornos binários simples dentro do JSX.
* Utilize o **operador lógico `&&`** quando quiser renderizar um único componente baseado em uma condição.

> ✅ Conhecer o **comportamento de curto-circuito do JavaScript** é essencial para utilizar essas técnicas com clareza e segurança.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/004-jsx-lists.md) 👉

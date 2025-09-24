###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/001-react-fundamentals.md)

# 📘 Pílula de Conhecimento 02 — Componentes Controlados vs. Não Controlados

Gerenciar dados de formulários (`<input>`, `<select>`, `<textarea>`) é uma tarefa central em qualquer aplicação interativa. Em React, existem duas abordagens principais para lidar com essa tarefa: o padrão de **componentes controlados** e o de **componentes não controlados**. A escolha entre eles impacta a forma como os dados fluem, são validados e gerenciados pela sua aplicação.

---

## ✅ Componentes Controlados (Controlled Components)

### Definição

Em um componente controlado, os dados do formulário são gerenciados pelo **estado do React**. O valor do campo de input é diretamente vinculado a uma variável de estado, e qualquer alteração é feita através de uma função que atualiza esse estado. Isso torna o estado do React a **"fonte única da verdade"** (*single source of truth*).

### Como funciona:

```jsx
import { useState } from 'react';

function ControlledForm() {
  const [name, setName] = useState("");

  return (
    <input
      type="text"
      value={name} // 2. O valor do input é determinado pelo estado.
      onChange={(e) => setName(e.target.value)} // 1. A cada digitação, o estado é atualizado.
    />
  );
}
```

O fluxo é circular e explícito:
1.  O usuário digita no campo, disparando o evento `onChange`.
2.  A função `setName` atualiza o estado `name`.
3.  O componente renderiza novamente.
4.  O `value` do input reflete o novo valor do estado `name`.

### Vantagens

* **Controle Total:** Você tem controle total sobre o valor em todos os momentos.
* **Previsibilidade:** O fluxo de dados é explícito e fácil de rastrear.
* **Validação Instantânea:** É simples implementar validações a cada alteração (ex: contar caracteres, verificar formato enquanto o usuário digita).

### Desvantagens

* **Verbosidade:** Exige mais código para formulários simples.
* **Performance:** Cada alteração no input causa uma nova renderização, o que pode ser um problema de performance em formulários muito grandes e complexos.

---

## ❎ Componentes Não Controlados (Uncontrolled Components)

### Definição

Em um componente não controlado, o formulário mantém seu **próprio estado interno no DOM**. Em vez de gerenciar o valor via `useState`, você permite que o próprio campo armazene seus dados e os acessa de forma imperativa quando necessário, geralmente usando uma **ref** (`useRef`).

### Como funciona:

```jsx
import { useRef } from 'react';

function UncontrolledForm() {
  const inputRef = useRef(null); // 1. Cria uma ref para acessar o nó do DOM.

  const handleSubmit = (event) => {
    event.preventDefault();
    // 2. Acessa o valor diretamente do DOM quando necessário.
    alert(`O nome é: ${inputRef.current.value}`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" ref={inputRef} />
      <button type="submit">Enviar</button>
    </form>
  );
}
```
Aqui, o React não "sabe" qual é o valor do input até que você o "pergunte" diretamente através da `ref`.

### Vantagens

* **Simplicidade:** Menos código para formulários simples.
* **Performance:** Como o estado não é atualizado a cada digitação, não há re-renderizações desnecessárias.
* **Integração Fácil:** Funciona bem com bibliotecas de terceiros que manipulam o DOM diretamente.

### Desvantagens

* **Fluxo de Dados Implícito:** O acesso aos dados é imperativo, tornando mais difícil rastrear e reagir às mudanças em tempo real.
* **Validação mais Complexa:** A validação geralmente ocorre apenas na submissão do formulário.

---

## 📦 Padrões e Casos de Uso

### Interações Imperativas (Refs)

Componentes não controlados são o padrão quando precisamos dar "comandos" a um elemento, como focar um campo ou controlar uma biblioteca externa. Um exemplo clássico é o controle de um modal:

```jsx
// A ref é usada para chamar métodos do componente Modalize
const modalRef = useRef(null);

// Abre o modal de forma imperativa
modalRef.current?.open();

// Fecha o modal
modalRef.current?.close();
```

### O Melhor dos Dois Mundos: Bibliotecas de Formulários

Bibliotecas como **React Hook Form** e **Formik** oferecem uma solução híbrida genial:
* **Internamente**, elas usam a abordagem de **componentes não controlados** para garantir alta performance, registrando os campos com `ref`.
* **Externamente**, elas expõem uma API com **Hooks** que se parece com a abordagem **controlada**, facilitando o acesso aos valores, o gerenciamento de estado e, principalmente, a validação.

Isso combina a performance dos componentes não controlados com a legibilidade e o poder dos controlados.

---

## ✅ A Importância da Validação

Validar dados de entrada é uma etapa inegociável para garantir a integridade dos dados e uma boa experiência do usuário (UX). **Todo formulário, mesmo que tenha um único campo, deve ter algum tipo de validação.**

Para isso, usamos esquemas de validação com bibliotecas como **Yup** ou **Zod**.

* **Yup:** Biblioteca tradicional e robusta, muito usada com Formik e React Hook Form.
* **Zod:** Abordagem moderna, focada em TypeScript, que oferece inferência de tipos a partir do esquema de validação.

### Exemplo de esquema com Yup:

```ts
import * as yup from 'yup';

const loginSchema = yup.object().shape({
  email: yup.string().email('Formato de e-mail inválido').required('O e-mail é obrigatório'),
  password: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('A senha é obrigatória'),
});
```

### Exemplo de esquema com Zod:

```ts
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email({ message: 'Formato de e-mail inválido' }),
  password: z.string().min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
});
```

---

## 🧠 Conclusão

Embora componentes não controlados tenham seu lugar, especialmente em otimizações de performance e integrações, a abordagem de **componentes controlados é geralmente preferível** para a maioria dos casos de uso em React. Eles oferecem um código mais legível, um fluxo de dados explícito e uma integração natural com regras de negócio e validações em tempo real.

**Recomendação:** Para formulários, comece com o padrão de **componentes controlados**. Se a aplicação crescer e a performance se tornar um problema, adote uma biblioteca como o **React Hook Form** em conjunto com **Zod** ou **Yup**.

👉 [Clique aqui para praticar com exercícios](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/exercises/002-controlled-vs-uncontrolled.md)

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/003-conditional-rendering.md) 👉

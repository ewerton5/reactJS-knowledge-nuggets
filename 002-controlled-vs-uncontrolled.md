# 📘 Pílula de Conhecimento 02 — Componentes Controlados vs. Não Controlados

## 🧩 Conceito Geral

Em React, os **componentes controlados** e **não controlados** definem diferentes abordagens de manipulação de dados em campos de formulário (inputs, selects, textareas, etc.).

---

## ✅ Componentes Controlados

### Definição

Nos componentes controlados, o valor do input é **controlado via estado React**. A cada digitação ou alteração no campo, o estado do componente é atualizado, e o valor do input é diretamente associado a esse estado.

### Exemplo:

```jsx
const [name, setName] = useState("");

return (
  <input
    value={name}
    onChange={(e) => setName(e.target.value)}
  />
);
```

### Vantagens

* Fácil de rastrear e validar os dados inseridos.
* Maior previsibilidade do comportamento dos componentes.
* Integração natural com validações.

### Desvantagens

* Pode causar muitas re-renderizações em formulários grandes.

---

## ❎ Componentes Não Controlados

### Definição

Nos componentes não controlados, o input **mantém seu próprio estado interno**, e o acesso ao valor é feito por meio de **refs** (`useRef`).

### Exemplo:

```jsx
const inputRef = useRef();

const handleSubmit = () => {
  console.log(inputRef.current.value);
};

return (
  <>
    <input ref={inputRef} />
    <button onClick={handleSubmit}>Enviar</button>
  </>
);
```

### Vantagens

* Menor número de re-renderizações.
* Útil para bibliotecas que manipulam DOM diretamente (ex: modais, inputs de bibliotecas específicas).

### Desvantagens

* Mais difícil de validar e rastrear o estado do formulário.
* Menor legibilidade e controle lógico do fluxo dos dados.

---

## 📦 Casos Reais

### Bibliotecas como Modalize

Componentes como `Modalize` utilizam refs para abrir e fechar modais:

```jsx
const modalRef = useRef(null);
modalRef.current?.open();
modalRef.current?.close();
```

### Forms em bibliotecas controladas por fora

Bibliotecas como:

* **React Hook Form**
* **Formik**

...utilizam internamente componentes **não controlados**, mas expõem uma interface **controlada**, o que melhora:

* Leitura de código
* Facilidade de manutenção
* Integração com validações

---

## ✅ Validações

### Por que validar sempre?

É essencial adicionar validação a qualquer formulário com inputs — mesmo que tenha **um único campo**. Isso melhora a experiência do usuário, previne erros e garante a integridade dos dados.

### Bibliotecas úteis para validação:

* **Yup** — muito utilizado com React Hook Form
* **Zod** — abordagem moderna e baseada em TypeScript

### Exemplo com Yup:

```ts
const schema = yup.object().shape({
  email: yup.string().email().required(),
});
```

### Exemplo com Zod:

```ts
const schema = z.object({
  email: z.string().email(),
});
```

Esses esquemas são usados para validar os dados antes de submeter o formulário.

---

## 🧠 Conclusão

Apesar da vantagem dos componentes não controlados em termos de performance, os **controlados são mais utilizados** na prática, pois oferecem:

* Código mais legível
* Maior controle de fluxo
* Integração natural com validações e regras de negócio

Por isso, ao criar formulários em React, **prefira componentes controlados** e utilize bibliotecas como React Hook Form junto de Yup ou Zod para garantir uma boa UX e dados consistentes.

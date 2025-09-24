## 🚀 **Oficina Prática: Dominando Formulários em React**

Olá, equipe! A pílula de hoje abordou um tema central: como gerenciamos dados em formulários. Para solidificar esse conhecimento, vamos trabalhar nos exercícios abaixo. O objetivo é sentir na prática as vantagens e desvantagens de cada abordagem.

### **Instruções de Setup:**

1.  Abra um ambiente de desenvolvimento React (CodeSandbox, StackBlitz ou seu projeto local).
2.  Para cada exercício, crie um novo componente (ex: `Exercicio1.js`) e importe-o no seu `App.js` para visualizá-lo.

---

### **✅ Exercício 1: O Padrão Controlado (10 minutos)**

**Objetivo:** Implementar um formulário utilizando o padrão de componente controlado, onde o estado do React é a "fonte única da verdade".

**Tarefa:** Crie um componente `FormularioControlado`.
1.  Crie um formulário simples de login com dois campos: `email` e `senha`.
2.  Use o hook `useState` para criar um estado para cada campo.
3.  Vincule o `value` de cada `<input>` ao seu respectivo estado.
4.  Use o `onChange` de cada `<input>` para atualizar o estado correspondente a cada digitação.
5.  Adicione um parágrafo `<p>` abaixo do formulário que exibe o valor do estado de `email` em tempo real, para que você possa ver a atualização a cada tecla pressionada.
6.  Quando o formulário for submetido, exiba um `alert` ou `console.log` com os valores dos dois estados.

**Pontos para discussão amanhã:**
* Por que o componente re-renderiza a cada tecla digitada?
* Qual é a "fonte única da verdade" neste componente e por que isso é considerado uma vantagem?

---

### **❎ Exercício 2: O Padrão Não Controlado (10 minutos)**

**Objetivo:** Implementar o mesmo formulário utilizando o padrão não controlado, onde o DOM gerencia o estado e o acessamos via `ref`.

**Tarefa:** Crie um componente `FormularioNaoControlado`.
1.  Crie o mesmo formulário de login com campos para `email` e `senha`.
2.  Use o hook `useRef` para criar uma `ref` para cada campo.
3.  Associe cada `<input>` à sua respectiva `ref`. **Não use `value` ou `onChange` ligados ao estado do React.**
4.  Quando o formulário for submetido, acesse os valores diretamente do DOM através de `suaRef.current.value` e exiba-os em um `alert` ou `console.log`.

**Pontos para discussão amanhã:**
* O que acontece quando você digita nos campos? O componente re-renderiza? Como podemos provar isso?
* Onde está a "fonte da verdade" agora?
* Comparando o código com o do Exercício 1, qual parece mais simples para esta tarefa específica?

---

### **🧠 Exercício 3: O Desafio da Validação em Tempo Real (15 minutos)**

**Objetivo:** Entender qual padrão é mais adequado para validações que acontecem enquanto o usuário digita.

**Tarefa:** Crie um componente `ValidadorDeSenha`.
1.  Crie um único campo de input para uma nova senha.
2.  Abaixo do input, exiba mensagens de validação em tempo real para os seguintes critérios:
    * "A senha deve ter pelo menos 8 caracteres."
    * "A senha deve conter pelo menos um número."
3.  As mensagens devem aparecer ou desaparecer **imediatamente** a cada tecla que o usuário pressiona, refletindo o estado atual do campo.
4.  **Implemente a solução utilizando o padrão de componente controlado.**

**Exercício Mental (para a discussão):**
* Como você faria para implementar essa mesma validação em tempo real usando um componente **não controlado**? Seria prático? O que você precisaria adicionar que "quebraria" o propósito do padrão não controlado?

**Pontos para discussão amanhã:**
* Qual padrão foi o encaixe natural para esta tarefa e por quê?
* Este exercício destaca o principal trade-off entre os dois padrões. Qual é ele? (Controle e reatividade vs. Simplicidade e performance).

---

### **👉 Exercício 4: Ações Imperativas com `useRef` (5 minutos)**

**Objetivo:** Usar `ref` para interagir com um elemento do DOM de forma imperativa, uma de suas principais utilidades além de formulários não controlados.

**Tarefa:** Crie um componente `FocoAutomatico`.
1.  Crie um campo de input de texto simples.
2.  Faça com que este campo **receba o foco automaticamente** assim que o componente for montado na tela.
3.  **Dica:** Você precisará combinar `useRef` para obter a referência do input e `useEffect` com um array de dependências vazio (`[]`) para executar a ação de foco na montagem. A ação é `suaRef.current.focus()`.

**Pontos para discussão amanhã:**
* Por que precisamos do `useEffect` para fazer o foco funcionar de forma confiável?
* Esta é uma ação "declarativa" ou "imperativa"? Por quê?

---

### **📦 Desafio Bônus: Integrando Validação com Zod/Yup**

**Objetivo:** Conectar os conceitos aprendidos com ferramentas profissionais de validação.

**Tarefa:**
1.  Escolha uma biblioteca de validação (`npm install zod` ou `npm install yup`).
2.  Pegue o seu `FormularioControlado` do Exercício 1.
3.  Crie um esquema de validação (usando `zod` ou `yup`) para o email e a senha, conforme mostrado na pílula.
4.  Na função de submissão do formulário, em vez de apenas mostrar o `alert`, use o esquema para validar os dados.
5.  Use um bloco `try/catch` para capturar os erros de validação.
6.  Se houver erros, guarde-os em um novo estado (ex: `const [errors, setErrors] = useState({})`) e exiba as mensagens de erro abaixo de cada campo correspondente.

**Pontos para discussão amanhã:**
* Quais as vantagens de declarar as regras de validação em um esquema separado do componente?
* Como este exercício nos prepara para entender o que bibliotecas como React Hook Form fazem por baixo dos panos?

---

Bom trabalho, equipe! Vamos usar esses exercícios para gerar uma ótima discussão amanhã.

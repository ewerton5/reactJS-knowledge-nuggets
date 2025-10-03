### **Soluções dos exercícios: Pílula de Conhecimento 02 em Prática**

Esta série de encontros foi extremamente produtiva. As sessões de revisão se transformaram em aulas práticas interativas que permitiram um aprofundamento notável nos conceitos de gerenciamento de formulários em React. O documento a seguir consolida o código de cada exercício e os principais aprendizados extraídos das discussões em equipe.

-----

#### **Exercício 1: O Padrão Controlado (`FormularioControlado`)**

##### A Solução em Código

```jsx
import React, { useState } from 'react';

export default function FormularioControlado() {
  // 1. Criamos um estado para cada campo do formulário.
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleSubmit = (event) => {
    // Impede o comportamento padrão do formulário de recarregar a página.
    event.preventDefault();
    alert(`Login Controlado: Email "${email}" e Senha "${senha}"`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Formulário Controlado</h2>
      <div>
        <label>Email: </label>
        <input
          type="email"
          // 2. O valor do input é DIRETAMENTE controlado pelo estado `email`.
          value={email}
          // 3. A cada digitação, o evento `onChange` atualiza o estado.
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Senha: </label>
        <input
          type="password"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
      </div>
      <button type="submit">Enviar</button>
      <p>Valor do e-mail no estado: <strong>{email}</strong></p>
    </form>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Fonte Única da Verdade:** A equipe identificou corretamente que o **estado do React** (`email`, `senha`) é a fonte da verdade. A grande vantagem, como discutido, é a **clareza e o controle**: o código é declarativo, e a relação entre o estado e a UI é explícita, facilitando a manutenção.
  * **Ciclo de Renderização:** Ficou claro para todos (reforçado pela resposta da Nátaly) que cada tecla digitada chama a função `set`, que por sua vez dispara uma nova renderização do componente, mantendo a UI e o estado sempre em sincronia.
  * **Conexão com Pílula 01:** A discussão foi além, ao identificarmos proativamente que a função `handleSubmit` era recriada a cada render. André relembrou corretamente o `useCallback` como a solução para otimizar esse comportamento, provando a retenção e aplicação de conhecimentos prévios.

-----

#### **Exercício 2: O Padrão Não Controlado (`FormularioNaoControlado`)**

##### A Solução em Código

```jsx
import React, { useRef } from 'react';

export default function FormularioNaoControlado() {
  // 1. Criamos uma ref para cada campo, servindo como uma "ponte" para o DOM.
  const emailRef = useRef(null);
  const senhaRef = useRef(null);
  
  // Log para provar que o componente não re-renderiza ao digitar.
  console.log('Componente "FormularioNaoControlado" renderizou.');

  const handleSubmit = (event) => {
    event.preventDefault();
    // 2. Acessamos o valor diretamente do DOM através da propriedade `.current`.
    const email = emailRef.current.value;
    const senha = senhaRef.current.value;
    alert(`Login Não Controlado: Email "${email}" e Senha "${senha}"`);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Formulário Não Controlado</h2>
      <div>
        <label>Email: </label>
        {/* 3. Associamos a ref ao input. Não há `value` nem `onChange` controlados pelo React. */}
        <input type="email" ref={emailRef} />
      </div>
      <div>
        <label>Senha: </label>
        <input type="password" ref={senhaRef} />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Fonte da Verdade no DOM:** Em contraste direto com o padrão anterior, entendemos que a fonte da verdade aqui é o **próprio DOM**. O React não tem conhecimento do valor dos inputs até que o acessemos imperativamente com `ref.current.value`.
  * **Vantagem de Performance:** A principal vantagem ficou evidente: como não há atualizações de estado a cada digitação, **não há re-renderizações**. O `console.log` no código serviu como prova prática desse conceito.
  * **O Debate sobre "Simplicidade":** A equipe teve uma excelente discussão sobre o que significa "simples". Concluímos que o padrão não controlado é mais simples **de escrever** (menos código) para este caso específico, mas o padrão controlado é mais simples **de manter e evoluir**, especialmente se precisarmos adicionar validações ou outras lógicas.

-----

#### **Exercício 3: O Desafio da Validação em Tempo Real (`ValidadorDeSenha`)**

##### A Solução em Código

```jsx
import React, { useState } from 'react';

export default function ValidadorDeSenha() {
  const [senha, setSenha] = useState('');

  // A lógica de validação é derivada diretamente do estado.
  const temOitoCaracteres = senha.length >= 8;
  const temNumero = /\d/.test(senha);

  return (
    <div>
      <h2>Validador de Senha em Tempo Real</h2>
      <label>Crie uma senha:</label>
      <input 
        type="password" 
        value={senha} 
        onChange={(e) => setSenha(e.target.value)} 
      />
      <div>
        <p style={{ color: temOitoCaracteres ? 'green' : 'red' }}>
          {temOitoCaracteres ? '✅' : '❌'} Pelo menos 8 caracteres.
        </p>
        <p style={{ color: temNumero ? 'green' : 'red' }}>
          {temNumero ? '✅' : '❌'} Pelo menos um número.
        </p>
      </div>
    </div>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Padrão Natural:** Ficou claro para todos que o **componente controlado** é o encaixe perfeito para esta tarefa. Como a validação precisa acontecer em tempo real, ter o valor do input sempre disponível no estado do React (`senha`) torna a implementação trivial.
  * **O "Ponto de Quebra" do Não Controlado:** Concluímos que, para implementar isso de forma não controlada, seríamos forçados a adicionar um `onChange` e um `useState` para as mensagens de erro, o que anularia completamente o propósito do padrão, criando um código confuso e ineficiente.

-----

#### **Exercício 4: Ações Imperativas com `useRef` (`FocoAutomatico`)**

##### A Solução em Código

```jsx
import React, { useRef, useEffect } from 'react';

export default function FocoAutomatico() {
  const inputRef = useRef(null);

  // Usamos useEffect com `[]` para executar uma ação APÓS o componente montar.
  useEffect(() => {
    if (inputRef.current) {
      // Damos um "comando" direto ao nó do DOM.
      inputRef.current.focus();
    }
  }, []);

  return (
    <div>
      <h2>Foco Automático</h2>
      <label>Este campo recebe foco na montagem: </label>
      <input type="text" ref={inputRef} />
    </div>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Imperativo vs. Declarativo:** Este exercício solidificou o entendimento de que `ref` é a ferramenta para ações **imperativas** – dar um "comando" direto a um elemento do DOM ("Foque\!"). Isso contrasta com o fluxo **declarativo** normal do React, onde descrevemos a UI baseada em estado.
  * **O Papel do `useEffect`:** Discutimos por que o `useEffect` é essencial aqui. A ação de focar só pode ocorrer depois que o React renderizou o componente e o `<input>` de fato existe no DOM. O `useEffect` com `[]` nos dá o gancho perfeito para executar código nesse exato momento.

-----

#### **Desafio Bônus: Integrando Validação com Zod (`FormularioComValidacao`)**

##### A Solução em Código

```jsx
import React, { useState } from 'react';
import { z } from 'zod';

// Define o esquema de validação FORA do componente.
const loginSchema = z.object({
  email: z.string().email({ message: "Formato de e-mail inválido." }),
  senha: z.string().min(6, { message: "A senha deve ter no mínimo 6 caracteres." }),
});

export default function FormularioComValidacao() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [errors, setErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    setErrors({});

    try {
      loginSchema.parse({ email, senha });
      alert('Validação com Zod passou! Enviando dados...');
    } catch (err) {
      if (err instanceof z.ZodError) {
        const formattedErrors = {};
        err.errors.forEach(error => {
          formattedErrors[error.path[0]] = error.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Formulário com Validação (Zod)</h2>
      <div>
        <label>Email: </label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
        {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
      </div>
      <div>
        <label>Senha: </label>
        <input type="password" value={senha} onChange={(e) => setSenha(e.target.value)} />
        {errors.senha && <p style={{ color: 'red' }}>{errors.senha}</p>}
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
}
```

##### Resumo da Discussão e Principais Aprendizados

  * **Separação de Responsabilidades:** A vantagem mais clara, identificada pela equipe, é que o esquema de validação desacopla as regras de negócio da UI, tornando o código mais limpo, organizado e as regras reutilizáveis.
  * **O "Melhor dos Dois Mundos":** Este exercício foi a ponte para entendermos como bibliotecas como o **React Hook Form** funcionam. A discussão final foi a mais importante:
      * **Por baixo dos panos:** Essas bibliotecas usam uma abordagem **não controlada** (com `refs`) para garantir alta **performance**.
      * **Para o desenvolvedor:** Elas expõem uma API **declarativa** (com hooks como `useForm`) que se parece com um componente **controlado**, oferecendo a melhor **experiência de desenvolvimento**.

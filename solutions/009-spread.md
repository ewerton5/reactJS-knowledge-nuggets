### **Soluções dos exercícios: Pílula de Conhecimento 09 em Prática**

Esta série de encontros explorou a versatilidade do operador `...` (Spread/Rest), indo desde a manipulação básica de arrays até conceitos avançados de gerenciamento de memória e padrões de componentes React.

---

#### **Exercício 1: A Salada de Frutas (Spread em Arrays)**

**Objetivo:** Mesclar arrays e adicionar novos elementos de forma imutável (sem usar `push`).

**Solução em Código:**

```javascript
const listaA = ['Maçã', 'Banana'];
const listaB = ['Uva', 'Melancia'];

// Usando spread para criar um NOVO array com elementos de ambos + 'Laranja'
const listaFinal = [...listaA, 'Laranja', ...listaB];

console.log(listaFinal); 
// Resultado: ['Maçã', 'Banana', 'Laranja', 'Uva', 'Melancia']

```

**Pontos de Discussão Detalhados:**

* **Imutabilidade vs. Mutação:** A discussão central foi sobre por que usar `[...arr]` é preferível a `push()` em contextos como Redux e React.
* **`push()`:** Altera o array original na memória (mutação). Se você mutar o estado, o React não detecta a mudança e não re-renderiza a tela.
* **`...` (Spread):** Cria uma cópia rasa (shallow copy) em um novo endereço de memória, preservando o array original intacto. Isso satisfaz o princípio da imutabilidade.



---

#### **Exercício 2: Atualização de Estado Imutável (Objetos)**

**Objetivo:** Atualizar uma propriedade específica de um objeto sem perder as outras.

**Solução em Código:**

```javascript
const userState = {
  id: 101,
  name: 'Caio',
  email: 'caio@antigo.com',
  role: 'Admin'
};

function updateEmail(newEmail) {
  // A ORDEM IMPORTA! O spread deve vir PRIMEIRO.
  return {
    ...userState,        // 1. Copia todas as props (id, name, email, role)
    email: newEmail,     // 2. Sobrescreve 'email' com o novo valor
  };
}

const newState = updateEmail('caio@novo.com');

```

**Pontos de Discussão Detalhados:**

* **A Regra da Sobrescrita:** Foi discutido o que acontece se a ordem for invertida: `{ email: novo, ...userState }`.
* O JavaScript processa o objeto de cima para baixo (ou da esquerda para a direita). Se o spread vier por último, a propriedade `email` original (que está dentro do spread) irá sobrescrever a propriedade `email` nova que você acabou de definir.


* **Fusão de Objetos:** O Spread sempre dá prioridade ao **último** valor declarado em caso de conflito de chaves (propriedades com o mesmo nome).

---

#### **Exercício 3: "Limpando" Objetos com Rest**

**Objetivo:** Remover propriedades indesejadas (como senha e token) de um objeto de forma segura.

**Solução em Código:**

```javascript
const usuarioDoBanco = {
  id: 1,
  username: 'admin',
  senha: '123456_senha_secreta', 
  token: 'xyz-token-auth',        
  email: 'admin@empresa.com',
  avatar: 'url-da-foto'
};

// A variável 'usuarioSeguro' é criada aqui para armazenar O RESTANTE das props
// Extraímos 'senha' e 'token' para variáveis isoladas (que não usaremos)
const { senha, token, ...usuarioSeguro } = usuarioDoBanco;

console.log(usuarioSeguro); 
// Resultado: { id: 1, username: 'admin', email: 'admin@empresa.com', avatar: '...' }

```

**Pontos de Discussão Detalhados:**

* **Delete vs. Rest:** Houve uma dúvida sobre por que não usar `delete usuarioDoBanco.senha`.
* **`delete`:** É uma operação mutável. Ela remove a propriedade do objeto **original**. Isso é perigoso em React/Redux porque corrompe o dado na fonte.
* **Rest (`...`):** Cria um **novo objeto** (neste caso, `usuarioSeguro`) contendo apenas as propriedades que sobraram. O objeto original `usuarioDoBanco` permanece intacto.


* **Criação de Variável:** O nome `usuarioSeguro` é arbitrário. O operador Rest agrupa "o resto" das propriedades em qualquer nome de variável que você definir ali.

---

#### **Exercício 4: O Componente Repassador (React Pattern)**

**Objetivo:** Criar um componente flexível que aceita props específicas e repassa todas as outras para o elemento nativo.

**Solução em Código:**

```jsx
import React from 'react';

function InputCustomizado({ label, ...propsDoInput }) {
  // 'propsDoInput' agrupa tudo que não for 'label': type, placeholder, style, etc.
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: 'block', fontWeight: 'bold' }}>
        {label}
      </label>
      
      {/* Espalhamos todas as props restantes no input nativo */}
      <input 
         className="meu-input-padrao"
         {...propsDoInput}
      />
    </div>
  );
}

```

**Pontos de Discussão Detalhados:**

* **Escalabilidade (Design Systems):** Esse padrão permite que o componente suporte funcionalidades futuras do HTML ou do React sem precisar de refatoração. Se amanhã o React criar uma prop `onMagicEvent`, esse componente já suportará essa prop porque ele repassa `...propsDoInput` cegamente.
* **Agrupamento Específico:** Foi mencionado que, em componentes complexos, você pode agrupar props para destinos diferentes (ex: `modalProps` para o container, `textProps` para o texto interno) para manter a organização.

---

#### **Exercício 5: A Armadilha da Cópia Rasa (Shallow Copy)**

**Objetivo:** Demonstrar que o Spread Operator **não** faz cópia profunda (Deep Copy) de objetos aninhados.

**Solução em Código (O Problema e a Correção):**

```javascript
const original = {
  nome: 'Projeto A',
  config: { tema: 'Escuro', ativo: true } // Objeto aninhado (Nível 2)
};

// 1. Cópia Rasa com Spread
const copia = { ...original };

// 2. Alteração Segura (Nível 1 - Primitivo)
copia.nome = 'Projeto B'; 
// -> 'original.nome' NÃO muda. (OK)

// 3. Alteração Perigosa (Nível 2 - Referência)
copia.config.tema = 'Claro';
// -> 'original.config.tema' TAMBÉM MUDA! (Problema)

// --- COMO CORRIGIR (Deep Copy) ---
// Opção A: Spread Aninhado
const copiaSegura = {
    ...original,
    config: { ...original.config, tema: 'Claro' } // Cria nova referência para config
};

// Opção B: Clone Profundo (Lodash ou Nativo)
const cloneProfundo = structuredClone(original);

```

**Pontos de Discussão Detalhados:**

* **Referências de Memória:** A discussão final esclareceu por que o `original` mudou no passo 3.
* O Spread copia valores primitivos (strings, numbers), mas copia apenas a **referência** (endereço de memória) de objetos.
* Tanto `original.config` quanto `copia.config` apontam para o **mesmo objeto** na memória. Alterar um afeta o outro.


* **Soluções:** Para resolver isso, é necessário fazer um "Spread Aninhado" (copiando nível por nível) ou usar funções de clonagem profunda como `structuredClone` ou `_.cloneDeep` (Lodash), que recursivamente criam novas referências para todos os objetos internos.

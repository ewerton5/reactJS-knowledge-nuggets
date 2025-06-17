###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/008-side-effects.md)

# 📘 Pílula de Conhecimento 09 — A Versatilidade do Operador Spread/Rest (`...`)

O operador de três pontos (`...`) é uma das ferramentas mais poderosas e flexíveis do JavaScript moderno. Dependendo do contexto, ele pode atuar de duas formas opostas, mas complementares:

1.  **Spread Syntax (Espalhar):** "Espalha" os elementos de um array ou as propriedades de um objeto em um novo local.
2.  **Rest Parameters (Juntar):** "Junta" múltiplos elementos ou propriedades em um único array ou objeto.

Dominar ambos os usos é essencial para escrever código limpo, funcional e imutável.

---

## 🧩 Spread Syntax: Espalhando Elementos

A sintaxe de spread é usada para criar cópias e combinar arrays e objetos de forma declarativa.

### Copiando e Mesclando Arrays
```javascript
const legumes = ['cenoura', 'batata'];
const carnes = ['frango', 'carne moída'];

// Copia o array de carnes
const carnesCopia = [...carnes]; // ['frango', 'carne moída']

// Mescla os dois arrays
const ingredientes = [...legumes, ...carnes]; // ['cenoura', 'batata', 'frango', 'carne moída']
```

### Copiando e Mesclando Objetos (Imutabilidade)
No React, a **imutabilidade** (não alterar diretamente estados ou props) é um princípio fundamental. O spread é a ferramenta perfeita para isso, pois nos permite criar um *novo* objeto com base em um anterior.

```javascript
const user = { name: 'João', age: 30 };

// Copia o objeto user
const userCopy = { ...user };

// Atualiza o estado de forma imutável no React
const [produto, setProduto] = useState({ id: 1, nome: 'Notebook', estoque: 15 });

const venderProduto = () => {
  setProduto(estadoAnterior => ({
    ...estadoAnterior, // 1. Copia todas as props do estado anterior
    estoque: estadoAnterior.estoque - 1 // 2. Sobrescreve apenas a prop desejada
  }));
};
```
> **Atenção:** O spread faz uma **cópia rasa (shallow copy)**. Se um objeto contiver outro objeto aninhado, o objeto aninhado será copiado por referência, não por valor.

---

## 🛠️ Rest Parameters: Juntando o Resto

Quando usado na desestruturação ou como parâmetro de função, o `...` inverte sua função e passa a "juntar" o resto dos elementos.

### Parâmetros Infinitos em Funções
Você pode criar funções que aceitam um número indefinido de argumentos, que são agrupados em um array.

```javascript
// A função `sum` pode receber quantos números você quiser
function sum(...numeros) {
  return numeros.reduce((total, num) => total + num, 0);
}

sum(1, 2); // Retorna 3
sum(5, 10, 15, 20); // Retorna 50
```

### Desestruturação com Rest
É extremamente útil para extrair as propriedades que você precisa de um objeto e agrupar o restante em um novo objeto.

```javascript
const usuario = {
  id: 123,
  nome: 'Ana',
  email: 'ana@example.com',
  ativo: true
};

// Pega 'id' e 'nome', e agrupa todo o resto em 'outrasProps'
const { id, nome, ...outrasProps } = usuario;

console.log(id); // 123
console.log(nome); // 'Ana'
console.log(outrasProps); // { email: 'ana@example.com', ativo: true }
```

---

## 🚀 Padrões Avançados e de Múltiplo Nível

###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/007-navigation.md](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/008-side-effects.md)

### Passagem de Múltiplos Parâmetros
O spread pode "desempacotar" um array em argumentos individuais para uma função.

```javascript
const numeros = [10, 5];

function subtrair(a, b) {
  return a - b;
}

// Em vez de subtrair(numeros[0], numeros[1]), fazemos:
const resultado = subtrair(...numeros); // Equivalente a subtrair(10, 5)
console.log(resultado); // 5
```

### Desestruturação Múltipla
Você pode desestruturar objetos aninhados e usar o rest em diferentes níveis para extrair dados de forma precisa.

```javascript
const pedido = {
  id: 99,
  cliente: {
    nome: 'Carlos',
    idade: 40,
    endereco: {
      rua: 'Rua Principal',
      cidade: 'São Paulo'
    }
  },
  total: 500
};

// Extrai o nome do cliente, a cidade e agrupa o resto dos dados do cliente
const { cliente: { nome, endereco: { cidade }, ...restoDoCliente }, ...restoDoPedido } = pedido;

console.log(nome); // 'Carlos'
console.log(cidade); // 'São Paulo'
console.log(restoDoCliente); // { idade: 40 }
console.log(restoDoPedido); // { id: 99, total: 500 }
```

### Passando Todas as Props de um Componente em React
Esse é um dos padrões mais comuns e poderosos. Combinando desestruturação com rest e spread, você pode criar componentes flexíveis que "repassam" propriedades para elementos filhos.

```jsx
// O componente aceita todas as props de um <button> nativo
function BotaoCustomizado({ children, variant, ...propsDoBotao }) {
  // `variant` é usada para estilização, mas não é uma prop nativa do <button>
  // `...propsDoBotao` contém todas as outras props (onClick, disabled, etc.)
  const className = `btn btn-${variant}`;

  return (
    <button className={className} {...propsDoBotao}>
      {children}
    </button>
  );
}

// Uso:
<BotaoCustomizado variant="primary" onClick={() => alert('Clicou!')} disabled={false}>
  Clique Aqui
</BotaoCustomizado>
```

---

## ✅ Conclusão

O operador `...` é uma ferramenta de dupla utilidade indispensável no JavaScript moderno.

* Como **Spread**, ele permite criar cópias e combinar estruturas de dados, sendo a base para a **imutabilidade** no React.
* Como **Rest**, ele oferece uma forma elegante de capturar múltiplos elementos, seja em **parâmetros de funções** ou na **desestruturação** de objetos e arrays.

Dominar seu uso não só torna o código mais conciso e legível, mas também abre portas para padrões de programação mais robustos e flexíveis.

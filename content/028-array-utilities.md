###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/027-string-utilities.md)

# 📘 Pílula de Conhecimento 28 — Métodos Essenciais de Arrays em JavaScript

O JavaScript moderno oferece um poderoso conjunto de métodos para arrays que permitem um estilo de programação mais funcional e declarativo. Em vez de usar laços `for` tradicionais, esses métodos nos ajudam a manipular listas de dados de forma mais legível, concisa e menos propensa a erros.

## 1\. Métodos de Transformação (Retornam um Novo Array)

Estes métodos criam um **novo array** com base no original, sem modificá-lo (imutabilidade).

### `.map()`

Cria um novo array transformando cada elemento do array original. O novo array terá sempre o **mesmo tamanho** do original.

  * **Caso de Uso:** Pegar um array de objetos e extrair apenas uma propriedade, ou formatar cada item de uma lista.

<!-- end list -->

```javascript
const numeros = [1, 2, 3, 4];
const dobrados = numeros.map(num => num * 2);
// dobrados = [2, 4, 6, 8]

const usuarios = [{ nome: 'Ana' }, { nome: 'Bruno' }];
const nomes = usuarios.map(usuario => usuario.nome);
// nomes = ['Ana', 'Bruno']
```

### `.filter()`

Cria um novo array contendo apenas os elementos que passam em um teste (a função retorna `true`). O novo array pode ter um tamanho menor ou igual ao original.

  * **Caso de Uso:** Remover itens de uma lista, encontrar todos os usuários ativos, etc.

<!-- end list -->

```javascript
const idades = [15, 22, 18, 30];
const maioresDeIdade = idades.filter(idade => idade >= 18);
// maioresDeIdade = [22, 18, 30]
```

## 2\. Métodos de Agregação e Busca (Retornam um Único Valor)

Estes métodos "reduzem" o array a um único resultado.

### `.reduce()`

Executa uma função "redutora" em cada elemento do array, resultando em um único valor final. É o método mais poderoso e flexível de todos.

  * **Caso de Uso:** Somar todos os valores de um array, agrupar objetos, transformar um array em um objeto.

<!-- end list -->

```javascript
const numeros = [1, 2, 3, 4];
// O '0' é o valor inicial do acumulador
const soma = numeros.reduce((acumulador, valorAtual) => acumulador + valorAtual, 0);
// soma = 10
```

### `.find()`

Retorna o **primeiro elemento** do array que satisfaz a condição. Se nenhum elemento for encontrado, retorna `undefined`.

  * **Caso de Uso:** Encontrar um usuário específico pelo seu ID.

<!-- end list -->

```javascript
const usuarios = [{ id: 1, nome: 'Ana' }, { id: 2, nome: 'Bruno' }];
const usuarioEncontrado = usuarios.find(usuario => usuario.id === 2);
// usuarioEncontrado = { id: 2, nome: 'Bruno' }
```

### `.some()` e `.every()`

Retornam um valor booleano (`true` ou `false`).

  * **`.some()`**: Retorna `true` se **pelo menos um** elemento do array passar no teste.
  * **`.every()`**: Retorna `true` se **todos** os elementos do array passarem no teste.

<!-- end list -->

```javascript
const idades = [15, 22, 18, 30];
// Existe algum menor de idade?
const temMenor = idades.some(idade => idade < 18); // true

// São todos maiores de idade?
const todosMaiores = idades.every(idade => idade >= 18); // false
```

## 3\. Métodos de Iteração (`forEach`)

### `.forEach()`

Executa uma função para cada elemento do array. **Não retorna nada** (`undefined`).

  * **Caso de Uso:** Quando você precisa "fazer algo" para cada item (ex: `console.log`, salvar no banco), mas não precisa criar um novo array.

> #### ⚠️ `map` vs. `forEach` - A Escolha Certa
>
> Um erro comum para iniciantes é usar `.map()` quando deveriam usar `.forEach()`. A regra é simples:
>
>   - Use **`.map()`** quando você quer **transformar** um array em um **novo array**.
>   - Use **`.forEach()`** quando você quer apenas **iterar** sobre os elementos para executar uma ação (um "efeito colateral").

## 4\. Métodos que Modificam o Array Original (Mutação)

### `.sort()`

Ordena os elementos de um array **no próprio local (in-place)**.

  * **Aviso de Mutação:** Como este método altera o array original, isso pode causar bugs inesperados, especialmente em React. A boa prática é sempre criar uma **cópia** do array antes de ordená-lo.

<!-- end list -->

```javascript
const frutas = ['banana', 'maçã', 'laranja'];
// Boa prática: cria uma cópia com o spread operator `...` antes de ordenar
const frutasOrdenadas = [...frutas].sort();

console.log(frutasOrdenadas); // ['banana', 'laranja', 'maçã']
console.log(frutas);          // ['banana', 'maçã', 'laranja'] (O original está intacto)
```

## 5\. Bônus: `.flat()` e `.flatMap()`

  * **`.flat()`**: Cria um novo array com todos os elementos de sub-arrays concatenados nele de forma recursiva até a profundidade especificada.
  * **`.flatMap()`**: É a combinação de um `.map()` seguido por um `.flat()` de profundidade 1.

<!-- end list -->

```javascript
const arrAninhado = [1, [2, 3], [4, [5]]];
console.log(arrAninhado.flat());     // [1, 2, 3, 4, [5]]
console.log(arrAninhado.flat(2));   // [1, 2, 3, 4, 5]

const frases = ["Olá mundo", "React é legal"];
// Mapeia cada frase para um array de palavras e depois achata o resultado
const palavras = frases.flatMap(frase => frase.split(' '));
// palavras = ['Olá', 'mundo', 'React', 'é', 'legal']
```

## ✅ Conclusão

Dominar os métodos de array é um passo fundamental para escrever um código JavaScript mais limpo, funcional e declarativo. Entender o que cada método faz, o que ele retorna e se ele modifica o array original é crucial para evitar bugs. Praticar com os "cinco grandes" (`map`, `filter`, `reduce`, `find`, `some`/`every`) já resolve a grande maioria dos problemas com listas de forma elegante e eficiente.

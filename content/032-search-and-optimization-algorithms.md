###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/031-lodash.md)

# 📘 Pílula de Conhecimento 32 — Algoritmos de Busca e Otimização

No desenvolvimento, uma tarefa comum é encontrar um item específico dentro de uma grande coleção de dados. A forma como realizamos essa busca tem um impacto direto na performance da nossa aplicação. Hoje, vamos explorar a diferença entre uma busca simples e a otimizada **Busca Binária**, entendendo o conceito de **Complexidade Algorítmica**.

## 1\. Entendendo Complexidade Algorítmica (Big O Notation)

A **Notação Big O** é uma forma de medir a eficiência de um algoritmo, descrevendo como o tempo de execução ou o uso de memória aumenta à medida que a quantidade de dados de entrada (`n`) cresce.

  * **`O(n)` - Complexidade Linear:** A abordagem de "força bruta". O tempo de execução cresce na mesma proporção que o número de itens. Se você tem 100 itens, leva 100 passos.
      * **Exemplo:** Uma **busca linear**, onde você percorre um array item por item até encontrar o que procura.
  * **`O(log n)` - Complexidade Logarítmica:** A abordagem de "dividir para conquistar". A cada passo, o problema é reduzido pela metade. É extremamente eficiente para grandes volumes de dados. Se você tem 1 milhão de itens, leva cerca de 20 passos, em vez de 1 milhão.
      * **Exemplo:** A **Busca Binária**.

## 2\. A Busca Binária (Binary Search)

A Busca Binária é um algoritmo de busca altamente eficiente, mas com uma regra de ouro indispensável: **a lista precisa estar ordenada**.

### Como Funciona?

Em vez de começar do início, a busca binária começa pelo meio e descarta metade dos dados a cada passo.

**A analogia do livro:** Para encontrar a página 347 em um livro de 1000 páginas, você não folheia desde a página 1. Você abre o livro no meio (página 500). Como 347 é menor que 500, você sabe que a página está na primeira metade, e descarta a segunda. Você repete o processo na metade restante até encontrar a página.

**Exemplo de Código:**

```javascript
function binarySearch(sortedArray, target) {
  let left = 0;
  let right = sortedArray.length - 1;

  while (left <= right) {
    // 1. Encontra o índice do meio
    const mid = Math.floor((left + right) / 2);
    const midValue = sortedArray[mid];

    // 2. Compara o valor do meio com o alvo
    if (midValue === target) {
      return mid; // Alvo encontrado! Retorna o índice.
    }

    // 3. Descarta metade do array
    if (target < midValue) {
      right = mid - 1; // Procura na metade da esquerda
    } else {
      left = mid + 1; // Procura na metade da direita
    }
  }

  return -1; // Alvo não encontrado
}

const numerosOrdenados = [2, 5, 8, 12, 16, 23, 38, 56, 72, 91];
const indice = binarySearch(numerosOrdenados, 23);
console.log(indice); // 5
```

## 3\. Bônus: Depurando com Busca Binária (`git bisect`)

O mesmo princípio de "dividir para conquistar" pode ser usado para encontrar o *commit* exato que introduziu um bug no seu código, usando o comando **`git bisect`**.

### O Cenário

Você sabe que na `main` atual existe um bug, mas em um *commit* de uma semana atrás, tudo funcionava. Em vez de testar cada um dos 100 *commits* feitos nesse período, você usa o `git bisect`.

**O Fluxo do `git bisect`:**

1.  **Iniciar o processo:**
    `git bisect start`

2.  **Marcar o commit ruim e o bom:**
    `git bisect bad main` (ou o hash do commit atual com o bug)
    `git bisect good <hash_do_commit_antigo_sem_bug>`

3.  **Testar:** O Git fará o checkout de um *commit* exatamente no meio do intervalo. Você testa sua aplicação para ver se o bug está presente.

4.  **Informar o Git:**

      * Se o bug **estiver** presente: `git bisect bad`
      * Se o bug **não estiver** presente: `git bisect good`

5.  **Repetir:** O Git novamente dividirá o novo intervalo de *commits* ao meio e fará o checkout. Você repete o passo 4.

Após alguns passos, o Git irá apontar exatamente qual foi o primeiro *commit* que introduziu o problema.

6.  **Finalizar o processo:**
    `git bisect reset`

## ✅ Conclusão

Entender conceitos como **Complexidade Algorítmica** e algoritmos como a **Busca Binária** não é apenas um exercício acadêmico. Eles nos fornecem ferramentas mentais e práticas para escrever código mais performático e resolver problemas de forma mais eficiente. A mesma lógica de "dividir para conquistar" que otimiza uma busca em um array pode ser aplicada para otimizar um processo de depuração com o `git bisect`, economizando horas de trabalho e tornando nosso desenvolvimento mais inteligente.

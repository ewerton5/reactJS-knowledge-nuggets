###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/028-array-utilities.md)

# 📘 Pílula de Conhecimento 29 — Promises e Async/Await: Dominando a Assincronicidade

O JavaScript opera em uma "thread" única, o que significa que ele só pode fazer uma coisa de cada vez. Se uma operação demorada (como buscar dados de uma API) bloqueasse essa thread, toda a interface do usuário congelaria. Para evitar isso, usamos operações **assíncronas**. A base para gerenciar essas operações no JavaScript moderno é o objeto **`Promise`**.

## 1\. O que é uma `Promise`?

Uma **Promise** (Promessa) é um objeto que representa a eventual conclusão (ou falha) de uma operação assíncrona. Pense nela como um "recibo" que você recebe por um pedido que ainda não está pronto: ele garante que você receberá seu item no futuro ou será notificado se algo der errado.

Uma Promise pode estar em um de três estados:

  * **`pending` (pendente):** O estado inicial. A operação ainda não foi concluída.
  * **`fulfilled` (realizada):** A operação foi concluída com sucesso e a Promise tem um valor resultante.
  * **`rejected` (rejeitada):** A operação falhou e a Promise tem um motivo (um erro).

**Exemplo: Criando uma `Promise`**

```javascript
const minhaPrimeiraPromise = new Promise((resolve, reject) => {
  // Simula uma operação que leva 2 segundos
  setTimeout(() => {
    const sucesso = true; // Simula o resultado
    if (sucesso) {
      resolve("Dados recebidos com sucesso!"); // A Promise foi cumprida
    } else {
      reject(new Error("Falha ao buscar os dados.")); // A Promise foi rejeitada
    }
  }, 2000);
});
```

## 2\. Consumindo Promises: Duas Abordagens

Existem duas maneiras principais de "desembrulhar" o valor de uma Promise.

### 2.1 A Abordagem Clássica: `.then()` e `.catch()`

Você pode encadear métodos na Promise para lidar com os resultados.

  * **`.then(onFulfilled)`**: Executa uma função de callback quando a Promise é **realizada**.
  * **`.catch(onRejected)`**: Executa uma função de callback quando a Promise é **rejeitada**.

**Exemplo:**

```javascript
minhaPrimeiraPromise
  .then(resultado => {
    // Este bloco é executado se a Promise for resolvida
    console.log(resultado); // "Dados recebidos com sucesso!"
  })
  .catch(erro => {
    // Este bloco é executado se a Promise for rejeitada
    console.error(erro.message); // "Falha ao buscar os dados."
  });
```

### 2.2 A Abordagem Moderna: `async`/`await` (Recomendado)

A sintaxe `async`/`await` foi introduzida para tornar o código assíncrono mais limpo e legível, fazendo-o parecer síncrono.

  * **`async`**: A palavra-chave `async` antes de uma função a torna uma função assíncrona, o que significa que ela implicitamente retorna uma `Promise`.
  * **`await`**: A palavra-chave `await` **pausa a execução da função `async`** até que a `Promise` seja resolvida, e então "desembrulha" o valor. Só pode ser usada dentro de uma função `async`.
  * **Error Handling:** Erros de promises rejeitadas são capturados com um bloco `try...catch` padrão.

**Exemplo (mesma lógica anterior, mas com `async`/`await`):**

```javascript
async function consumirPromise() {
  try {
    // Pausa a execução aqui até minhaPrimeiraPromise ser resolvida
    const resultado = await minhaPrimeiraPromise;
    console.log(resultado); // "Dados recebidos com sucesso!"
  } catch (erro) {
    console.error(erro.message); // "Falha ao buscar os dados."
  }
}

consumirPromise();
```

Essa abordagem é a preferida na maioria dos casos por ser mais intuitiva e fácil de ler.

## 3\. Lidando com Múltiplas Promises com `Promise.all()`

E se você precisar fazer várias chamadas de API ao mesmo tempo e esperar por todas elas? Fazer uma após a outra com `await` seria ineficiente.

```javascript
// Ineficiente: espera a primeira terminar para começar a segunda
const resultado1 = await api.get('/dados1');
const resultado2 = await api.get('/dados2');
```

A solução para isso é `Promise.all()`. Ele recebe um array de Promises e retorna uma única Promise que resolve quando **todas** as Promises do array forem resolvidas. As requisições são feitas em paralelo.

**Exemplo de uso performático:**

```javascript
async function buscarMultiplosDados() {
  try {
    // Inicia ambas as requisições em paralelo
    const [resultado1, resultado2] = await Promise.all([
      api.get('/dados1'),
      api.get('/dados2'),
    ]);

    console.log("Dados 1:", resultado1);
    console.log("Dados 2:", resultado2);
  } catch (erro) {
    console.error("Uma das requisições falhou", erro);
  }
}
```

Isso reduz drasticamente o tempo total de espera, pois as operações ocorrem simultaneamente.

## ✅ Conclusão

`Promises` e a sintaxe `async`/`await` são a espinha dorsal do código assíncrono no JavaScript moderno. Entender como funcionam é indispensável para interagir com APIs, timers, ou qualquer operação que não retorne um resultado imediato.

  * **`async`/`await`** é a forma preferida para consumir Promises devido à sua legibilidade.
  * **`try...catch`** é o par perfeito do `async`/`await` para um tratamento de erros claro.
  * **`Promise.all()`** é a ferramenta essencial para otimizar o desempenho ao lidar com múltiplas operações assíncronas.

Adotar um padrão consistente (`async`/`await` na maioria dos casos) e saber como usar essas ferramentas de forma eficaz tornará seu código mais limpo, robusto e performático.

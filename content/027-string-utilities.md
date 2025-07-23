###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/026-regex.md)

# 📘 Pílula de Conhecimento 27 — Utilidades Nativas de Strings e Números

Embora as Expressões Regulares (Regex) sejam poderosas, muitas vezes, os problemas de manipulação de strings podem ser resolvidos de forma mais clara e simples com os métodos nativos do JavaScript. Conhecer essas ferramentas é essencial para escrever um código limpo, legível e eficiente.

## 1\. Métodos de Verificação (`true` ou `false`)

Estes métodos são perfeitos para checagens condicionais.

  - **`.includes(substring)`**: Verifica se uma string contém uma determinada `substring`.
    ```javascript
    const frase = "O rápido cachorro marrom.";
    console.log(frase.includes('cachorro')); // true
    console.log(frase.includes('gato'));     // false
    ```
  - **`.startsWith(substring)`**: Verifica se uma string **começa** com uma `substring`.
    ```javascript
    const url = "https://reactnative.dev";
    console.log(url.startsWith('https')); // true
    console.log(url.startsWith('http'));  // false
    ```
  - **`.endsWith(substring)`**: Verifica se uma string **termina** com uma `substring`.
    ```javascript
    const arquivo = "componente.tsx";
    console.log(arquivo.endsWith('.tsx')); // true
    ```

## 2\. Métodos de Extração e Divisão

Estes métodos criam novas strings ou arrays a partir da string original.

  - **`.slice(inicio, fim?)`**: Extrai uma "fatia" da string. Aceita índices negativos para contar a partir do final.
    ```javascript
    const texto = "Mozilla";
    console.log(texto.slice(1, 4));  // "ozi"
    console.log(texto.slice(2));     // "zilla"
    console.log(texto.slice(-3));    // "lla" (pega os 3 últimos caracteres)
    ```
  - **`.split(separador)`**: Divide uma string em um array de substrings, com base em um `separador`.
    ```javascript
    const csv = "maçã,banana,laranja";
    const frutas = csv.split(',');
    console.log(frutas); // ['maçã', 'banana', 'laranja']

    const saudacao = "Olá Mundo";
    console.log(saudacao.split('')); // ['O', 'l', 'á', ' ', 'M', 'u', 'n', 'd', 'o']
    ```

## 3\. Métodos de Modificação e Formatação

Estes métodos retornam uma **nova string** modificada, mantendo a original intacta (imutabilidade).

  - **`.replace(padrão, substituto)`**: Substitui a **primeira** ocorrência de um `padrão` (string ou Regex).
  - **`.replaceAll(padrão, substituto)`**: Substitui **todas** as ocorrências de um `padrão`.
    ```javascript
    const p = "O cachorro é um bom cachorro.";
    console.log(p.replace('cachorro', 'gato'));      // "O gato é um bom cachorro."
    console.log(p.replaceAll('cachorro', 'gato'));  // "O gato é um bom gato."
    ```
  - **`.padStart(tamanhoFinal, caractere)`** e **`.padEnd(...)`**: Preenche o início ou o fim da string com um `caractere` até que ela atinja o `tamanhoFinal`.
    ```javascript
    const ultimosDigitos = "1234";
    // Oculta os primeiros 12 dígitos de um cartão de crédito de 16 dígitos
    const cartaoMascarado = ultimosDigitos.padStart(16, '*');
    console.log(cartaoMascarado); // "************1234"
    ```
  - **`.trim()`**: Remove espaços em branco do início e do fim da string.
    ```javascript
    const input = "   contato@email.com   ";
    console.log(input.trim()); // "contato@email.com"
    ```
  - **`.toLowerCase()`** e **`.toUpperCase()`**: Convertem a string para minúsculas ou maiúsculas, respectivamente.
  - **`.repeat(contagem)`**: Repete a string um determinado número de vezes.
    ```javascript
    console.log('Eco '.repeat(3)); // "Eco Eco Eco "
    ```

## 4\. `Array.prototype.join()` - O Inverso do `.split()`

Embora seja um método de Array, o `.join()` é o parceiro natural do `.split()`. Ele une todos os elementos de um array em uma única string, usando um separador.

```javascript
const palavras = ['Olá', 'mundo', 'do', 'React'];
const fraseCompleta = palavras.join(' ');
console.log(fraseCompleta); // "Olá mundo do React"
```

## 5\. Tópico Avançado: `.normalize()`

Este método é crucial para lidar com strings que podem ter caracteres especiais e acentos. Ele converte a string para uma forma de normalização Unicode padrão, garantindo que diferentes representações do mesmo caractere (ex: `é` como um único caractere vs. `e` + `´` como dois caracteres) sejam tratadas como iguais.

```javascript
const str1 = 'e\u0301'; // e + acento agudo combinado
const str2 = '\u00e9'; // caractere único para "é"

console.log(str1 === str2); // false
console.log(str1.normalize() === str2.normalize()); // true
```

## 6\. Conversão de Strings para Números

Existem três formas principais de converter strings para números, cada uma com seu comportamento:

  - **`parseInt(string, base?)`**: Converte a string para um **número inteiro**. Ele para de ler assim que encontra um caractere não numérico e permite especificar a base numérica (ex: base 10 para decimal, base 16 para hexadecimal).
    ```javascript
    console.log(parseInt('123.45px')); // 123
    console.log(parseInt('FF', 16));     // 255
    ```
  - **`parseFloat(string)`**: Similar ao `parseInt`, mas converte para um **número de ponto flutuante** (com decimais).
    ```javascript
    console.log(parseFloat('3.1415 é o valor de PI')); // 3.1415
    ```
  - **`Number(valor)`**: É um construtor mais estrito. Ele tenta converter o valor inteiro. Se a string contiver qualquer caractere não numérico (além de um ponto decimal), ele retorna `NaN` (Not a Number).
    ```javascript
    console.log(Number('123.45')); // 123.45
    console.log(Number('123px'));  // NaN
    ```

## ✅ Conclusão

Dominar os métodos nativos de strings e números é uma habilidade fundamental para qualquer desenvolvedor JavaScript. Eles frequentemente oferecem a solução mais direta, legível e performática para desafios comuns de manipulação de dados, servindo como uma excelente alternativa antes de recorrer a soluções mais complexas como o Regex.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/028-array-utilities.md) 👉

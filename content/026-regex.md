###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/025-react-native-utilities-part-2.md)

# 📘 Pílula de Conhecimento 26 — Desvendando Expressões Regulares (Regex)

Uma **Expressão Regular**, ou **Regex**, é uma sequência de caracteres que define um padrão de busca. É uma "mini-linguagem" embutida no JavaScript (e em muitas outras linguagens) usada para operações complexas em strings, como:

  - **Validação:** Verificar se uma string segue um formato específico (ex: e-mail, CPF, CEP).
  - **Busca e Extração:** Encontrar e extrair partes de uma string (ex: pegar todos os números de um texto).
  - **Substituição:** Substituir partes de uma string que correspondem a um padrão (ex: remover caracteres especiais de um número de telefone).

Embora seja possível resolver muitos problemas sem Regex, utilizá-la pode transformar uma lógica de várias linhas de `if`s e `for`s em uma única e poderosa expressão.

## 1\. A Sintaxe Fundamental

Uma Regex é geralmente criada usando barras `/` como delimitadores.

`/padrão/flags`

  - **Padrão:** A sequência de caracteres e metacaracteres que define o que você está procurando.
  - **Flags:** Modificadores que alteram o comportamento da busca. As mais comuns são:
      - `g` (Global): Encontra **todas** as ocorrências, não apenas a primeira.
      - `i` (Case-Insensitive): Ignora a diferença entre maiúsculas e minúsculas.

### "Cola" Rápida dos Metacaracteres Mais Comuns

| Símbolo | Descrição | Exemplo |
| :--- | :--- | :--- |
| `\d` | Qualquer dígito (0-9) | `/\d/` encontra "5" em "ano2025" |
| `\s` | Qualquer caractere de espaço em branco (espaço, tab) | `/\s/` encontra o espaço em "Olá Mundo"|
| `[a-z]` | Qualquer caractere no intervalo (ex: de 'a' a 'z') | `/[a-zA-Z]/` encontra letras |
| `+` | Uma ou mais ocorrências do item anterior | `/a+/` encontra "a", "aa", "aaa" |
| `*` | Zero ou mais ocorrências do item anterior | `/a*/` encontra "", "a", "aa" |
| `{n}` | Exatamente `n` ocorrências | `/\d{3}/` encontra "123" |
| `^` | Início da string | `^A` em "Ana" |
| `$` | Fim da string | `a$` em "Ana" |
| `|` | OU (alternância) | `/gato|cachorro/` encontra "gato" ou "cachorro" |

## 2\. Regex em Ação com Métodos de String

Você pode usar Regex com vários métodos nativos do JavaScript.

### `RegExp.prototype.test()` - Para Validação

O método mais simples. Retorna `true` se o padrão for encontrado na string, e `false` caso contrário. Perfeito para validações.

**Exemplo: Validar se uma string contém apenas números**

```javascript
const padraoApenasNumeros = /^\d+$/;

console.log(padraoApenasNumeros.test('12345')); // true
console.log(padraoApenasNumeros.test('123a45')); // false
```

### `String.prototype.match()` - Para Extração

Retorna um array com as correspondências encontradas ou `null` se nada for encontrado.

**Exemplo: Extrair todos os números de um texto**

```javascript
const texto = "O pedido #123 foi faturado por R$ 99,50.";
const padraoNumeros = /\d+/g; // O 'g' é crucial para encontrar todos

const numerosEncontrados = texto.match(padraoNumeros);
console.log(numerosEncontrados); // ['123', '99', '50']
```

### `String.prototype.replace()` - Para Substituição

Busca um padrão e o substitui por uma nova string. É extremamente útil para limpar e formatar dados.

**Exemplo: Formatar um número de telefone, removendo caracteres especiais**

```javascript
const telefoneInput = '(21) 99999-8888';
// \D corresponde a qualquer caractere que NÃO é um dígito
const padraoNaoNumerico = /\D/g;

const telefoneLimpo = telefoneInput.replace(padraoNaoNumerico, '');
console.log(telefoneLimpo); // '21999998888'
```

## 3\. Exemplo Prático: Validando um CEP

Vamos construir uma Regex para validar um CEP no formato `XXXXX-XXX`.

1.  `^` - A string deve começar aqui.
2.  `\d{5}` - Deve ter exatamente 5 dígitos.
3.  `-` - Deve ter um hífen.
4.  `\d{3}` - Deve ter exatamente 3 dígitos.
5.  `$` - A string deve terminar aqui.

**A Regex final:** `^\d{5}-\d{3}$`

**Código de validação:**

```javascript
const cepRegex = /^\d{5}-\d{3}$/;

function validarCEP(cep) {
  if (cepRegex.test(cep)) {
    console.log(`O CEP "${cep}" é válido!`);
  } else {
    console.log(`O CEP "${cep}" é inválido.`);
  }
}

validarCEP('26113-410'); // Válido
validarCEP('26113410');  // Inválido
validarCEP('abcde-fgh'); // Inválido
```

## 4\. Boas Práticas e a "Armadilha da Legibilidade"

Regex é uma ferramenta de "alto poder, alta complexidade".

  * **Simplicidade é Chave:** Para tarefas simples, como a validação de CEP, uma Regex é limpa e eficiente.
  * **Cuidado com a Complexidade:** Expressões muito longas e complexas se tornam quase impossíveis de ler e manter. Às vezes, algumas linhas de JavaScript claro e explícito são melhores do que uma Regex indecifrável.
  * **Use Ferramentas Modernas:**
      * **IA Generativa:** Ferramentas como o ChatGPT são excelentes para gerar e, principalmente, **explicar** uma Regex.
      * **Testadores Online:** Sites como o **Regex101** são playgrounds interativos onde você pode construir, testar e depurar suas expressões em tempo real.

## ✅ Conclusão

As Expressões Regulares são uma ferramenta indispensável no arsenal de qualquer desenvolvedor JavaScript. Embora sua sintaxe possa parecer intimidadora, dominar os conceitos básicos permite resolver problemas complexos de manipulação de strings de forma concisa e elegante. Use-as com sabedoria, priorizando a legibilidade, e elas se tornarão uma aliada poderosa para simplificar seu código.

###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/014-automated-testing.md)

# 📘 Pílula de Conhecimento 15 — Mirage JS: Desenvolvendo e Testando sem Backend

No desenvolvimento de aplicações, é comum o frontend precisar de uma API que ainda não está pronta, ou precisar testar cenários específicos (erros, respostas vazias, etc.) que são difíceis de replicar em um ambiente real. O **Mirage JS** resolve esse problema.

O Mirage JS é uma biblioteca de "mocking de API". Ele intercepta as requisições HTTP (`fetch`, `axios`) que sua aplicação faz e, em vez de enviá-las para a internet, responde com dados falsos ("mockados") que você define. Essencialmente, ele cria um servidor backend falso que roda inteiramente dentro do seu aplicativo.

**Principais Vantagens:**

  * **Desenvolvimento Independente:** O time de frontend pode construir e testar a aplicação inteira sem depender do time de backend.
  * **Testes Confiáveis:** Crie cenários previsíveis para seus testes automatizados, sem se preocupar com a instabilidade de um ambiente de desenvolvimento.
  * **Desenvolvimento Offline:** Programe e teste sua aplicação de qualquer lugar, sem precisar de conexão com a internet.
  * **Prototipagem Rápida:** Demonstre fluxos completos da aplicação antes mesmo de ter uma linha de código de backend.

## 1\. Configuração Inicial

A configuração do Mirage é feita para que ele seja ativado apenas em ambiente de desenvolvimento.

**1. Habilitação Condicional com `.env`**
Use uma variável de ambiente para ligar ou desligar o Mirage.

**`.env`**

```env
# Ativa o mock de API (true/false)
REACT_APP_MIRAGE_ENABLED=true
```

**2. Inicialização Condicional no App**
No ponto de entrada da sua aplicação (`App.tsx`), importe e inicie o servidor do Mirage apenas se a variável de ambiente estiver ativa.

**`App.tsx`**

```tsx
// ... outros imports
import { makeServer } from './src/services/mirage';

if (process.env.REACT_APP_MIRAGE_ENABLED === 'true') {
  makeServer();
}

const App = () => {
  // ... resto da sua aplicação
};
```

## 2\. Construindo o Servidor Mock

O coração do Mirage é o arquivo do servidor, onde você define as rotas que serão interceptadas.

**`src/services/mirage/index.ts`**

```ts
import { createServer, Model } from 'miragejs';
import { faker } from '@faker-js/faker'; // Biblioteca para gerar dados falsos

export function makeServer() {
  const server = createServer({
    // Models define a "estrutura" do seu banco de dados em memória
    models: {
      user: Model,
    },

    // Factories são "fábricas" de dados falsos, muito úteis com o Faker
    factories: {
      user: () => ({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        avatar: faker.image.avatar(),
      }),
    },

    // seeds popula o banco de dados quando o servidor inicia
    seeds(server) {
      server.createList('user', 10); // Cria 10 usuários falsos
    },

    // routes é onde a mágica acontece
    routes() {
      // Define a base da URL da sua API e um namespace
      this.urlPrefix = 'https://api.myapp.com';
      this.namespace = 'v1';

      // Intercepta requisições GET para /v1/users
      this.get('/users', (schema) => {
        return schema.all('user'); // Retorna todos os usuários do banco de dados do Mirage
      });

      // Intercepta requisições POST para /v1/users
      this.post('/users', (schema, request) => {
        const attrs = JSON.parse(request.requestBody);
        return schema.create('user', attrs); // Cria um novo usuário
      });

      // Intercepta uma rota com parâmetro dinâmico
      this.get('/users/:id', (schema, request) => {
        const id = request.params.id;
        return schema.find('user', id); // Busca um usuário por ID
      });

      // Permite que requisições para outros domínios passem direto
      this.passthrough('https://api.google.com/**');
    },
  });

  return server;
}
```

## 3\. Entendendo os Componentes do Servidor

  * **`createServer`**: Inicia o servidor do Mirage.
  * **`routes()`**: É o método onde você define os *route handlers* (manipuladores de rota).
  * **`this.get`, `this.post`, etc.**: Métodos que correspondem aos verbos HTTP. Eles recebem o caminho da rota e uma função para executar.
  * **Handler Function**: A função que define o que acontece quando uma rota é interceptada. Ela recebe:
      * `schema`: Um objeto para interagir com o banco de dados em memória do Mirage.
      * `request`: Um objeto com os detalhes da requisição interceptada (parâmetros, corpo da requisição, etc.).
  * **`this.passthrough()`**: Uma função essencial para instruir o Mirage a **ignorar** certas requisições, deixando que elas prossigam para a internet. Isso é útil para APIs de terceiros que você não quer mockar.

## ✅ Conclusão

O Mirage JS é uma ferramenta de desenvolvimento poderosa que desacopla o frontend do backend, trazendo agilidade e autonomia para a equipe. Ao simular uma API de forma realista e controlada, ele permite:

  * **Construir features mais rápido:** Sem esperar a API ficar pronta.
  * **Testar todos os cenários:** Simule sucesso, erro, lentidão e diferentes tipos de dados com facilidade.
  * **Melhorar a experiência do desenvolvedor:** Trabalhe de forma mais eficiente e com menos bloqueios.

Integrar o Mirage JS no seu fluxo de trabalho é um grande passo para criar aplicações mais robustas e acelerar o ciclo de desenvolvimento.

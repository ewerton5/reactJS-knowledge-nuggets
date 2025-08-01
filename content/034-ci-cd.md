###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/033-social-sign-in.md)

# 📘 Pílula de Conhecimento 34 — CI/CD: Automatizando o Ciclo de Vida do seu App

**CI/CD** é um conjunto de práticas e ferramentas que automatizam as etapas do desenvolvimento de software, desde a integração do código até a entrega final ao usuário. Adotar CI/CD significa criar um "pipeline" (esteira) automatizado que constrói, testa e implanta sua aplicação, tornando o processo mais rápido, seguro e confiável.

## 1\. Desvendando os Conceitos: CI e CD

### CI - Integração Contínua (Continuous Integration)

A **Integração Contínua** é a prática de mesclar ("integrar") as alterações de código de vários desenvolvedores em um repositório central de forma frequente. A cada nova integração, um processo automatizado é disparado para:

1.  **Construir (Build):** Compilar o código para garantir que ele não tenha erros de sintaxe.
2.  **Testar:** Executar a suíte de testes automatizados (unitários, de integração) para verificar se as novas alterações não quebraram funcionalidades existentes.
3.  **Analisar:** Rodar linters (como o ESLint) para garantir a conformidade com os padrões de código.

O objetivo da CI é detectar bugs e problemas de integração o mais cedo possível.

### CD - Entrega/Implantação Contínua (Continuous Delivery/Deployment)

A **Entrega Contínua** é a etapa seguinte. Após o código passar com sucesso pela fase de CI, ele é automaticamente preparado para o lançamento.

  * **Continuous Delivery (Entrega Contínua):** O pipeline prepara uma versão pronta para ser implantada e a coloca em um ambiente de "stage" ou homologação. O deploy para produção ainda requer uma aprovação manual.
  * **Continuous Deployment (Implantação Contínua):** É o passo final. Se a build passar em todos os testes, ela é implantada **automaticamente** em produção, sem intervenção humana.

## 2\. Construindo um Pipeline com GitHub Actions

O **GitHub Actions** é a ferramenta de CI/CD nativa do GitHub. Ele permite criar pipelines (chamados de *workflows*) diretamente no seu repositório, definidos em arquivos de configuração no formato YAML.

### Anatomia de um Workflow

Um workflow é definido em um arquivo como `.github/workflows/main.yml` e possui os seguintes componentes principais:

  * **`name`**: O nome do workflow que aparecerá na aba "Actions" do GitHub.
  * **`on`**: O gatilho (trigger) que inicia o workflow. Ex: um `push` para a branch `main`.
  * **`jobs`**: As tarefas a serem executadas. Um workflow pode ter um ou mais jobs.
  * **`runs-on`**: O ambiente da máquina virtual onde o job será executado (ex: `ubuntu-latest`, `macos-latest`).
  * **`steps`**: A sequência de comandos ou ações que compõem um job.

### Exemplo de Workflow de CI para uma Aplicação React Native

Este workflow é acionado a cada `push` na branch `main`, instala as dependências e roda os testes unitários.

**`.github/workflows/ci.yml`**

```yaml
name: React Native CI

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    name: Run Unit Tests
    runs-on: ubuntu-latest

    steps:
      # 1. Clona o código do repositório para a máquina virtual
      - name: Checkout code
        uses: actions/checkout@v3

      # 2. Configura o ambiente Node.js na versão especificada
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'yarn' # Habilita o cache para acelerar instalações futuras

      # 3. Instala as dependências do projeto
      - name: Install dependencies
        run: yarn install --frozen-lockfile

      # 4. Roda os testes unitários
      - name: Run Jest tests
        run: yarn test
```

## 3\. A Etapa de Deploy (CD)

Para fazer o deploy, adicionamos mais steps ou um novo job ao nosso workflow. Esta etapa geralmente requer credenciais (chaves de API, senhas de servidor), que devem ser armazenadas de forma segura usando os **GitHub Secrets**.

### Exemplo de um Step de Deploy para um Servidor Web

Este exemplo conceitual usa uma Action para se conectar a um servidor via SSH e reiniciar a aplicação.

```yaml
      # ... steps anteriores de CI ...

      # 5. Step de Deploy
      - name: Deploy to Production Server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.PROD_SERVER_HOST }}     # IP do servidor
          username: ${{ secrets.PROD_SERVER_USER }} # Usuário SSH
          key: ${{ secrets.PROD_SSH_KEY }}          # Chave privada SSH
          script: |
            cd /var/www/my-app
            git pull
            yarn install --production
            pm2 restart my-app
```

> **Segurança:** As credenciais (`PROD_SERVER_HOST`, etc.) são configuradas em **Settings \> Secrets and variables \> Actions** no seu repositório GitHub e nunca são expostas diretamente no código.

## 4\. Bônus: CI/CD para Mobile com Fastlane

Para React Native, o deploy para as lojas (App Store e Google Play) é um processo complexo que envolve assinatura de código, gerenciamento de certificados e upload. O **Fastlane** é uma ferramenta de automação que simplifica todas essas etapas.

Você pode configurar o Fastlane para construir, assinar e enviar seu app para o TestFlight (iOS) ou para o Google Play Console, e então chamar os comandos do Fastlane a partir do seu workflow no GitHub Actions.

## ✅ Conclusão

CI/CD é uma prática transformadora que introduz automação e segurança no ciclo de desenvolvimento. Ao configurar um pipeline, você garante que cada alteração no código seja automaticamente testada e, se aprovada, entregue de forma consistente.

Ferramentas como o **GitHub Actions** tornaram a implementação de CI/CD mais acessível do que nunca. Como diz o ditado do desenvolvedor moderno: **"Automatize agora, para poder agradecer depois."**

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/035-parallel-development.md) 👉

###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/036-performance-optimization.md)

# 📘 Pílula de Conhecimento 37 — Lançamento de Apps para Teste Interno

Após o desenvolvimento de novas funcionalidades e correções, o próximo passo crucial é distribuir o aplicativo para a equipe de testes (QA) ou para os stakeholders validarem as mudanças. Este processo, conhecido como "lançamento para teste interno", é feito através das plataformas oficiais de cada ecossistema: a **Google Play Console** para Android e o **TestFlight** para iOS.

## 1\. Preparação Comum a Ambas as Plataformas

Antes de iniciar o build de cada plataforma, algumas etapas de organização são essenciais:

1.  **Criar uma Branch de Build:** A partir da branch `develop` (ou da sua branch principal), crie uma nova branch específica para a release, como `build/v5.4.0`. Isso isola o processo de lançamento.
2.  **Atualizar o `CHANGELOG.md`:** Documente todas as alterações significativas desta nova versão de forma clara. Este texto será a base para as "notas de lançamento" nas lojas.
3.  **Fazer o Commit do Changelog:** Salve o changelog atualizado com uma mensagem clara (ex: `docs: update changelog for v5.4.0`).

## 2\. Lançamento para Android (Google Play Console)

O processo no Android envolve gerar um arquivo `.aab` (Android App Bundle) assinado e fazer o upload para a Play Console.

**Passo 1: Versionamento**
Abra o arquivo `android/app/build.gradle` e atualize os seguintes campos:

  * **`versionCode`**: Incremente este número inteiro. A Play Store exige que cada novo upload tenha um `versionCode` maior que o anterior.
  * **`versionName`**: Atualize a versão visível para o usuário (ex: `"5.4.0"`), seguindo o padrão de [Versionamento Semântico](https://www.google.com/search?q=%23-conceito-chave-versionamento-sem%C3%A2ntico).

**Passo 2: Configurar a Assinatura**
Garanta que as credenciais da sua chave de assinatura (keystore) estejam configuradas no arquivo `android/gradle.properties`, como vimos na pílula sobre a parte nativa.

**Passo 3: Gerar o App Bundle (`.aab`)**
No terminal, a partir da raiz do projeto, execute o script de build para release. O comando padrão é:

```bash
# Navega para a pasta android e executa o comando de build
cd android && ./gradlew bundleRelease
```

Este comando gerará o arquivo `.aab` assinado em `android/app/build/outputs/bundle/release/`.

**Passo 4: Upload para a Play Console**

1.  Acesse a [Google Play Console](https://play.google.com/console/).
2.  Navegue até a seção **Teste Interno**.
3.  Clique em **Criar nova versão**.
4.  Na seção "Pacotes de apps", faça o upload do arquivo `.aab` que você gerou.
5.  Em "Notas da versão", cole o conteúdo do seu `CHANGELOG.md`.
6.  Clique em **Salvar** e, em seguida, em **Revisar versão** para disponibilizá-la para os testadores.

**Passo 5: Commit Final**
Faça o commit das alterações de versão com uma mensagem padronizada: `build(android): release version 5.4.0 (184)`.

## 3\. Lançamento para iOS (TestFlight)

O processo no iOS é centralizado no **Xcode**.

**Passo 1: Versionamento**

1.  Abra o arquivo `.xcworkspace` do seu projeto no Xcode.
2.  Selecione a raiz do projeto no navegador à esquerda e vá para a aba **General**.
3.  Atualize os campos:
      * **`Version`**: A versão visível para o usuário (ex: `5.4.0`).
      * **`Build`**: Incremente este número. O App Store Connect exige que cada build tenha um número maior que o anterior para a mesma versão.

**Passo 2: Arquivar o Projeto**

1.  No topo do Xcode, mude o destino do build de um simulador para **Any iOS Device (arm64)**.
2.  No menu superior, vá em **Product \> Clean Build Folder** (atalho: `Cmd+Shift+K`) para limpar caches antigos.
3.  Em seguida, vá em **Product \> Archive**. O Xcode irá compilar e "arquivar" sua aplicação.

**Passo 3: Distribuir e Fazer Upload**

1.  Após o arquivamento, a janela "Organizer" abrirá com sua nova build.
2.  Selecione a build e clique em **Distribute App**.
3.  Siga o fluxo: selecione **App Store Connect** como método de distribuição e **Upload** como destino.
4.  O Xcode irá validar, assinar e fazer o upload da build para o App Store Connect. Este processo pode levar alguns minutos.

**Passo 4: Gerenciar no App Store Connect**

1.  Acesse o [App Store Connect](https://appstoreconnect.apple.com/).
2.  Vá para a seção **TestFlight** do seu aplicativo.
3.  Sua nova build aparecerá com um status de "Processando". Aguarde a conclusão.
4.  Quando a build estiver pronta, adicione as "Notas do Teste" (o que mudou nesta versão) e distribua para seus grupos de teste internos.

**Passo 5: Commit Final**
O Xcode modifica os arquivos de projeto (`.pbxproj`). Faça o commit dessas alterações com uma mensagem clara: `build(ios): release version 5.4.0 (1.7.4)`.

-----

## 💡 Conceito-Chave: Versionamento Semântico

O versionamento de software geralmente segue o padrão **MAJOR.MINOR.PATCH** (ex: `5.4.0`).

  * **PATCH (`0`):** Para correções de bugs que não alteram a funcionalidade (`bug fixes`).
  * **MINOR (`4`):** Para adição de novas funcionalidades de forma retrocompatível.
  * **MAJOR (`5`):** Para mudanças que quebram a compatibilidade com versões anteriores (grandes refatorações ou novas features disruptivas).

-----

## ✅ Conclusão

O processo de lançamento para teste interno, embora tenha muitos passos, torna-se uma rotina com a prática. Seguir um fluxo de trabalho consistente — com branches de build, atualização de changelogs e versionamento correto — é essencial para manter o ciclo de desenvolvimento organizado e garantir que os testadores sempre recebam a versão correta do aplicativo para validação.
###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/019-native-android.md)

# 📘 Pílula de Conhecimento 20 — O Lado Nativo do React Native (Foco em iOS)

Continuando nossa exploração da parte nativa, hoje vamos mergulhar na pasta `ios`. Assim como a pasta `android`, ela contém um projeto nativo completo, mas construído com as ferramentas e a linguagem do ecossistema Apple. Para interagir com ele, o **Xcode**, a IDE oficial da Apple, é indispensável e só está disponível no macOS.

## 1\. Ferramentas e Conceitos Fundamentais

### CocoaPods: O Gerenciador de Dependências

O **CocoaPods** é para o iOS o que o npm ou o yarn são para o JavaScript. Ele gerencia as dependências nativas do projeto, chamadas de "Pods".

  * **`Podfile`**: Este arquivo, localizado na pasta `ios`, lista todas as dependências nativas do seu projeto. O Autolinking do React Native geralmente adiciona as bibliotecas aqui automaticamente.
  * **`pod install`**: Após instalar uma nova biblioteca com `yarn` ou `npm` que contenha código nativo, é **essencial** navegar até a pasta `ios` no terminal e executar `pod install` (ou `npx pod-install` da raiz). Este comando baixa e integra as dependências nativas ao seu projeto Xcode. Esquecer este passo é uma das causas mais comuns de erros de build.

### Projeto Xcode: `.xcworkspace`

Dentro da pasta `ios`, você encontrará dois arquivos de projeto: `.xcodeproj` e `.xcworkspace`. **Você deve sempre abrir o arquivo `.xcworkspace`**, pois ele contém tanto o seu projeto principal quanto as dependências dos Pods.

## 2\. Navegando pelo Projeto no Xcode

Uma vez com o projeto aberto no Xcode, estas são as áreas mais importantes:

#### `Info.plist`

Este é o arquivo de "propriedades" principal do seu app, o equivalente ao `AndroidManifest.xml` do Android. É um arquivo XML onde você configura metadados essenciais.

  * **Permissões:** A Apple exige que, para cada permissão solicitada (câmera, localização, microfone, etc.), você forneça uma **descrição clara do motivo do uso**. Essa descrição será exibida para o usuário na caixa de diálogo de permissão.

**Exemplo de chave de permissão para a Câmera no `Info.plist`:**

```xml
<key>NSCameraUsageDescription</key>
<string>Precisamos de acesso à sua câmera para que você possa escanear códigos de barras e adicionar fotos aos seus relatórios.</string>
```

#### `Images.xcassets`

Este é o "catálogo de mídia", onde você gerencia os recursos visuais da aplicação.

  * **`AppIcon`**: Contém todos os "slots" para os diferentes tamanhos de ícone exigidos pelo iOS. Você pode usar um site gerador de ícones para criar todas as resoluções necessárias a partir de uma imagem grande (1024x1024) e arrastá-las para os locais corretos.
  * **`LaunchScreen`**: É a tela que aparece brevemente enquanto seu aplicativo está sendo carregado. Você pode customizá-la usando a ferramenta Interface Builder do Xcode.

## 3\. Configurações Essenciais no Xcode

Selecionando o nome do seu projeto no painel esquerdo, você acessará as configurações principais.

#### Aba "General"

  * **Display Name:** O nome do seu aplicativo que aparece abaixo do ícone.
  * **Bundle Identifier:** O identificador único do seu app na App Store (ex: `com.suaempresa.seuapp`).
  * **Version:** O número da versão visível para o usuário na App Store (ex: `1.2.0`).
  * **Build:** Um número incremental que identifica cada build enviada para a Apple. **Você deve incrementar este número a cada novo upload.**

#### Aba "Signing & Capabilities"

Esta é a área mais crítica para a distribuição.

  * **Signing:** Para instalar seu app em um dispositivo físico ou enviá-lo para a loja, ele precisa ser assinado digitalmente. Isso requer uma conta de desenvolvedor Apple (Apple Developer Program) e a configuração de um **Time** e **Certificados de Assinatura**, que garantem a sua identidade.
  * **Capabilities:** Funcionalidades do sistema que seu app precisa acessar, como `Push Notifications`, `Background Modes` ou `Sign in with Apple`. Você as adiciona aqui para habilitar as APIs correspondentes.

## 4\. Gerando uma Versão para a App Store

O processo de enviar uma build para a Apple é feito através do Xcode.

**Passo 1: Preparação**

  * No Xcode, mude o destino do build de um simulador para **Any iOS Device (arm64)**.
  * Na aba "General", incremente o número do **Build**.

**Passo 2: Arquivar o Projeto**

  * No menu superior, vá em **Product \> Archive**. O Xcode irá compilar e empacotar sua aplicação em um arquivo de arquivamento.

**Passo 3: Distribuir via Organizer**

  * Após o arquivamento ser concluído com sucesso, a janela "Organizer" abrirá automaticamente, mostrando sua nova build.
  * Selecione a build e clique no botão **Distribute App**.

**Passo 4: Upload para o App Store Connect**

  * Siga as instruções na tela. O processo padrão é fazer o upload para o **App Store Connect**, a plataforma web da Apple onde você gerencia seus aplicativos.
  * Após o upload, a build ficará disponível no App Store Connect para ser distribuída para testadores via **TestFlight** ou enviada para a revisão final da Apple para ser publicada na loja.

> **Aviso Importante:** A Apple é extremamente rigorosa em seu processo de revisão. Textos de permissão vagos, bugs que travam o app ou funcionalidades que não estão de acordo com as diretrizes da Apple podem levar à rejeição da sua build.

## ✅ Conclusão

Embora o React Native faça um ótimo trabalho em abstrair a complexidade nativa, um conhecimento básico do ecossistema iOS e do Xcode é indispensável para qualquer desenvolvedor que precise publicar um aplicativo na App Store. Entender onde configurar permissões no `Info.plist`, como gerenciar ícones no `Assets.xcassets` e, principalmente, dominar o fluxo de arquivamento e distribuição são habilidades que transformam um projeto de desenvolvimento em um produto real no universo Apple.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/021-deep-link.md) 👉

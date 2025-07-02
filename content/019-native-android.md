###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/018-offline-first.md)

# 📘 Pílula de Conhecimento 19 — O Lado Nativo do React Native (Foco em Android)

Um projeto React Native é composto por uma base de código em JavaScript e dois projetos nativos independentes: as pastas `android` e `ios`. Essas pastas contêm projetos completos que podem ser abertos com o **Android Studio** e o **Xcode**, respectivamente. O React Native atua como uma ponte, "injetando" e controlando a UI nativa a partir do JavaScript.

Antigamente, era comum precisar editar esses arquivos nativos manualmente para instalar bibliotecas. Hoje, com o **Autolinking**, a maioria das configurações é automática. No entanto, entender a estrutura desses projetos ainda é crucial para tarefas como configurar ícones, permissões e gerar a versão final do aplicativo para a loja.

## 1\. Navegando pela Pasta `android`

Estes são os arquivos e pastas com os quais você mais provavelmente irá interagir:

  * **`android/app/build.gradle`**: O arquivo de configuração mais importante da sua aplicação. É aqui que você define:
      * `applicationId`: O identificador único do seu app na Play Store.
      * `versionCode` e `versionName`: As versões do seu aplicativo.
      * Dependências nativas específicas do módulo `app`.
  * **`android/app/src/main/AndroidManifest.xml`**: O "coração" do seu aplicativo Android. Ele declara:
      * **Permissões:** Acesso à internet, câmera, localização, etc.
      * **Ícone do App:** Referência para os arquivos de ícone.
      * **Telas (Activities):** As telas nativas da aplicação.
      * **Deep Linking:** Configurações para abrir o app a partir de um link.
  * **`android/app/src/main/res/`**: A pasta de recursos.
      * `mipmap-XXXX/`: Contém as diferentes resoluções do ícone do seu aplicativo (`ic_launcher.png`).
      * `values/`: Contém arquivos de definição de strings (`strings.xml`) e cores (`colors.xml`).
  * **`gradle.properties`**: Onde você pode configurar variáveis globais para o Gradle, como as senhas da sua chave de assinatura para a versão de release.

## 2\. Customizações Nativas Comuns no Android

### Alterando o Ícone do Aplicativo

A forma mais fácil e segura de gerar todas as resoluções necessárias para o ícone do seu app é usando a ferramenta nativa do Android Studio.

1.  Abra a pasta `android` do seu projeto no Android Studio.
2.  No painel esquerdo, clique com o botão direito na pasta `app`.
3.  Vá em **New \> Image Asset**.
4.  Na aba "Path", selecione sua imagem de ícone em alta resolução (ex: 1024x1024).
5.  A ferramenta irá gerar automaticamente todas as versões do ícone dentro das pastas `mipmap`.

### Adicionando Permissões

Para usar recursos como a câmera ou a localização, você precisa declarar a permissão no `AndroidManifest.xml`.

**`android/app/src/main/AndroidManifest.xml`**

```xml
<manifest ...>
    <uses-permission android:name="android.permission.INTERNET" />

    <uses-permission android:name="android.permission.CAMERA" />

    <application ...>
        ...
    </application>
</manifest>
```

> Lembre-se: declarar a permissão aqui apenas informa ao sistema que seu app *pode* pedi-la. A solicitação em si, para o usuário, ainda precisa ser feita via JavaScript com uma biblioteca como a `react-native-permissions`.

## 3\. Gerando uma Versão de Lançamento (Release)

Para publicar seu aplicativo na Google Play Store, você precisa gerar um arquivo assinado digitalmente.

#### Passo 1: Gerar uma Chave de Assinatura (Keystore)

Esta chave é a sua identidade como desenvolvedor. Você a gera uma única vez e a reutiliza para todas as atualizações. Execute o seguinte comando no terminal, dentro da pasta `android/app`:

```bash
keytool -genkeypair -v -keystore my-release-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

Guarde este arquivo `.keystore` e as senhas em um lugar seguro. **Nunca o envie para seu repositório Git\!**

#### Passo 2: Configurar as Credenciais no `gradle.properties`

Adicione as informações da sua chave no arquivo `android/gradle.properties` para que o sistema de build possa acessá-las. Lembre-se de adicionar este arquivo ao `.gitignore`.

**`android/gradle.properties`**

```properties
MYAPP_RELEASE_STORE_FILE=my-release-key.keystore
MYAPP_RELEASE_KEY_ALIAS=my-key-alias
MYAPP_RELEASE_STORE_PASSWORD=sua_senha_da_keystore
MYAPP_RELEASE_KEY_PASSWORD=sua_senha_da_key
```

#### Passo 3: Configurar a Assinatura no `build.gradle`

Adicione o bloco `signingConfigs` no seu arquivo `android/app/build.gradle` para ensinar o Gradle a usar sua chave na versão de release.

**`android/app/build.gradle`**

```groovy
...
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_RELEASE_STORE_FILE')) {
                storeFile file(MYAPP_RELEASE_STORE_FILE)
                storePassword MYAPP_RELEASE_STORE_PASSWORD
                keyAlias MYAPP_RELEASE_KEY_ALIAS
                keyPassword MYAPP_RELEASE_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

#### Passo 4: Gerar o Arquivo Final (AAB ou APK)

Navegue até a pasta `android` no seu terminal e escolha um dos comandos abaixo:

**Para publicar na Google Play Store (Formato AAB - Recomendado)**

```bash
./gradlew bundleRelease
```

Este comando irá gerar um arquivo **`.aab`** (Android App Bundle) em `android/app/build/outputs/bundle/release/`. Este é o formato moderno que você deve enviar para a Play Store, pois ele permite que a loja distribua uma versão otimizada do seu app para cada tipo de dispositivo.

**Para Testes ou Distribuição Direta (Formato APK)**

```bash
./gradlew assembleRelease
```

Este comando irá gerar um arquivo **`.apk`** (Android Package Kit) universal em `android/app/build/outputs/apk/release/`. Este arquivo pode ser instalado diretamente em qualquer dispositivo Android para testes ou para distribuição fora da Play Store.

## ✅ Conclusão

Embora o React Native abstraia grande parte da complexidade nativa, ter um conhecimento básico da pasta `android` é essencial para qualquer desenvolvedor da plataforma. Saber onde configurar permissões, alterar ícones e, principalmente, como gerar uma versão de lançamento assinada são habilidades cruciais que separam um projeto de desenvolvimento de um produto pronto para o mercado.

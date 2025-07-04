###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/020-native-ios.md)

# 📘 Pílula de Conhecimento 21 — Deep Linking em React Native

**Deep Linking** é a tecnologia que permite que uma URL abra sua aplicação móvel diretamente em uma tela específica, em vez de apenas na tela inicial. É o que cria uma ponte entre o mundo externo (websites, e-mails, notificações, outras aplicações) e o conteúdo dentro do seu app, proporcionando uma experiência de usuário contínua e integrada.

## 1\. Os Dois Tipos de Deep Links

Existem duas abordagens principais para implementar deep links, cada uma com suas características:

### Custom URL Schemes (Links Tradicionais)

Utilizam um "protocolo" customizado, único para sua aplicação.

  * **Formato:** `meuapp://telas/detalhes/42`
  * **Funcionamento:** Só funciona se o aplicativo já estiver instalado no dispositivo do usuário.
  * **Vantagem:** Configuração nativa relativamente simples.
  * **Desvantagem:** Não são links web padrão e não podem ser abertos em um navegador se o app não estiver instalado (resultando em um erro). São ideais para gatilhos internos, como notificações push e QR Codes.

### Universal Links (iOS) e App Links (Android)

Utilizam URLs HTTP/HTTPS padrão, que apontam para o seu website.

  * **Formato:** `https://www.meusite.com/telas/detalhes/42`
  * **Funcionamento:** É a abordagem moderna e recomendada.
      * **Se o app estiver instalado:** O sistema operacional intercepta a URL e abre o aplicativo diretamente na tela correta.
      * **Se o app NÃO estiver instalado:** A URL é aberta normalmente no navegador, levando o usuário para a página web correspondente, onde você pode incentivá-lo a baixar o app.
  * **Vantagem:** Oferece uma experiência sem falhas (graceful fallback) e melhora o engajamento.

## 2\. Configurando Deep Links com React Navigation

A biblioteca `react-navigation` centraliza a configuração dos deep links através da prop `linking` no `NavigationContainer`. Nela, você mapeia os padrões de URL para as telas da sua navegação.

**Exemplo de Configuração `linking`:**

```ts
import { NavigationContainer } from '@react-navigation/native';

const linkingConfig = {
  // 1. Define os prefixos que seu app irá responder
  prefixes: [
    'smart://', // Custom URL Scheme
    'https://app.smart.com', // Universal Link / App Link
  ],
  // 2. Mapeia os caminhos da URL para as telas do app
  config: {
    screens: {
      MainTabs: { // Nome do navegador de abas
        screens: {
          Home: 'home', // https://app.smart.com/home
          Profile: 'profile', // https://app.smart.com/profile
        },
      },
      Details: 'details/:itemId', // Rota com parâmetro dinâmico
      NotFound: '*', // Rota para qualquer caminho não encontrado
    },
  },
};

const App = () => (
  <NavigationContainer linking={linkingConfig} fallback={<Text>Carregando...</Text>}>
    {/* ... Seus navegadores e telas */}
  </NavigationContainer>
);
```

## 3\. A Configuração Nativa Essencial

Para que os links funcionem, você **precisa** configurar os projetos nativos.

### Para Android (`AndroidManifest.xml`)

Adicione um `<intent-filter>` dentro da `<activity>` principal no seu `AndroidManifest.xml`.

```xml
<activity ...>
  <intent-filter>
    <action android:name="android.intent.action.VIEW" />
    <category android:name="android.intent.category.DEFAULT" />
    <category android:name="android.intent.category.BROWSABLE" />
    
    <data android:scheme="smart" />
    
    <data android:scheme="https" android:host="app.smart.com" />
  </intent-filter>
</activity>
```

### Para iOS (Xcode)

1.  Abra seu projeto no Xcode.
2.  Vá para a aba **Signing & Capabilities**.
3.  Clique em **+ Capability** e adicione **Associated Domains**.
4.  Na nova seção, adicione seu domínio no formato `applinks:seu.dominio.com` (ex: `applinks:app.smart.com`).

> **Nota:** Para Universal Links no iOS, seu website também precisa hospedar um arquivo de configuração especial (`apple-app-site-association`) para provar a associação com o seu app.

## 4\. Recebendo Parâmetros de um Deep Link

Os parâmetros definidos na sua configuração (ex: `:itemId`) são automaticamente passados para a tela através dos `route.params`. Você pode acessá-los com o hook `useRoute`.

**Exemplo na tela de Detalhes:**

```tsx
import { useRoute } from '@react-navigation/native';

function DetailsScreen() {
  const route = useRoute();
  // Se a URL for `smart://details/42`, itemId será "42"
  const { itemId } = route.params;

  useEffect(() => {
    if (itemId) {
      // Carrega os dados do item com o ID recebido
      fetchItemDetails(itemId);
    }
  }, [itemId]);

  return <Text>Exibindo detalhes para o item: {itemId}</Text>;
}
```

## 5\. Casos de Uso Comuns

  * **Notificações Push:** Ao clicar em uma notificação, o usuário é levado diretamente para o conteúdo relevante (ex: uma tela de chat ou uma promoção).
  * **QR Codes:** Lojas físicas e eventos podem usar QR Codes que contêm um deep link para abrir uma página específica do produto ou um check-in.
  * **Links Compartilhados:** Permite que usuários compartilhem links de conteúdos específicos do seu app em redes sociais ou mensageiros, criando um ciclo de engajamento viral.

## ✅ Conclusão

Deep Linking é uma tecnologia essencial para integrar sua aplicação móvel ao ecossistema digital mais amplo. Ela quebra as barreiras do aplicativo, permitindo criar pontos de entrada contextuais que melhoram drasticamente a aquisição e o engajamento de usuários. Uma implementação bem-sucedida requer uma configuração cuidadosa tanto no React Navigation quanto nos projetos nativos, mas o resultado é uma experiência de usuário muito mais fluida e conectada.

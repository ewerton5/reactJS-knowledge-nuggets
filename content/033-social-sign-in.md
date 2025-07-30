###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/032-search-and-optimization-algorithms.md)

# 📘 Pílula de Conhecimento 33 — Implementando Login Social em React Native

O **Login Social** é o método de autenticação que permite aos usuários entrarem em sua aplicação usando suas contas de serviços de terceiros, como Google, Facebook ou Apple. Essa abordagem oferece uma experiência de usuário fluida e conveniente, eliminando a necessidade de criar e lembrar de uma nova senha, o que pode aumentar significativamente as taxas de conversão e cadastro.

## 1\. O Fluxo de Funcionamento

A implementação do login social envolve uma coordenação entre três partes: seu aplicativo (cliente), o provedor social (ex: Google) e o seu servidor (backend).

1.  **Ação do Cliente:** O usuário clica em "Entrar com o Google" no seu aplicativo.
2.  **Autenticação no Provedor:** Seu app, usando uma biblioteca nativa, abre a tela de login do Google. O usuário se autentica com sua conta Google.
3.  **Recebimento do Token do Provedor:** Após a autenticação bem-sucedida, o Google retorna um token especial (como um `idToken`) para o seu aplicativo.
4.  **Validação no Backend:** Seu aplicativo envia esse `idToken` para o **seu próprio backend**.
5.  **Criação da Sessão:** Seu backend valida o `idToken` com os servidores do Google. Se for válido, ele cria uma nova conta de usuário (ou encontra uma existente) e gera um **token de sessão da sua aplicação** (ex: um JWT), que é enviado de volta para o cliente.
6.  **Login Concluído:** Seu aplicativo armazena o token da sua API e o usuário está autenticado no seu sistema.

## 2\. O Lado do Desenvolvedor: Configuração do Provedor

Antes de escrever qualquer código, você precisa registrar seu aplicativo no painel de desenvolvedor de cada provedor que deseja usar.

  * **Google:** No **Google Cloud Console**, você cria um projeto e configura uma "Tela de consentimento OAuth", obtendo um **Client ID** para Web, Android e iOS.
  * **Facebook (Meta):** No painel **Meta for Developers**, você cria um App, configura o produto "Login do Facebook" e obtém um **App ID**.
  * **Apple:** No **Apple Developer Portal**, você configura um "App ID" e um "Service ID" para habilitar o "Sign in with Apple".

Esse processo de configuração é crucial e fornecerá as chaves (IDs e segredos) necessárias para as bibliotecas no lado do cliente.

## 3\. Implementação no React Native (Client-Side)

Você não implementa o fluxo do zero. Em vez disso, usa bibliotecas especializadas para cada provedor.

### Login com Google (`@react-native-google-signin/google-signin`)

```tsx
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Configure uma vez no início da sua aplicação
GoogleSignin.configure({
  webClientId: 'SEU_WEB_CLIENT_ID_DO_GOOGLE_CONSOLE.apps.googleusercontent.com',
});

const handleGoogleSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const { idToken } = await GoogleSignin.signIn(); // Abre a tela de login nativa

    // Envie o idToken para o seu backend para validação e criação da sessão
    if (idToken) {
      const response = await api.post('/auth/google', { token: idToken });
      // Armazene o token da SUA API
      await storeAppToken(response.data.token);
    }
  } catch (error) {
    console.error(error);
  }
};
```

### Login com Facebook (`react-native-fbsdk-next`)

```tsx
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';

const handleFacebookSignIn = async () => {
  try {
    const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);

    if (result.isCancelled) {
      throw 'User cancelled the login process';
    }

    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      throw 'Something went wrong obtaining access token';
    }

    // Envie o data.accessToken para o seu backend
    const response = await api.post('/auth/facebook', { token: data.accessToken });
    await storeAppToken(response.data.token);
  } catch (error) {
    console.error(error);
  }
};
```

### Login com Apple (`@invertase/react-native-apple-authentication`)

```tsx
import appleAuth from '@invertase/react-native-apple-authentication';

const handleAppleSignIn = async () => {
  try {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });

    const { identityToken } = appleAuthRequestResponse;

    if (identityToken) {
      // Envie o identityToken para o seu backend
      const response = await api.post('/auth/apple', { token: identityToken });
      await storeAppToken(response.data.token);
    }
  } catch (error) {
    console.error(error);
  }
};
```

## 4\. O Fluxo de Pós-Cadastro: Completando o Perfil

Um ponto crítico do login social é que os provedores geralmente retornam apenas informações básicas (nome, e-mail). Sua aplicação pode exigir dados adicionais, como número de telefone, data de nascimento ou a aceitação dos Termos de Serviço.

A melhor prática é implementar um fluxo de **pós-cadastro**.

1.  Após o primeiro login social bem-sucedido, seu backend deve retornar um status indicando que o usuário é novo e seu perfil está incompleto (ex: `isNewUser: true`).
2.  No seu app, ao receber esse status, em vez de navegar para a tela principal (Home), você redireciona o usuário para uma série de telas de "Complete seu Perfil".
3.  Apenas após o usuário preencher os dados necessários e aceitar os termos, você o libera para a experiência completa do aplicativo.

**Exemplo de Lógica de Navegação:**

```tsx
const handleSocialLogin = async (providerToken) => {
  const { appToken, isNewUser, profileComplete } = await api.post('/auth/social', { token: providerToken });
  await storeAppToken(appToken);

  if (isNewUser || !profileComplete) {
    // Navega para o fluxo de completar o perfil
    navigation.navigate('CompleteProfileStack');
  } else {
    // Navega para a Home
    navigation.navigate('MainAppStack');
  }
};
```

## ✅ Conclusão

O Login Social é uma ferramenta poderosa para melhorar a aquisição e a experiência do usuário. Uma implementação bem-sucedida requer uma configuração cuidadosa nos painéis de desenvolvedor de cada provedor, a integração das bibliotecas corretas no lado do cliente e um backend robusto para validar os tokens. Acima de tudo, planejar o fluxo de pós-cadastro é essencial para garantir que você colete todas as informações necessárias do usuário, mantendo a conveniência do login social.

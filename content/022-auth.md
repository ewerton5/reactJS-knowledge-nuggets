###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/021-deep-link.md)

# 📘 Pílula de Conhecimento 22 — Padrões de Autenticação em Aplicações Modernas

**Autenticação** é o processo de verificar a identidade de um usuário para conceder-lhe acesso a um sistema. Em aplicações modernas, existem diversos padrões para realizar essa verificação, desde o tradicional e-mail e senha até métodos mais modernos sem senha e logins sociais. A escolha da abordagem correta depende dos requisitos de segurança e da experiência de usuário desejada para o seu produto.

## 1\. O Padrão Ouro: Autenticação com JWT (JSON Web Token)

Este é o método mais comum para APIs customizadas. O fluxo é simples e robusto:

1.  **Login:** O usuário envia suas credenciais (e-mail e senha) para o servidor.
2.  **Geração do Token:** Se as credenciais estiverem corretas, o servidor gera um **JWT**, que é um token criptografado contendo informações sobre o usuário (como seu ID e permissões) e um tempo de expiração.
3.  **Armazenamento no Cliente:** O aplicativo cliente recebe e armazena esse token de forma segura (ex: no `AsyncStorage`).
4.  **Requisições Autenticadas:** Para cada requisição subsequente a uma rota protegida, o cliente envia o JWT no cabeçalho `Authorization`.
5.  **Validação no Servidor:** O servidor decodifica e valida o token para autorizar a requisição.

### Armazenamento Seguro do Token

O token **nunca** deve ser armazenado em um estado global volátil (como Redux). Use sempre um armazenamento persistente:

- **Para React Native:** `AsyncStorage` é a escolha padrão. É um sistema de armazenamento chave-valor assíncrono.
  ```tsx
  import AsyncStorage from "@react-native-async-storage/async-storage";
  await AsyncStorage.setItem("@MyApp:token", token);
  const token = await AsyncStorage.getItem("@MyApp:token");
  ```
- **Para Web:** `localStorage` é a opção mais comum.
  ```tsx
  localStorage.setItem("myAppToken", token);
  const token = localStorage.getItem("myAppToken");
  ```

> **Nota de Segurança Web:** `localStorage` é vulnerável a ataques XSS (Cross-Site Scripting). Para aplicações web com alta exigência de segurança, a melhor prática é usar cookies `HttpOnly` gerenciados pelo servidor.

### Automação no Cliente com `axios` Interceptors

Para evitar adicionar o token manualmente em cada chamada de API, usamos _interceptors_. Eles "interceptam" a requisição antes de ela ser enviada e anexam o token automaticamente.

**Exemplo de um interceptor de requisição:**

```ts
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({ baseURL: "https://api.meuapp.com" });

api.interceptors.request.use(
  async config => {
    // Busca o token armazenado
    const token = await AsyncStorage.getItem("@MyApp:token");

    // Se o token existir, anexa ao cabeçalho
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config; // Continua com a requisição
  },
  error => {
    return Promise.reject(error);
  },
);

export default api;
```

> **Importante:** O token **nunca** deve ser armazenado em um estado global volátil (como Redux ou Zustand), pois ele seria perdido ao fechar o app. Use sempre um armazenamento persistente e seguro como o `AsyncStorage`.

## 2\. Métodos de Autenticação Comuns

### Login Social (OAuth 2.0)

Permite que os usuários façam login usando suas contas de provedores de identidade de terceiros, como Google, Apple, Facebook ou GitHub.

- **Vantagens:** Conveniência para o usuário (menos uma senha para lembrar) e um fluxo de cadastro mais rápido.
- **Implementação:** Pode ser feita manualmente, integrando-se com a API de cada provedor, ou de forma simplificada através de serviços como o **Firebase Authentication**.

#### Login Social com Google

Permite que o usuário faça login com sua conta Google, oferecendo conveniência e rapidez.

**Exemplo para Web (usando `@react-oauth/google`)**

```tsx
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const LoginScreenWeb = () => (
  <GoogleOAuthProvider clientId="SEU_CLIENT_ID_WEB.apps.googleusercontent.com">
    <GoogleLogin
      onSuccess={async credentialResponse => {
        // Envie o credentialResponse.credential (que é um JWT) para o seu backend
        // para validar e criar uma sessão no seu sistema.
        const response = await api.post("/auth/google", {
          token: credentialResponse.credential,
        });
        // Armazene o token da sua API
        localStorage.setItem("myAppToken", response.data.token);
      }}
      onError={() => {
        console.log("Login Failed");
      }}
    />
  </GoogleOAuthProvider>
);
```

**Exemplo para Mobile (usando `@react-native-google-signin/google-signin`)**

```tsx
import {
  GoogleSignin,
  statusCodes,
} from "@react-native-google-signin/google-signin";

// 1. Configure o cliente no início da sua aplicação
GoogleSignin.configure({
  webClientId: "SEU_CLIENT_ID_WEB.apps.googleusercontent.com",
});

const LoginScreenNative = () => {
  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      // Envie o idToken para o seu backend para validar e criar uma sessão
      const response = await api.post("/auth/google", { token: idToken });
      // Armazene o token da sua API
      await AsyncStorage.setItem("@MyApp:token", response.data.token);
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // usuário cancelou o fluxo de login
      } else {
        // outro erro
      }
    }
  };

  return <Button title="Entrar com Google" onPress={signIn} />;
};
```

### Login Sem Senha (Passwordless)

Esses métodos eliminam senhas, usando e-mail ou telefone como fator de autenticação. Usaremos **Supabase** como exemplo de serviço que facilita a implementação.

- **Magic Link (via E-mail):** O usuário digita seu e-mail, recebe um link de login único e, ao clicar, é autenticado e redirecionado para o app.

```tsx
import { supabase } from "./lib/supabase"; // Sua instância do cliente Supabase

const MagicLinkLogin = () => {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          // URL para onde o usuário será redirecionado após clicar no link
          emailRedirectTo: "myapp://callback",
        },
      });
      if (error) throw error;
      alert("Verifique seu e-mail para o link de login!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View>
      <TextInput
        placeholder="seu@email.com"
        onChangeText={setEmail}
        value={email}
      />
      <Button title="Enviar Link Mágico" onPress={handleLogin} />
    </View>
  );
};
```

- **SMS OTP (One-Time Password):** O usuário digita seu número de telefone, recebe um código de uso único via SMS e o insere no app para fazer login. É o método usado por apps como WhatsApp e Uber.

```tsx
import { supabase } from "./lib/supabase";

const SmsOtpLogin = () => {
  const [phone, setPhone] = useState("");
  const [token, setToken] = useState("");

  const sendOtp = async () => {
    const { error } = await supabase.auth.signInWithOtp({ phone });
    if (error) alert(error.message);
    else alert("Código enviado!");
  };

  const verifyOtp = async () => {
    const { data, error } = await supabase.auth.verifyOtp({
      phone,
      token,
      type: "sms",
    });
    if (error) alert(error.message);
    else alert("Login bem-sucedido!"); // `data.session` contém o token
  };

  return (
    <View>
      <TextInput
        placeholder="+5521999999999"
        onChangeText={setPhone}
        value={phone}
      />
      <Button title="Enviar Código" onPress={sendOtp} />

      <TextInput placeholder="123456" onChangeText={setToken} value={token} />
      <Button title="Verificar Código" onPress={verifyOtp} />
    </View>
  );
};
```

### Serviços de Terceiros (Backend-as-a-Service)

Plataformas como **Firebase Authentication** e **AWS Cognito** oferecem uma solução completa e gerenciada para a autenticação. Elas cuidam de todo o backend (armazenamento de usuários, geração de tokens, segurança), permitindo que você implemente diversos métodos de login (e-mail/senha, social, SMS) com muito menos esforço.

## 3\. Fortalecendo a Segurança com Multi-Factor Authentication (MFA)

A MFA adiciona uma camada extra de segurança, exigindo que o usuário forneça duas ou mais provas de sua identidade para fazer login. **Two-Factor Authentication (2FA)** é a forma mais comum de MFA.

O fluxo geralmente envolve:

1.  **Primeiro Fator:** Algo que o usuário _sabe_ (sua senha).
2.  **Segundo Fator:** Algo que o usuário _possui_ (um código de um app autenticador, um código SMS no seu celular ou uma chave de segurança física).

Implementar 2FA aumenta drasticamente a segurança da conta do usuário, mesmo que sua senha seja comprometida.

**Exemplo de Fluxo Conceitual (Senha + App Autenticador):**

**Passo 1: Login com Senha**

```tsx
const handlePasswordLogin = async () => {
  try {
    const response = await api.post("/auth/login", { email, password });

    if (response.data.twoFactorRequired) {
      // O backend indicou que 2FA é necessário. Guarde o token temporário.
      setTempToken(response.data.tempToken);
      // Navegue para a tela de verificação do 2FA
      navigation.navigate("Verify2FA");
    } else {
      // Login direto (usuário sem 2FA ativado)
      await storeToken(response.data.sessionToken);
    }
  } catch (error) {
    // ...
  }
};
```

**Passo 2: Verificação do Código 2FA**

```tsx
const handle2FAVerification = async () => {
  try {
    const response = await api.post("/auth/verify-2fa", {
      tempToken: tempToken, // Token recebido no Passo 1
      otpCode: otpCode, // Código do app autenticador (ex: "123456")
    });
    // Sucesso! Agora sim recebemos o token de sessão final.
    await storeToken(response.data.sessionToken);
  } catch (error) {
    alert("Código inválido!");
  }
};
```

## 4\. Gerenciando o Estado de Autenticação na Aplicação

No lado do cliente, a forma mais comum de gerenciar o fluxo de autenticação é através de um estado global simples (seja com Context API, Zustand ou Redux) que controla se o usuário está ou não logado.

**Exemplo de um Navegador Raiz Condicional:**

```tsx
import { useAuth } from "./hooks/useAuth"; // Seu hook de autenticação
import AuthStack from "./navigators/AuthStack"; // Telas de Login, Cadastro, etc.
import AppStack from "./navigators/AppStack"; // Telas principais do app

const RootNavigator = () => {
  // `isAuthenticated` vem do seu estado global
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};
```

Este padrão garante que o usuário só possa acessar as telas protegidas da aplicação após ter sido devidamente autenticado.

## ✅ Conclusão

A autenticação é uma parte crítica e complexa de qualquer aplicação. A escolha do método ideal — seja um sistema JWT customizado, login social ou uma plataforma gerenciada como Firebase — depende das necessidades do seu produto e da experiência que você deseja oferecer. Independentemente da abordagem, priorizar o armazenamento seguro de tokens, oferecer opções de MFA e gerenciar o fluxo de navegação com base no estado de autenticação são práticas essenciais para construir aplicações seguras e confiáveis.

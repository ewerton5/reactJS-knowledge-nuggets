###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/015-miragejs.md)

# 📘 Pílula de Conhecimento 16 — Tratamento de Erros em Aplicações React

Construir uma aplicação robusta não é apenas sobre fazer as funcionalidades operarem em cenários ideais, mas também sobre como ela se comporta quando as coisas dão errado. Um bom tratamento de erros é fundamental para criar uma experiência de usuário confiável e resiliente, que sabe guiar o usuário mesmo diante de falhas.

## 1\. Tipos Comuns de Erros em Aplicações Conectadas

### Falha de Rede (Modo Offline)

O cenário mais comum é a perda de conexão com a internet. A aplicação precisa ser capaz de detectar e reagir a essa situação.

  * **Detecção:** Bibliotecas como a `@react-native-community/netinfo` permitem monitorar o status da conexão em tempo real.
  * **Feedback ao Usuário:** Uma boa prática é exibir um feedback visual não intrusivo, como um banner ou um toast, informando que o usuário está offline.
  * **Estratégia Avançada (Offline First):** Para aplicações que precisam de alta disponibilidade, o padrão *Offline First* consiste em armazenar os dados localmente (usando bancos de dados como o **WatermelonDB**) e sincronizá-los com o servidor apenas quando houver conexão.

**Exemplo de Componente de Status de Conexão:**

```tsx
import { useNetInfo } from '@react-native-community/netinfo';

const NetworkStatusIndicator = () => {
  const netInfo = useNetInfo();

  if (netInfo.isConnected === false) {
    return (
      <View style={styles.bannerError}>
        <Text style={styles.bannerText}>Você está offline. Verifique sua conexão.</Text>
      </View>
    );
  }

  return null; // Não exibe nada se estiver online
};
```

### Timeout de Requisição

Acontece quando uma requisição para a API demora mais do que o esperado para responder. Em vez de deixar o usuário esperando indefinidamente, configuramos um tempo limite.

  * **Implementação:** Bibliotecas como o **axios** permitem configurar um `timeout` global ou por requisição. Se o tempo for excedido, a promise da requisição é rejeitada com um erro.

<!-- end list -->

```ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 10000, // 10 segundos
});
```

### Códigos de Status HTTP (4xx e 5xx)

Quando a API responde, ela inclui um código de status que informa o resultado da operação.

  * **Erros do Cliente (4xx):** Indicam que houve um problema com a requisição enviada pelo cliente.
      * `401 Unauthorized`: O usuário não está autenticado. Geralmente, dispara um fluxo de logout.
      * `403 Forbidden`: O usuário está autenticado, mas não tem permissão para acessar o recurso.
      * `404 Not Found`: O recurso solicitado não existe.
  * **Erros do Servidor (5xx):** Indicam que algo deu errado no servidor. O cliente não pode resolver isso, e a única ação possível é tentar novamente mais tarde.

## 2\. Estratégias e Ferramentas para Tratamento de Erros

### `try...catch`: A Base de Tudo

Para qualquer operação assíncrona, o bloco `try...catch` é a forma fundamental de capturar exceções em JavaScript. Toda chamada de API deve estar envolvida por ele.

```ts
const fetchUserData = async () => {
  try {
    const response = await api.get('/user/me');
    // ... lógica de sucesso
  } catch (error) {
    // ... lógica de erro
    console.error('Falha ao buscar dados do usuário:', error);
  }
};
```

### Centralizando a Lógica de Erros

Para evitar repetir a mesma lógica em todos os `catch` blocks, crie uma função utilitária que processa o erro e retorna uma mensagem amigável.

```ts
// utils/errorHandler.ts
export function handleApiError(error) {
  if (error.response) {
    // O servidor respondeu com um status de erro (4xx, 5xx)
    switch (error.response.status) {
      case 404:
        return 'Recurso não encontrado.';
      case 403:
        return 'Você não tem permissão para realizar esta ação.';
      default:
        return 'Ocorreu um erro inesperado. Tente novamente.';
    }
  } else if (error.code === 'ECONNABORTED') {
    // Erro de timeout do axios
    return 'A conexão demorou muito para responder.';
  }
  // Erro de rede ou outro
  return 'Falha de conexão. Verifique sua internet.';
}
```

### Integrando com Ferramentas de Fetching (React Query)

Bibliotecas como o **React Query** simplificam enormemente o tratamento de erros, fornecendo estados `isError` e `error` prontos para uso.

```tsx
import { useQuery } from '@tanstack/react-query';

function UserProfile({ userId }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUserById(userId),
  });

  if (isLoading) return <ActivityIndicator />;

  if (isError) {
    // Usa a função centralizada para obter uma mensagem amigável
    return <Text>{handleApiError(error)}</Text>;
  }

  return <Text>Nome: {data.name}</Text>;
}
```

## 3\. A Experiência do Usuário (UX) ao Lidar com Erros

Tão importante quanto a lógica técnica é a forma como o erro é comunicado ao usuário.

  * **Use Mensagens Claras e Amigáveis:** Evite exibir mensagens técnicas como `"Error: Request failed with status code 500"`. Em vez disso, use textos como `"Ops! Algo deu errado em nossos servidores. Por favor, tente novamente mais tarde."`
  * **Forneça Ações Claras:** Sempre que possível, dê ao usuário uma forma de reagir ao erro, como um botão de "Tentar Novamente".
  * **Use Feedback Visual Apropriado:** Erros que bloqueiam a tela devem ter um tratamento (ex: um componente de erro com um botão), enquanto falhas menores (como uma falha de rede) podem ser comunicadas com um toast ou um banner, sem interromper o fluxo do usuário.

## ✅ Conclusão

Um tratamento de erros eficaz é uma combinação de estratégias técnicas e um bom design de experiência do usuário. Uma aplicação robusta não é aquela que nunca falha, mas sim aquela que sabe **antecipar, capturar, comunicar e se recuperar de falhas** de forma elegante e intuitiva. Ao prever os diferentes cenários de erro, você constrói um produto mais confiável e profissional.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/017-forms.md) 👉

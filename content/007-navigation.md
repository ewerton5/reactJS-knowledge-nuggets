###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/006-design-system.md)

# 📘 Pílula de Conhecimento 07 — Navegação em React: Web vs. Mobile

A navegação é o esqueleto de qualquer aplicação com múltiplas telas. No universo React, duas bibliotecas se destacam como padrões de mercado para gerenciar o fluxo do usuário: a **`react-router-dom`** para a web e a **`react-navigation`** para o React Native. Embora compartilhem conceitos, suas implementações e filosofias são adaptadas para as particularidades de cada plataforma.

---

## 🌐 Navegação para Web com `react-router-dom`

A `react-router-dom` é a biblioteca mais utilizada para criar rotas em aplicações web com React. Ela sincroniza a UI da sua aplicação com a URL do navegador, permitindo criar uma experiência de Single-Page Application (SPA) fluida e navegável.

### Estrutura Fundamental

A estrutura básica envolve um componente "roteador" (`BrowserRouter`) que envolve toda a aplicação, um container de rotas (`Routes`) e as rotas individuais (`Route`).

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ContactDetails from './pages/ContactDetails';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* Rota com parâmetro dinâmico (:contactId) */}
        <Route path="/contacts/:contactId" element={<ContactDetails />} />
      </Routes>
    </BrowserRouter>
  );
}
```

* **`path`**: Define o caminho na URL que ativará a rota.
* **`element`**: O componente React que será renderizado para aquele caminho.

### Hooks Essenciais

* **`useNavigate`**: Permite navegar programaticamente entre as rotas.
    ```tsx
    import { useNavigate } from 'react-router-dom';

    const navigate = useNavigate();
    // Navega para a home
    navigate('/');
    // Navega para um contato específico
    navigate('/contacts/123');
    ```
* **`useParams`**: Permite acessar os parâmetros dinâmicos da URL (definidos com `:` no `path`).
    ```tsx
    import { useParams } from 'react-router-dom';

    function ContactDetails() {
      // Se a URL for /contacts/123, contactId será "123"
      const { contactId } = useParams();
      return <Text>Detalhes do Contato: {contactId}</Text>;
    }
    ```
* **`useLocation`**: Fornece um objeto com informações detalhadas sobre a localização atual (URL), como `pathname`, `search` (query params) e `state`.

---

## 📱 Navegação para Mobile com `react-navigation`

No React Native, a `react-navigation` é a solução completa e definitiva. Ela foi construída pensando nas interações e padrões de UI nativos de iOS e Android.

### Tipos de Navegadores

A biblioteca oferece diferentes "sabores" de navegadores, que podem ser combinados para criar qualquer fluxo de navegação:

1.  **Stack Navigator (`createNativeStackNavigator`)**: A base de tudo. Funciona como uma **pilha de cartas de baralho**. Cada nova tela é uma "carta" colocada no topo da pilha. Ao voltar, a carta do topo é removida, revelando a anterior.
2.  **Tab Navigator (`createBottomTabNavigator`)**: Cria uma barra de abas na parte inferior da tela, permitindo a navegação lateral entre um conjunto fixo de telas principais.
3.  **Drawer Navigator (`createDrawerNavigator`)**: Cria um menu lateral deslizante (gaveta), comum para acessar seções como "Configurações" ou "Perfil".

### Estrutura Básica (Stack Navigator)

A estrutura é semelhante à do `react-router-dom`, mas com componentes específicos para o ambiente nativo.

```tsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{ headerShown: false, animation: 'slide_from_right' }}
          initialParams={{ itemId: 0 }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

* **`name`**: O identificador único da rota. É uma boa prática armazenar esses nomes em um arquivo de constantes para evitar erros de digitação.
* **`component`**: O componente da tela.
* **`options`**: Um objeto para customizar a aparência e o comportamento da tela (cabeçalho, gestos, animações, etc.).
* **`initialParams`**: Parâmetros padrão para a tela.

### Hooks Essenciais e Passagem de Parâmetros

* **`useNavigation`**: Fornece o objeto `navigation`, que contém os métodos para navegar (`.navigate()`, `.goBack()`, `.setOptions()`, etc.).
* **`useRoute`**: Fornece o objeto `route`, que contém as informações da rota atual, incluindo os parâmetros (`route.params`).

**Exemplo Prático:**

```tsx
// Tela de Home
import { useNavigation } from '@react-navigation/native';

function HomeScreen() {
  const navigation = useNavigation();

  return (
    <Button
      title="Ir para Detalhes"
      onPress={() => {
        // Navega para a tela 'Details' e passa um objeto de parâmetros
        navigation.navigate('Details', { itemId: 86, otherParam: 'react' });
      }}
    />
  );
}

// Tela de Detalhes
import { useRoute } from '@react-navigation/native';

function DetailsScreen() {
  const route = useRoute();
  // Acessa os parâmetros passados
  const { itemId, otherParam } = route.params;

  return <Text>Detalhes do Item: {itemId}</Text>;
}
```

### Navegação Aninhada e Complexa

É possível aninhar navegadores (ex: uma tela de um Stack ser um Tab Navigator). Para navegar para uma tela específica dentro de um navegador aninhado, a sintaxe é um pouco diferente:

```tsx
// Navega para a tela 'Profile' que está dentro do Tab Navigator 'MainTabs'
navigation.navigate('MainTabs', {
  screen: 'Profile',
  params: { userId: '123' },
});
```
Isso é útil para estruturas complexas ou quando há telas com o mesmo nome em diferentes navegadores.

---

## ✅ Conclusão

Embora ambos resolvam o problema de navegação, cada biblioteca é mestre em seu domínio.

* **`react-router-dom`** é otimizada para a **web**, integrando-se perfeitamente com as URLs do navegador e o histórico.
* **`react-navigation`** é otimizada para o **mobile**, fornecendo os blocos de construção (Stack, Tab, Drawer) e as animações nativas que os usuários de iOS e Android esperam.

Compreender a filosofia e os hooks principais de cada uma é fundamental para construir aplicações React coesas e intuitivas em qualquer plataforma.

👉 [Clique aqui para praticar com exercícios](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/exercises/007-navigation.md)

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/008-side-effects.md) 👉

### **Soluções dos exercícios: Pílula de Conhecimento 07 em Prática**

Esta série de encontros explorou as diferenças fundamentais entre navegação Web e Mobile. Embora o conceito seja o mesmo (ir de A para B), a implementação técnica e a gestão de estado da tela diferem drasticamente entre `react-router-dom` e `react-navigation`.

-----

#### **Exercício 1: Configuração de Rotas na Web**

**Objetivo:** Configurar o roteador básico com `react-router-dom`.

**Solução em Código:**

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      {/* Routes analisa a URL e escolhe qual componente renderizar */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/perfil" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**Principais Aprendizados:**

  * **URL como Verdade:** A navegação é estritamente atrelada à URL do navegador.
  * **Rota não encontrada:** Se a URL não der "match" com nenhum `path`, nada é renderizado (tela em branco), a menos que se configure uma rota *catch-all* (`*`).

-----

#### **Exercício 2: A Pilha de Navegação no Mobile**

**Objetivo:** Criar a estrutura de Stack Navigator com `react-navigation`.

**Solução em Código:**

```jsx
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* Telas definidas pelo NOME, não URL */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
```

**Principais Aprendizados:**

  * **Metáfora da Pilha:** A equipe entendeu que no mobile as telas são empilhadas. Ao navegar para `Profile`, a `Home` **continua montada na memória** (embaixo da pilha), preservando seu estado (como posição do scroll). Isso difere da Web, onde a tela anterior é geralmente desmontada.

-----

#### **Exercício 3: Navegação Programática (Web vs. Mobile)**

**Objetivo:** Usar os hooks corretos para navegar via código.

**Solução em Código:**

**A: Web (`useNavigate`)**

```jsx
import { useNavigate } from 'react-router-dom';

export function Home() {
  const navigate = useNavigate();
  // Passamos o CAMINHO da URL (string)
  return <button onClick={() => navigate('/perfil')}>Ir para Perfil</button>;
}
```

**B: Mobile (`useNavigation`)**

```jsx
import { useNavigation } from '@react-navigation/native';

export function HomeScreen() {
  const navigation = useNavigation();
  // Passamos o NOME da rota e chamamos um método do objeto
  return <Button title="Ir para Perfil" onPress={() => navigation.navigate('Profile')} />;
}
```

**Principais Aprendizados:**

  * **Sintaxe:** Na Web usa-se uma função direta (`Maps('/path')`). No Mobile, usa-se um método de um objeto (`navigation.navigate('Nome')`).

-----

#### **Exercício 4: Passagem e Leitura de Parâmetros**

**Objetivo:** Entender a diferença entre passar dados via URL (Web) e via Objeto/Memória (Mobile).

**Solução em Código:**

**A: Web (URL Params)**

```jsx
// 1. Rota: /produto/:id
// 2. Leitura com useParams
import { useParams } from 'react-router-dom';
export function Produto() {
  const { id } = useParams(); // 'id' é sempre STRING
  return <h1>ID: {id}</h1>;
}
```

**B: Mobile (Route Params)**

```jsx
// 1. Navegação: navigation.navigate('Produto', { id: 42, dados: {...} })
// 2. Leitura com useRoute
import { useRoute } from '@react-navigation/native';
export function ProdutoScreen() {
  const route = useRoute();
  const { id } = route.params; // 'id' mantém o tipo (Number, Object, etc)
  return <Text>ID: {id}</Text>;
}
```

**Principais Aprendizados:**

  * **Tipagem e Complexidade:** Na Web, tudo vira string na URL. No Mobile, é possível passar objetos complexos inteiros via memória, mantendo os tipos de dados.

-----

#### **Exercício 5: Customizando a Rota (Mobile Only)**

**Objetivo:** Configurar o cabeçalho nativo via props e entender a diferença para a Web.

**Solução em Código:**

```jsx
<Stack.Screen 
  name="Profile" 
  component={ProfileScreen} 
  // A prop 'options' controla a "moldura" da tela
  options={{
    title: 'Meu Perfil', // Muda o título padrão
    headerShown: false   // Esconde a barra superior nativa
  }}
/>
```

**Principais Aprendizados:**

  * **Quem manda no Header?** A discussão final esclareceu que a configuração fica no `Navigator` (o pai) e não na tela, porque o Navigator gerencia a "moldura" (safe area, header, tabs). Se a tela tentasse renderizar seu próprio header, haveria duplicação ou perda de contexto da biblioteca.
  * **Web não tem "Header Padrão":** Na Web, não existe essa prop `options`. Para mudar o título da aba, usa-se `document.title` (via `useEffect`). Para esconder um menu de navegação em certas rotas, usa-se renderização condicional baseada no `useLocation` (como sugerido por Gean).

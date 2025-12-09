## 🚀 **Oficina Prática: Navegando na Web e no Mobile**

Olá, equipe\! A pílula de hoje nos mostrou que, embora o conceito de "ir de uma tela para outra" seja universal, a implementação muda drasticamente entre Web e Mobile. Vamos praticar essas diferenças.

### **Instruções de Setup:**

1.  Para os exercícios **Web**, imaginem (ou configurem) um ambiente com `react-router-dom`.
2.  Para os exercícios **Mobile**, imaginem (ou configurem) um ambiente React Native com `@react-navigation/native` e `@react-navigation/native-stack`.

-----

### **🌐 Exercício 1: Configuração de Rotas na Web (5 minutos)**

**Objetivo:** Configurar o roteador básico de uma SPA (Single Page Application).

**Tarefa:** Escreva o componente `AppRoutes` usando `react-router-dom`.

1.  Ele deve ter duas rotas:
      * `/` que renderiza o componente `<Home />`.
      * `/perfil` que renderiza o componente `<Profile />`.
2.  Não esqueça dos componentes que envolvem as rotas (`BrowserRouter`, `Routes`).

<!-- end list -->

```jsx
// AppRoutes.jsx
import { /* o que importar? */ } from 'react-router-dom';
import Home from './Home';
import Profile from './Profile';

export default function AppRoutes() {
  return (
    // Escreva a estrutura aqui
  );
}
```

**Pontos para discussão:**

  * Se o usuário digitar uma URL que não existe (ex: `/banana`), o que essa estrutura renderiza por padrão?
  * Qual a função do componente `Routes` (antigo `Switch`)?

-----

### **📱 Exercício 2: A Pilha de Navegação no Mobile (5 minutos)**

**Objetivo:** Criar a estrutura equivalente ao exercício anterior, mas usando a metáfora de "Pilha" (Stack) do Mobile.

**Tarefa:** Escreva o componente `AppNavigator` usando `react-navigation`.

1.  Crie um `NativeStackNavigator`.
2.  Defina duas telas na pilha: "Home" e "Profile".
3.  Envolva tudo no container necessário para a navegação funcionar.

<!-- end list -->

```jsx
// AppNavigator.js
import { /* imports do container */ } from '@react-navigation/native';
import { /* imports da stack */ } from '@react-navigation/native-stack';
import HomeScreen from './HomeScreen';
import ProfileScreen from './ProfileScreen';

// Crie a Stack aqui

export default function AppNavigator() {
  return (
    // Escreva a estrutura aqui
  );
}
```

**Pontos para discussão:**

  * No exercício 1 (Web), as rotas são baseadas na URL. No exercício 2 (Mobile), em que elas são baseadas?
  * O que acontece com a tela `HomeScreen` quando navegamos para `ProfileScreen`? Ela é desmontada ou fica em memória?

-----

### **👉 Exercício 3: Navegação Programática (Web vs. Mobile) (10 minutos)**

**Objetivo:** Implementar um botão que leva o usuário da Home para o Perfil, contrastando os hooks de cada plataforma.

**Tarefa A (Web):** Dentro do componente `Home`, crie um botão que, ao ser clicado, navega para `/perfil` usando o hook `useNavigate`.

**Tarefa B (Mobile):** Dentro do componente `HomeScreen`, crie um botão que, ao ser clicado, navega para a rota `'Profile'` usando o hook `useNavigation`.

```jsx
// A: Web (Home.jsx)
import { /* hook? */ } from 'react-router-dom';

export function Home() {
  // Instancie o hook
  return <button onClick={/* Navegue para '/perfil' */}>Ir para Perfil</button>;
}

// B: Mobile (HomeScreen.js)
import { /* hook? */ } from '@react-navigation/native';
import { Button } from 'react-native';

export function HomeScreen() {
  // Instancie o hook
  return <Button title="Ir para Perfil" onPress={/* Navegue para 'Profile' */} />;
}
```

**Pontos para discussão:**

  * Qual a diferença sintática entre chamar a navegação na Web (`funcao('/caminho')`) e no Mobile (`objeto.metodo('Nome')`)?

-----

### **📦 Exercício 4: Passagem e Leitura de Parâmetros (15 minutos)**

**Objetivo:** Entender a diferença crítica entre passar dados via URL (Web) e via Objeto/Memória (Mobile).

**Cenário:** Queremos abrir os detalhes de um produto com ID `42`.

**Tarefa A (Web - Definição e Leitura):**

1.  Como você alteraria a definição da rota no `AppRoutes` para aceitar um ID dinâmico? (ex: `/produto/:id`).
2.  No componente `Produto`, use o hook `useParams` para ler esse ID e exibi-lo.

**Tarefa B (Mobile - Passagem e Leitura):**

1.  No `HomeScreen` (Mobile), como você altera a função `.navigate` para passar o ID `42` junto com a navegação?
2.  No `ProdutoScreen` (Mobile), use o hook `useRoute` para ler esse ID e exibi-lo.

<!-- end list -->

```jsx
// A: Web (Produto.jsx)
import { /* hook? */ } from 'react-router-dom';

export function Produto() {
  // Leia o ID da URL
  return <h1>Produto ID: {/* exiba aqui */}</h1>;
}

// B: Mobile (ProdutoScreen.js)
import { /* hook? */ } from '@react-navigation/native';
import { Text } from 'react-native';

export function ProdutoScreen() {
  // Leia o ID dos params da rota
  return <Text>Produto ID: {/* exiba aqui */}</Text>;
}
```

**Pontos para discussão:**

  * Na Web, se eu passar o parâmetro na URL (`/produto/42`), o tipo de dado que recebo no `useParams` é `number` ou `string`?
  * No Mobile, eu posso passar um objeto complexo (ex: `{ id: 42, dados: { nome: 'Tênis' } }`) como parâmetro? Isso seria possível na URL da Web da mesma forma?

-----

### **⚙️ Exercício 5: Customizando a Rota (Mobile Only) (5 minutos)**

**Objetivo:** Praticar a configuração via props, algo muito forte na biblioteca mobile.

**Tarefa:** No seu `AppNavigator` (Mobile), configure a tela de `Profile` para que:

1.  O título no cabeçalho seja "Meu Perfil" (em vez de "Profile").
2.  O cabeçalho não seja exibido (headerShown: false).

<!-- end list -->

```jsx
<Stack.Screen 
  name="Profile" 
  component={ProfileScreen} 
  // Adicione a prop options aqui
/>
```

**Pontos para discussão:**

  * Por que essa configuração fica no "Roteador" (Navigator) e não dentro do componente da tela?
  * Na Web (`react-router-dom`), como faríamos para mudar o título da aba do navegador ou esconder um menu ao entrar em uma rota específica? (Dica: é a mesma lógica ou precisamos de uma abordagem diferente?)

👉 [Clique aqui para ver as soluções dos exercícios](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/solutions/007-navigation.md)

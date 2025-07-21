###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/024-react-native-utilities-part-1.md)

# 📘 Pílula de Conhecimento 25 — Utilidades do React Native (Parte 2)

Continuando nossa exploração das ferramentas nativas do React Native, esta pílula aborda mais um conjunto de APIs e hooks que são essenciais para criar aplicações ricas, interativas e bem integradas ao sistema operacional.

## `Appearance` e `useColorScheme`

A API **`Appearance`** permite que seu aplicativo detecte as preferências de tema do usuário no nível do sistema operacional (ex: Modo Claro ou Escuro). A forma moderna de utilizá-la é através do hook **`useColorScheme`**.

  * **Caso de Uso:** Sincronizar automaticamente o tema da sua aplicação com o tema do dispositivo do usuário, proporcionando uma experiência mais nativa e consistente.

**Exemplo:**

```tsx
import { useColorScheme, Text, StyleSheet } from 'react-native';

const ThemedText = ({ children }) => {
  // O hook retorna 'light', 'dark' ou null
  const colorScheme = useColorScheme();

  const styles = StyleSheet.create({
    text: {
      color: colorScheme === 'dark' ? '#FFFFFF' : '#000000',
    },
  });

  return <Text style={styles.text}>{children}</Text>;
};
```

-----

## `useIsFocused` (do React Navigation)

Um hook booleano simples que retorna `true` se a tela em que ele é usado estiver atualmente em foco, e `false` caso contrário.

  * **Caso de Uso:** Ótimo para renderizações condicionais simples. Por exemplo, mudar o estilo de um ícone na barra de abas ou iniciar/parar uma animação apenas quando a tela estiver visível.
  * **Diferença para `useFocusEffect`:** Use `useIsFocused` para lógicas de renderização. Use `useFocusEffect` para executar efeitos colaterais (como chamadas de API).

**Exemplo:**

```tsx
import { useIsFocused } from '@react-navigation/native';

const ScreenStatus = () => {
  const isFocused = useIsFocused();

  return (
    <Text style={{ color: isFocused ? 'green' : 'gray' }}>
      {isFocused ? 'Esta tela está em foco!' : 'Esta tela não está em foco.'}
    </Text>
  );
};
```

-----

## `Linking`

Uma API poderosa para interagir com links, tanto de entrada quanto de saída. Permite que seu aplicativo abra URLs em outras aplicações e também responda a deep links.

  * **Caso de Uso:**
      * Abrir um website no navegador (`https://...`).
      * Iniciar uma chamada telefônica (`tel:...`).
      * Abrir o cliente de e-mail (`mailto:...`).
      * Abrir outras aplicações, como o WhatsApp.
      * Responder a deep links para navegar dentro do seu próprio app.

**Exemplo:**

```tsx
import { Linking, Button } from 'react-native';

const ContactButtons = () => {
  const openWebsite = () => Linking.openURL('https://reactnative.dev');
  const sendEmail = () => Linking.openURL('mailto:support@example.com');
  const makeCall = () => Linking.openURL('tel:+123456789');

  return (
    <View>
      <Button title="Visitar Site" onPress={openWebsite} />
      <Button title="Enviar E-mail" onPress={sendEmail} />
      <Button title="Ligar para Suporte" onPress={makeCall} />
    </View>
  );
};
```

-----

## `DeviceEventEmitter` (Depreciado)

Esta era uma API usada para criar um sistema de eventos global (um "event bus") dentro do JavaScript, permitindo que diferentes partes do aplicativo se comunicassem sem estarem diretamente conectadas.

  * **Status Atual:** Esta API é considerada legada e seu uso não é mais recomendado.
  * **Alternativas Modernas:** Para comunicação entre componentes desacoplados, a abordagem moderna é utilizar uma **biblioteca de gerenciamento de estado** (como Zustand, Redux ou Context API) ou uma biblioteca dedicada de eventos como a `eventemitter3`.

-----

## `LogBox`

Permite controlar as caixas de aviso (amarelas) e de erro (vermelhas) que aparecem durante o desenvolvimento.

  * **Caso de Uso:** Ocasionalmente, uma biblioteca de terceiros pode gerar avisos que você não pode corrigir. O `LogBox` permite ignorar avisos específicos para limpar sua tela durante o desenvolvimento. Use com moderação.

**Exemplo:**

```ts
import { LogBox } from 'react-native';

// Ignora um aviso específico que começa com o texto fornecido
LogBox.ignoreLogs([
  'Warning: Non-serializable values were found in the navigation state.',
]);

// Ignora todos os logs (não recomendado, exceto para demos)
// LogBox.ignoreAllLogs(true);
```

-----

## `Alert`

Uma API simples para exibir um diálogo de alerta nativo do sistema operacional.

  * **Caso de Uso:** Pedir confirmação do usuário para uma ação destrutiva (ex: "Tem certeza que deseja excluir este item?"), ou para informar sobre um sucesso ou erro.

**Exemplo:**

```tsx
import { Alert, Button } from 'react-native';

const DeleteButton = () => {
  const showConfirmDialog = () => {
    return Alert.alert(
      'Confirmar Exclusão',
      'Você tem certeza que deseja excluir este item?',
      [
        // Botão "Não"
        { text: 'Cancelar', style: 'cancel' },
        // Botão "Sim"
        { text: 'Sim, Excluir', onPress: () => console.log('Item excluído!') },
      ]
    );
  };

  return <Button title="Excluir" color="red" onPress={showConfirmDialog} />;
};
```

-----

## `DevSettings`

Permite interagir e adicionar itens ao menu de desenvolvedor do React Native (o menu que abre ao agitar o dispositivo ou usar atalhos de teclado).

  * **Caso de Uso:** Adicionar um botão customizado ao menu de dev para executar ações rápidas, como "Limpar AsyncStorage", "Fazer Logout" ou "Ir para Tela de Debug", agilizando o processo de desenvolvimento e teste.

**Exemplo:**

```ts
import { DevSettings } from 'react-native';

// Adiciona um novo item ao menu de desenvolvedor
DevSettings.addMenuItem('Limpar Dados Locais', () => {
  AsyncStorage.clear();
  alert('AsyncStorage foi limpo!');
});
```

## ✅ Conclusão

Este segundo conjunto de utilidades demonstra ainda mais a profundidade da integração do React Native com as plataformas nativas. Saber como usar essas APIs permite criar aplicativos que não só parecem nativos, mas também se comportam como tal, reagindo ao estado do sistema, interagindo com outras aplicações e fornecendo ferramentas de depuração poderosas para o desenvolvedor.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/026-regex.md) 👉

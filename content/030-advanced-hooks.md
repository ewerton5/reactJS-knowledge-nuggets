###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/029-promise.md)

# 📘 Pílula de Conhecimento 30 — Hooks e APIs Avançadas do React

Além dos hooks do dia a dia como `useState` e `useEffect`, o React oferece um conjunto de ferramentas mais avançadas, projetadas para resolver problemas específicos de performance, depuração e manipulação imperativa de componentes. Usá-los corretamente pode otimizar significativamente sua aplicação.

## `useDebugValue`

Este hook permite adicionar uma "etiqueta" customizada a um hook customizado, que será exibida no React DevTools.

  * **Para que serve?** Facilita a depuração de hooks customizados complexos, permitindo que você inspecione seu estado interno de forma mais clara no DevTools.
  * **Quando usar?** Apenas em hooks customizados que são compartilhados por várias partes da aplicação. Não há benefício em usá-lo dentro de componentes normais.

**Exemplo:**

```tsx
import { useState, useDebugValue } from 'react';

// Um hook customizado que rastreia o status da conexão
function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(true);

  // ... lógica para escutar eventos de online/offline ...

  // Adiciona uma etiqueta no React DevTools para este hook
  useDebugValue(isOnline ? 'Online' : 'Offline');

  return isOnline;
}
```

-----

## `React.memo`

`React.memo` é um **Higher-Order Component (HOC)**, não um hook. Ele "memoiza" seu componente, o que significa que o React irá pular a re-renderização dele se suas `props` não tiverem mudado.

  * **Para que serve?** É uma poderosa ferramenta de otimização de performance.
  * **Quando usar?** Ideal para componentes que:
    1.  Renderizam com frequência.
    2.  Recebem as mesmas `props` na maioria das vezes.
    3.  São "pesados" para renderizar.
    <!-- end list -->
      * Um caso de uso clássico são os itens de uma lista longa e virtualizada (`FlatList`).

**Exemplo:**

```tsx
import React, { memo } from 'react';

// O componente ListItem só será re-renderizado se a prop `item` mudar.
const ListItem = memo(({ item }) => {
  console.log(`Renderizando item: ${item.name}`);
  return <Text>{item.name}</Text>;
});

const ParentComponent = () => {
  const [count, setCount] = useState(0);
  const listData = [{ id: 1, name: 'Item Fixo' }];

  return (
    <View>
      {/* Clicar neste botão re-renderiza ParentComponent, mas não o ListItem,
          porque suas props não mudaram. */}
      <Button title={`Contador: ${count}`} onPress={() => setCount(c => c + 1)} />
      <ListItem item={listData[0]} />
    </View>
  );
};
```

-----

## `useLayoutEffect` vs. `useEffect`

Ambos os hooks servem para executar "efeitos colaterais", mas a grande diferença está no **momento** em que eles rodam.

  * **`useEffect` (O Padrão):** Roda **assincronamente**, **depois** que o React renderiza as mudanças na tela. Ele não bloqueia o navegador. Esta é a escolha para 99% dos casos, como chamadas de API.

  * **`useLayoutEffect` (O Síncrono):** Roda **sincronamente**, **depois** que o React calcula as mudanças no DOM, mas **antes** que o navegador pinte a tela. Ele **bloqueia** a renderização.

  * **Quando usar `useLayoutEffect`?** Use-o apenas quando você precisar ler alguma informação de layout do DOM (como o tamanho ou a posição de um elemento) e, em seguida, fazer uma alteração no estado que precisa ser refletida visualmente antes que o usuário veja a tela. Isso previne um "flicker" (piscar) visual.

**Exemplo: Posicionar um Tooltip**

```tsx
import React, { useState, useLayoutEffect, useRef } from 'react';

const Tooltip = () => {
  const buttonRef = useRef(null);
  const [tooltipHeight, setTooltipHeight] = useState(0);

  // Usamos useLayoutEffect para medir o botão antes da tela ser pintada
  useLayoutEffect(() => {
    if (buttonRef.current) {
      const { height } = buttonRef.current.getBoundingClientRect();
      setTooltipHeight(height); // Atualiza o estado SINCRONAMENTE
    }
  }, []);

  return (
    <>
      <Button ref={buttonRef} title="Passe o mouse aqui" />
      {/* O tooltip aparece acima do botão, usando a altura medida */}
      <View style={{ bottom: tooltipHeight + 5 }}>
        <Text>Eu sou um tooltip!</Text>
      </View>
    </>
  );
};
```

> **⚠️ Aviso de Performance:** Nunca coloque operações lentas ou assíncronas (como chamadas de API) dentro de `useLayoutEffect`, pois isso irá congelar a UI e piorar a experiência do usuário.

-----

## `forwardRef` e `useImperativeHandle`

Essas duas ferramentas trabalham em conjunto para permitir que componentes pais acessem e chamem métodos em componentes filhos de forma controlada.

  * **`forwardRef`**: Permite que um componente funcional receba uma `ref` e a "encaminhe" para um elemento DOM filho (como um `<TextInput>`).
  * **`useImperativeHandle`**: Permite que você customize o que é exposto através da `ref`. Em vez de expor o nó DOM inteiro, você pode expor um objeto com métodos específicos.

**Exemplo: Criando um Input Customizado com um Método `.clear()`**

```tsx
import React, { forwardRef, useImperativeHandle, useRef } from 'react';

// Define o que o pai poderá "ver" através da ref
export type CustomInputRef = {
  focusInput: () => void;
  clearInput: () => void;
};

// 1. Envolve o componente com forwardRef para receber a ref
const CustomInput = forwardRef<CustomInputRef, TextInputProps>((props, ref) => {
  const inputRef = useRef<TextInput>(null);

  // 2. Usa useImperativeHandle para expor métodos customizados
  useImperativeHandle(ref, () => ({
    focusInput: () => {
      inputRef.current?.focus();
    },
    clearInput: () => {
      inputRef.current?.clear();
    },
  }));

  return <TextInput ref={inputRef} {...props} />;
});

// Uso no componente pai
const ParentComponent = () => {
  const customInputRef = useRef<CustomInputRef>(null);

  return (
    <View>
      <CustomInput ref={customInputRef} />
      <Button
        title="Focar e Limpar"
        onPress={() => {
          // 3. Chama os métodos expostos pela ref
          customInputRef.current?.focusInput();
          setTimeout(() => customInputRef.current?.clearInput(), 1000);
        }}
      />
    </View>
  );
};
```

## ✅ Conclusão

Essas APIs e hooks avançados são ferramentas poderosas para cenários específicos.

  * **`useDebugValue`** para depurar hooks customizados.
  * **`React.memo`** para otimizar a performance de componentes.
  * **`useLayoutEffect`** para medições de DOM que precisam ocorrer antes da pintura da tela.
  * **`forwardRef`** e **`useImperativeHandle`** para criar APIs imperativas controladas para seus componentes.

Saber quando (e, mais importante, quando **não**) usá-los é uma marca de um desenvolvedor React experiente, capaz de escrever código não apenas funcional, mas também performático e de fácil manutenção.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/031-lodash.md) 👉

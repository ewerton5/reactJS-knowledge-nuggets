###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/013-code-standardization.md)

# 📘 Pílula de Conhecimento 14 — Testes Automatizados em React

Testes automatizados são scripts que verificam se o seu código funciona como o esperado. Em vez de testar manualmente cada funcionalidade a cada nova alteração, escrevemos testes que podem ser executados automaticamente, garantindo que novas implementações não quebrem o que já existia (prevenindo "regressões").

Uma boa estratégia de testes aumenta a confiança no código, facilita a refatoração e é um pilar para a construção de aplicações robustas e de alta qualidade.

## 1\. A Base: Testes Unitários e de Integração

Esses testes focam em partes menores da aplicação (um componente, uma função) e são executados em um ambiente simulado via terminal. São rápidos, baratos de escrever e devem compor a maior parte da sua suíte de testes.

As ferramentas padrão no ecossistema React são:

  * **Jest:** Um "test runner" (executor de testes) completo. Ele fornece o ambiente para rodar os testes, a estrutura para escrevê-los (`describe`, `it`, `test`) e as funções para fazer asserções (`expect`).
  * **React Testing Library:** Uma biblioteca que te ajuda a testar seus componentes da mesma forma que um usuário os utilizaria. A filosofia é: "Teste o comportamento, não a implementação".

### Estrutura de um Teste com Jest e Testing Library

1.  **Renderizar:** Renderiza o componente em um ambiente de teste.
2.  **Buscar:** Encontra elementos na tela (por texto, por `testID`, etc.).
3.  **Interagir:** Simula ações do usuário, como clicar em um botão (`fireEvent.press`).
4.  **Verificar (Assert):** Checa se o resultado da interação é o esperado.

**Exemplo: Testando um componente de Contador**

```tsx
// Counter.tsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';

export function Counter() {
  const [count, setCount] = useState(0);
  return (
    <View>
      <Text testID="count-text">Contagem: {count}</Text>
      <Button title="+1" onPress={() => setCount(count + 1)} />
    </View>
  );
}

// Counter.test.tsx
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Counter } from './Counter';

describe('Componente Counter', () => {
  it('deve renderizar com a contagem inicial de 0', () => {
    // 1. Renderiza o componente
    const { getByTestId } = render(<Counter />);
    // 2. Busca o elemento pelo testID
    const countText = getByTestId('count-text');
    // 4. Verifica se o texto inicial está correto
    expect(countText.props.children).toBe('Contagem: 0');
  });

  it('deve incrementar a contagem ao clicar no botão', () => {
    const { getByTestId, getByText } = render(<Counter />);
    // 2. Busca o botão pelo texto
    const incrementButton = getByText('+1');
    // 3. Simula o clique do usuário
    fireEvent.press(incrementButton);
    // 2. Busca o texto da contagem novamente
    const countText = getByTestId('count-text');
    // 4. Verifica se a contagem foi atualizada para 1
    expect(countText.props.children).toBe('Contagem: 1');
  });
});
```

> **Mocking:** Como o Jest roda no terminal (ambiente Node.js), ele não tem acesso a APIs nativas do celular (câmera, GPS, etc.). Para testar componentes que usam essas APIs, precisamos "mocar" (simular) o comportamento delas usando `jest.mock()`.

-----

## 2\. Testando o Fluxo Completo: End-to-End (E2E)

Testes E2E simulam uma jornada completa do usuário na aplicação real. Eles são mais lentos e complexos que os testes unitários, mas são essenciais para validar os fluxos críticos (login, cadastro, compra, etc.).

### Para Web: Cypress

O **Cypress** é a ferramenta padrão para testes E2E em aplicações web. Ele abre uma instância real do navegador e executa os comandos que você escreve, como visitar uma página, preencher formulários e clicar em botões.

**Exemplo Conceitual de Teste de Login com Cypress:**

```javascript
// cypress/e2e/login.cy.js
describe('Fluxo de Login', () => {
  it('deve permitir que o usuário faça login com credenciais válidas', () => {
    // 1. Visita a página de login
    cy.visit('/login');
    // 2. Encontra o campo de e-mail e digita
    cy.get('[data-testid="email-input"]').type('usuario@teste.com');
    // 3. Encontra o campo de senha e digita
    cy.get('[data-testid="password-input"]').type('senha123');
    // 4. Clica no botão de login
    cy.get('[data-testid="login-button"]').click();
    // 5. Verifica se foi redirecionado para a dashboard
    cy.url().should('include', '/dashboard');
    cy.contains('Bem-vindo').should('be.visible');
  });
});
```

### Para Mobile: Detox

O **Detox** é o equivalente do Cypress para o React Native. Ele instala e controla sua aplicação em um emulador (Android) ou simulador (iOS) real, executando ações nativas como toques, scrolls e gestos.

**Exemplo Conceitual de Teste de Login com Detox:**

```javascript
// e2e/login.test.js
describe('Fluxo de Login', () => {
  it('deve permitir que o usuário faça login com credenciais válidas', async () => {
    // 1. Encontra o campo de e-mail pelo testID e digita
    await element(by.id('email-input')).typeText('usuario@teste.com');
    // 2. Encontra o campo de senha e digita
    await element(by.id('password-input')).typeText('senha123');
    // 3. Encontra o botão de login e toca nele
    await element(by.id('login-button')).tap();
    // 4. Verifica se o texto de boas-vindas está visível na próxima tela
    await expect(element(by.text('Bem-vindo'))).toBeVisible();
  });
});
```

-----

## ✅ Conclusão

Uma estratégia de testes eficaz combina diferentes abordagens:

  * **Muitos testes unitários e de integração (Jest + Testing Library):** São rápidos, fáceis de manter e cobrem a lógica dos seus componentes em isolamento. Eles formam a base da pirâmide de testes.
  * **Poucos testes E2E (Cypress/Detox):** São mais lentos e frágeis, mas indispensáveis para garantir que os fluxos mais críticos da sua aplicação estão funcionando de ponta a ponta.

Começar a escrever testes pode parecer um esforço extra, mas o investimento se paga rapidamente ao proporcionar uma rede de segurança que permite desenvolver e evoluir a aplicação com muito mais velocidade e confiança.

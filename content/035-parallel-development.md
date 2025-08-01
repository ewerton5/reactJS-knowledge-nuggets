###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/034-ci-cd.md)

# 📘 Pílula de Conhecimento 35 — Desenvolvimento Paralelo com Mirage JS

Um dos maiores gargalos no desenvolvimento de software é a dependência entre as equipes de frontend e backend. Muitas vezes, o frontend precisa esperar a API ficar pronta para começar a trabalhar. O **Desenvolvimento Paralelo**, habilitado por ferramentas de mock de API como o **Mirage JS**, é um workflow que quebra essa dependência, permitindo que ambas as equipes trabalhem simultaneamente.

## O Fluxo de Desenvolvimento Paralelo (Passo a Passo)

### Passo 1: O Contrato da API - Planejamento é Tudo

Antes de qualquer linha de código, as equipes de frontend e backend se reúnem. Olhando para o design da tela (ex: no Figma), eles definem juntos o **"contrato" da API**: a estrutura exata dos dados que serão trocados.

**Exemplo de Contrato para uma tela de produtos:**

  - **Endpoint:** `GET /products`
  - **Resposta de Sucesso (200):** Um array de objetos de produto.
  - **Objeto `Product`:**
    ```json
    {
      "id": "uuid-string-123",
      "name": "Nome do Produto",
      "description": "Uma breve descrição do produto.",
      "imageUrl": "https://url.da/imagem.png"
    }
    ```

Este contrato é a **fonte única da verdade** para ambas as equipes.

### Passo 2: O Frontend Cria o Mundo Falso (Mock com Mirage JS)

Com o contrato em mãos, o desenvolvedor frontend implementa essa API no Mirage JS, criando um servidor mock que retorna dados falsos, mas com a estrutura **exatamente igual** à do contrato.

**`src/services/mirage/routes/product.ts`**

```ts
import { Server } from 'miragejs';
import { faker } from '@faker-js/faker';

export default function (server: Server) {
  // Intercepta a rota GET /products
  server.get('/products', () => {
    // Retorna uma lista de 10 produtos falsos gerados com o Faker
    return Array.from({ length: 10 }).map(() => ({
      id: faker.string.uuid(),
      name: faker.commerce.productName(),
      description: faker.commerce.productDescription(),
      imageUrl: faker.image.url(),
    }));
  });
}
```

### Passo 3: O Backend Constrói o Mundo Real (API)

Enquanto isso, o desenvolvedor backend trabalha na implementação da API real, seguindo rigorosamente o mesmo contrato definido no Passo 1.

### Passo 4: O Frontend Constrói a Tela (Integração com o Mock)

Com o Mirage ativo, o frontend pode desenvolver a feature completa como se a API real já existisse. Isso inclui a criação do estado (ex: um slice no Redux), a lógica de busca e a renderização dos componentes na tela.

**1. Criação do Slice no Redux (Exemplo):**

```ts
// src/store/slices/productSlice.ts
// ...criação do slice com estados para products, isLoading, error...
```

**2. Integração na Tela:**

```tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, Text, View, ActivityIndicator } from 'react-native';
import { fetchProductsRequest } from '../store/slices/productSlice';

const ProductsScreen = () => {
  const dispatch = useDispatch();
  // Seleciona os dados do slice, que estão sendo alimentados pelo Mirage
  const { products, isLoading } = useSelector(state => state.product);

  useEffect(() => {
    // Dispara a ação para buscar os produtos (o Mirage irá interceptar)
    dispatch(fetchProductsRequest());
  }, [dispatch]);

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View>
          <Text>{item.name}</Text>
          <Text>{item.description}</Text>
        </View>
      )}
    />
  );
};
```

### Passo 5: A "Virada de Chave" - Conectando com a API Real

Quando o backend finaliza a API, a integração é a parte mais simples do processo. O desenvolvedor frontend faz apenas uma alteração:

**`.env`**

```env
# Desativa o Mirage
REACT_APP_MIRAGE_ENABLED=false
```

Ao reiniciar o app, todas as requisições que antes eram interceptadas pelo Mirage agora passarão a bater na API real.

### Passo 6: Validação e Ajustes Finais

Se ambas as equipes seguiram o contrato à risca, a aplicação deve funcionar perfeitamente com a API real. Se houver alguma divergência (ex: o backend nomeou um campo como `title` em vez de `name`), o ajuste é mínimo. Basta corrigir a tipagem no frontend, e o TypeScript o guiará para os locais exatos que precisam de alteração.

## ✅ Conclusão

O Desenvolvimento Paralelo, suportado pelo Mirage JS e por um forte alinhamento inicial através de um **contrato de API**, é um workflow moderno que elimina gargalos e acelera a entrega de valor. Ele permite que a equipe de frontend construa e teste features completas, com lógica de estado e componentes de UI, de forma totalmente independente e simultânea ao trabalho do backend. O resultado é um ciclo de desenvolvimento mais rápido, colaborativo e eficiente.

###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/017-forms.md)

# 📘 Pílula de Conhecimento 18 — Estratégia Offline First em React Native

Uma aplicação **Offline First** é projetada para funcionar primariamente com dados locais, tratando a conexão com a internet como um meio para sincronização, e não como uma dependência para seu funcionamento básico. Essa abordagem arquitetural garante que o aplicativo seja rápido e funcional mesmo em condições de rede instáveis ou inexistentes, proporcionando uma experiência de usuário muito superior.

Essa estratégia é ideal para aplicativos onde o usuário interage principalmente com seus próprios dados e não necessita de colaboração em tempo real, como em aplicativos de vistoria, anotações ou tarefas.

## 1\. A Abordagem Simples: `AsyncStorage` como Cache

Uma forma básica de suportar o modo offline é usar o **`AsyncStorage`** (ou outra solução de armazenamento chave-valor) para guardar uma cópia dos dados obtidos da API.

  * **Fluxo de Funcionamento:**

    1.  **Online:** A aplicação busca os dados da API e salva uma cópia em JSON stringificado no `AsyncStorage`. A UI lê os dados da API.
    2.  **Offline:** Se não houver conexão, a aplicação lê os dados salvos no `AsyncStorage` para exibir na tela.
    3.  **Mutações (POST, PUT, DELETE):** As alterações feitas offline são salvas em uma "fila de sincronização" no `AsyncStorage`.
    4.  **De volta ao Online:** Ao detectar a conexão, a aplicação envia as alterações da fila para a API.

  * **Desvantagens:**

      * `AsyncStorage` não é um banco de dados. Ele não é otimizado para consultas complexas, relacionamentos ou grandes volumes de dados.
      * A lógica de sincronização e resolução de conflitos precisa ser totalmente implementada manualmente.
      * Para aplicações complexas, essa abordagem rapidamente se torna limitada e de difícil manutenção.

## 2\. A Abordagem Robusta: Bancos de Dados Locais com WatermelonDB

Para uma verdadeira experiência Offline First, a solução ideal é utilizar um banco de dados local projetado para aplicações front-end. O **WatermelonDB** é uma biblioteca poderosa para React Native que implementa um banco de dados reativo sobre o SQLite, otimizado para alta performance.

### Passo 1: Modelagem dos Dados

Assim como em um backend, você primeiro modela suas tabelas e relacionamentos.

**Exemplo de Modelo `Inspection`:**

```ts
// src/database/models/Inspection.ts
import { Model } from '@nozbe/watermelondb';
import { field, date, relation } from '@nozbe/watermelondb/decorators';

export default class Inspection extends Model {
  static table = 'inspections';

  // Define um relacionamento one-to-one com a tabela 'evaluations'
  @relation('evaluations', 'inspection_id') evaluation;

  @field('remote_id') remoteId;
  @date('created_at') createdAt;
}
```

### Passo 2: O Fluxo de Dados Offline First

1.  **Sincronização Inicial (Online):** Quando o app está online, ele busca os dados da sua API e os insere ("hidrata") no banco de dados local do WatermelonDB.
2.  **Operações no App (Online ou Offline):** Todas as operações de leitura, criação, atualização e exclusão (CRUD) são feitas **diretamente no banco de dados local**. A UI lê os dados do WatermelonDB e, por ser reativo, se atualiza instantaneamente. Isso torna o app extremamente rápido.
3.  **Sincronização de Retorno (Online):** Ao detectar que a conexão com a internet voltou, um processo de sincronização é iniciado, enviando todas as alterações locais (novos registros, atualizações, exclusões) para a sua API remota.

### Exemplo de Operações no Banco de Dados

Todas as operações que modificam o banco de dados devem ser envoltas em um `database.write()`.

```ts
import { database } from '../database';

// Criando um novo registro
const createOfflineInspection = async (data) => {
  await database.write(async () => {
    const newInspection = await database.get('inspections').create(inspection => {
      inspection.remoteId = data.id;
      // ... outros campos
    });
    return newInspection;
  });
};

// Atualizando um registro
const updateOfflineInspectionStatus = async (inspection, newStatus) => {
  await database.write(async () => {
    await inspection.update(i => {
      i.status = newStatus;
    });
  });
};

// Deletando um registro
const deleteOfflineInspection = async (inspection) => {
  await database.write(async () => {
    await inspection.destroyPermanently();
  });
};
```

### Desafio Avançado: Exclusão em Cascata

Um ponto importante em bancos de dados relacionais é a **exclusão em cascata**. Se você deleta um registro "pai" (ex: uma Vistoria), todos os registros "filhos" associados a ele (ex: Salas, Itens, Fotos) também devem ser deletados para não deixar "lixo" no banco. Em muitos casos, essa lógica precisa ser implementada manualmente na aplicação.

```ts
// Exemplo de lógica manual de cascata
const deleteInspectionCascade = async (inspection) => {
  await database.write(async () => {
    // Primeiro, deleta todos os filhos (ex: fotos, itens)
    const items = await inspection.items.fetch();
    await Promise.all(items.map(item => item.destroyPermanently()));

    // Por fim, deleta o registro pai
    await inspection.destroyPermanently();
  });
};
```

## ✅ Conclusão

A estratégia Offline First transforma a experiência do usuário, tornando a aplicação resiliente e performática independentemente da qualidade da conexão.

  * A abordagem com **`AsyncStorage`** é válida para caches simples, mas limitada para funcionalidades complexas.
  * O uso de um banco de dados local como o **WatermelonDB** é a solução profissional e escalável, que permite criar aplicações ricas e que funcionam perfeitamente offline.

Adotar o Offline First é uma decisão de arquitetura que deve ser planejada desde o início do projeto, mas o resultado é um produto final de qualidade e confiabilidade muito superiores.

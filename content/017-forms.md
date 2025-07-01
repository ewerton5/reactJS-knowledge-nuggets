###### 👈 [Voltar para pílula anterior](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/016-error-handling.md)

# 📘 Pílula de Conhecimento 17 — Gerenciamento de Formulários em React

Lidar com formulários em React — gerenciando o estado de cada campo, suas validações, mensagens de erro e o processo de submissão — pode se tornar complexo e repetitivo. Para resolver isso, utilizamos bibliotecas de gerenciamento de formulários, que abstraem essa complexidade e oferecem uma estrutura otimizada e declarativa.

As duas combinações mais populares no ecossistema são **Formik + Yup** e a mais moderna **React Hook Form + Zod**.

## 1\. A Abordagem Clássica: Formik + Yup

**Formik** é uma das bibliotecas mais estabelecidas para gerenciamento de formulários. **Yup** é uma biblioteca de validação de schemas que se integra perfeitamente com o Formik.

### Estrutura com `useFormik`

O hook `useFormik` é o ponto central. Você o configura com os valores iniciais, o schema de validação e a função de submissão.

**Exemplo de um Formulário de Login:**

```tsx
import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { TextInput, Button, Text } from 'react-native';

// 1. Defina o schema de validação com Yup
const loginValidationSchema = yup.object().shape({
  email: yup
    .string()
    .email('Por favor, insira um e-mail válido')
    .required('O e-mail é obrigatório'),
  password: yup
    .string()
    .min(6, 'A senha deve ter no mínimo 6 caracteres')
    .required('A senha é obrigatória'),
});

const LoginFormWithFormik = () => {
  // 2. Configure o useFormik
  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: loginValidationSchema,
    onSubmit: (values) => {
      // Esta função só é chamada se a validação passar
      alert(`Login com: ${values.email}`);
    },
  });

  return (
    <>
      <TextInput
        onChangeText={formik.handleChange('email')}
        onBlur={formik.handleBlur('email')}
        value={formik.values.email}
        placeholder="E-mail"
      />
      {formik.touched.email && formik.errors.email && (
        <Text style={{ color: 'red' }}>{formik.errors.email}</Text>
      )}

      <TextInput
        onChangeText={formik.handleChange('password')}
        onBlur={formik.handleBlur('password')}
        value={formik.values.password}
        placeholder="Senha"
        secureTextEntry
      />
      {formik.touched.password && formik.errors.password && (
        <Text style={{ color: 'red' }}>{formik.errors.password}</Text>
      )}

      <Button onPress={() => formik.handleSubmit()} title="Entrar" />
    </>
  );
};
```

  * `handleChange`: Atualiza o estado do campo correspondente.
  * `handleBlur`: Marca um campo como "tocado" (`touched`), permitindo exibir o erro apenas depois que o usuário interagiu com ele.
  * `handleSubmit`: Executa as validações e, se tudo estiver correto, chama sua função `onSubmit`.

> **Ponto de Atenção:** Um erro comum é digitar o nome de um campo errado no `initialValues` ou no schema de validação. Se os nomes não baterem perfeitamente, a validação falhará silenciosamente e o `onSubmit` nunca será executado.

-----

## 2\. A Abordagem Moderna: React Hook Form + Zod

**React Hook Form (RHF)** é uma biblioteca mais moderna, conhecida por sua alta performance (minimiza re-renderizações) e excelente integração com TypeScript. **Zod** é uma biblioteca de validação TypeScript-first que oferece uma sintaxe concisa e inferência de tipos.

### Estrutura com `useForm` e `<Controller>`

O hook `useForm` gerencia o formulário, e o componente `<Controller>` conecta os campos do formulário aos seus componentes de UI.

**Exemplo do mesmo Formulário de Login:**

```tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { TextInput, Button, Text } from 'react-native';

// 1. Defina o schema de validação com Zod
const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'O e-mail é obrigatório'),
  password: z.string().min(6, 'A senha precisa de no mínimo 6 caracteres'),
});

// Infere o tipo do formulário a partir do schema
type LoginFormValues = z.infer<typeof loginSchema>;

const LoginFormWithRHF = () => {
  // 2. Configure o useForm com o resolver do Zod
  const { control, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  // 3. Sua função de submissão
  const onSubmit = (data: LoginFormValues) => {
    alert(`Login com: ${data.email}`);
  };

  return (
    <>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="E-mail"
          />
        )}
      />
      {errors.email && <Text style={{ color: 'red' }}>{errors.email.message}</Text>}

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            placeholder="Senha"
            secureTextEntry
          />
        )}
      />
      {errors.password && <Text style={{ color: 'red' }}>{errors.password.message}</Text>}

      {/* 4. Envolve a função de submissão com o handleSubmit do RHF */}
      <Button onPress={handleSubmit(onSubmit)} title="Entrar" />
    </>
  );
};
```

  * `Controller`: Atua como uma ponte, passando as props `onChange`, `onBlur` e `value` para o seu componente de input.
  * `handleSubmit`: Uma função de ordem superior que primeiro executa a validação e, se for bem-sucedida, chama a sua função `onSubmit` com os dados do formulário.

-----

## 3\. Validações Customizadas

Às vezes, as regras prontas (`.email()`, `.min()`) não são suficientes. Tanto Yup quanto Zod permitem criar validações customizadas.

**Exemplo: Validação de CPF/CNPJ com Yup**

```ts
yup.string().test(
  'cpf-cnpj-validation',
  'CPF ou CNPJ inválido',
  (value) => {
    if (!value) return true; // Permite campo vazio (use .required() para obrigar)
    // Sua lógica customizada para validar CPF/CNPJ aqui
    return isCPF(value) || isCNPJ(value);
  }
);
```

## ✅ Conclusão

Bibliotecas de formulário são ferramentas essenciais para criar aplicações robustas e de fácil manutenção. Elas eliminam a necessidade de gerenciar múltiplos `useState`, estados de erro e lógica de validação manualmente.

  * **Formik + Yup:** Uma combinação sólida e amplamente adotada, com uma vasta comunidade.
  * **React Hook Form + Zod:** A escolha moderna, oferecendo melhor performance, uma API mais limpa e integração superior com TypeScript.

Para novos projetos, **React Hook Form + Zod** é geralmente a recomendação, mas ambas as abordagens são excelentes para construir formulários complexos de maneira organizada e eficiente.

###### [Avançar para próxima pílula](https://github.com/ewerton5/reactJS-knowledge-nuggets/blob/main/content/018-offline-first.md) 👉

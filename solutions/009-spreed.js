// exercício 1

const listaA = ["Maçã", "Banana"];
const listaB = ["Uva", "Melancia"];

const listaFinal = [...listaA, ...listaB];

console.log(listaFinal);

// exercício 2

let userState = {
  id: 101,
  name: "Caio",
  email: "caio@antigo.com",
  role: "Admin",
};

function updateEmail(newEmail) {
  userState = {
    ...userState,
    email: newEmail,
  };

  return userState;
}

const newState = updateEmail("caio@novo.com");
console.log(newState);

// exercício 3

const usuarioDoBanco = {
  id: 1,
  username: 'admin',
  senha: '123456_senha_secreta', // Remover
  token: 'xyz-token-auth',        // Remover
  email: 'admin@empresa.com',
  avatar: 'url-da-foto'
};

const { senha, token, ...usuarioSeguro} = usuarioDoBanco;


console.log(usuarioSeguro); 

// exercicio 4

import React from 'react';


function InputCustomizado({ label, ...propsDoInput }) {
  return (
    <div style={{ marginBottom: 10 }}>
      <label style={{ display: 'block', fontWeight: 'bold' }}>
        {label}
      </label>
      
      <input
        className="meu-input-padrao"
        {...propsDoInput}
      />
    </div>
  );
}

// exercício 5

const original = {
  nome: 'Projeto A',
  config: {
    tema: 'Escuro',
    ativo: true
  }
};

const copia = { ...original };

copia.nome = 'Projeto B';

copia.config.tema = 'Claro';

console.log('Original - Nome:', original.nome);
// antes de rodar: Projeto A
// depois de rodar: Projeto A
console.log('Original - Tema:', original.config.tema);
// antes de rodar: Escuro
// depois de rodar: Claro

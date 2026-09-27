import request from 'supertest';
import app from '../../src/app.js';

async function login(email, senha) {
  const resposta = await request(app).post('/api/auth/login').send({ email, senha });

  if (resposta.status !== 200) {
    throw new Error(`Login de "${email}" falhou com status ${resposta.status}: ${resposta.body.error}`);
  }

  return resposta.body;
}

export function credenciaisAdmin() {
  return { email: process.env.ADMIN_EMAIL, senha: process.env.ADMIN_SENHA };
}

export async function loginAdmin() {
  const { email, senha } = credenciaisAdmin();
  const { token } = await login(email, senha);
  return token;
}

export async function loginAluno({ email, senha }) {
  const { token, usuario } = await login(email, senha);
  return { token, alunoId: usuario.id };
}

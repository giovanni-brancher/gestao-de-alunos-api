import request from 'supertest';
import app from '../../src/app.js';

let contador = 0;

// O banco persiste entre execuções, então e-mail e matrícula ganham um sufixo único.
export function gerarAlunoUnico(base) {
  contador += 1;
  const sufixo = `${Date.now()}${contador}`;
  const [usuario, dominio] = base.email.split('@');

  return { ...base, email: `${usuario}.${sufixo}@${dominio}`, matricula: `${base.matricula}${sufixo}` };
}

export async function cadastrarAluno(tokenAdmin, base) {
  const aluno = gerarAlunoUnico(base);
  const resposta = await request(app)
    .post('/api/admin/alunos')
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send(aluno);

  if (resposta.status !== 201) {
    throw new Error(`Cadastro do aluno "${aluno.email}" falhou com status ${resposta.status}: ${resposta.body.error}`);
  }

  return { ...aluno, id: resposta.body.id };
}

export async function matricularAluno(tokenAdmin, alunoId, disciplinaId) {
  const resposta = await request(app)
    .post(`/api/admin/disciplinas/${disciplinaId}/matriculas`)
    .set('Authorization', `Bearer ${tokenAdmin}`)
    .send({ alunoId });

  if (resposta.status !== 201) {
    throw new Error(`Matrícula em "${disciplinaId}" falhou com status ${resposta.status}: ${resposta.body.error}`);
  }
}

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAdmin } from './helpers/auth.helper.js';
import { cadastrarAluno } from './helpers/alunos.helper.js';
import dados from './data/login-aluno.json' with { type: 'json' };

describe('POST /api/auth/login (aluno)', () => {
  let aluno;

  before(async () => {
    const tokenAdmin = await loginAdmin();
    aluno = await cadastrarAluno(tokenAdmin, dados.aluno);
  });

  dados.cenarios.forEach(({ descricao, sobrescreve, status, erro }) => {
    it(`deve retornar ${status} quando ${descricao}`, async () => {
      const resposta = await request(app)
        .post('/api/auth/login')
        .send({ email: aluno.email, senha: aluno.senha, ...sobrescreve });

      expect(resposta.status).to.equal(status);

      if (erro) {
        expect(resposta.body.error).to.equal(erro);
      } else {
        expect(resposta.body).to.have.property('token');
        expect(resposta.body.usuario).to.include({ id: aluno.id, email: aluno.email, role: 'aluno' });
      }
    });
  });
});

import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAdmin, loginAluno } from './helpers/auth.helper.js';
import { cadastrarAluno, gerarAlunoUnico } from './helpers/alunos.helper.js';
import dados from './data/alunos.json' with { type: 'json' };

describe('POST /api/admin/alunos', () => {
  const tokens = {};

  before(async () => {
    tokens.admin = await loginAdmin();
    const aluno = await cadastrarAluno(tokens.admin, dados.aluno);
    ({ token: tokens.aluno } = await loginAluno(aluno));
  });

  dados.cenarios.forEach(({ descricao, autenticacao, sobrescreve, status, erro }) => {
    it(`deve retornar ${status} quando ${descricao}`, async () => {
      const aluno = { ...gerarAlunoUnico(dados.aluno), ...sobrescreve };
      const requisicao = request(app).post('/api/admin/alunos');

      if (autenticacao !== 'nenhuma') {
        requisicao.set('Authorization', `Bearer ${tokens[autenticacao]}`);
      }

      const resposta = await requisicao.send(aluno);

      expect(resposta.status).to.equal(status);

      if (erro) {
        expect(resposta.body.error).to.equal(erro);
      } else {
        expect(resposta.body).to.include({ nome: aluno.nome, email: aluno.email, matricula: aluno.matricula });
        expect(resposta.body).to.have.property('id');
        expect(resposta.body).to.not.have.property('senha');
      }
    });
  });
});

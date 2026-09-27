import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { loginAdmin, loginAluno } from './helpers/auth.helper.js';
import { cadastrarAluno, matricularAluno } from './helpers/alunos.helper.js';
import dados from './data/trabalhos.json' with { type: 'json' };

describe('POST /api/alunos/:alunoId/trabalhos', () => {
  let aluno;
  let tokenAluno;

  before(async () => {
    const tokenAdmin = await loginAdmin();
    aluno = await cadastrarAluno(tokenAdmin, dados.aluno);
    await matricularAluno(tokenAdmin, aluno.id, dados.disciplinaMatriculada);
    ({ token: tokenAluno } = await loginAluno(aluno));
  });

  dados.cenarios.forEach(({ descricao, autenticacao, alunoAlvo, trabalho, status, erro }) => {
    it(`deve retornar ${status} quando ${descricao}`, async () => {
      const alunoId = alunoAlvo || aluno.id;
      const requisicao = request(app).post(`/api/alunos/${alunoId}/trabalhos`);

      if (autenticacao !== 'nenhuma') {
        requisicao.set('Authorization', `Bearer ${tokenAluno}`);
      }

      const resposta = await requisicao.send(trabalho);

      expect(resposta.status).to.equal(status);

      if (erro) {
        expect(resposta.body.error).to.equal(erro);
      } else {
        expect(resposta.body).to.include({ ...trabalho, alunoId: aluno.id, status: 'entregue' });
        expect(resposta.body).to.have.property('id');
      }
    });
  });
});

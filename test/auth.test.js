import request from 'supertest';
import { expect } from 'chai';
import app from '../src/app.js';
import { credenciaisAdmin } from './helpers/auth.helper.js';
import dados from './data/login-admin.json' with { type: 'json' };

describe('POST /api/auth/login', () => {
  dados.cenarios.forEach(({ descricao, sobrescreve, status, erro }) => {
    it(`deve retornar ${status} quando ${descricao}`, async () => {
      const resposta = await request(app)
        .post('/api/auth/login')
        .send({ ...credenciaisAdmin(), ...sobrescreve });

      expect(resposta.status).to.equal(status);

      if (erro) {
        expect(resposta.body.error).to.equal(erro);
      } else {
        expect(resposta.body).to.have.property('token');
        expect(resposta.body.usuario.role).to.equal('admin');
      }
    });
  });
});

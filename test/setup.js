import 'dotenv/config';
import mongoose from 'mongoose';

// O dotenv precisa carregar antes de qualquer import do app: o db.js conecta no momento do import.
const obrigatorias = ['MONGODB_URI', 'ADMIN_EMAIL', 'ADMIN_SENHA'];
const ausentes = obrigatorias.filter((nome) => !process.env[nome]);

if (ausentes.length > 0) {
  throw new Error(`Defina no .env ou no ambiente: ${ausentes.join(', ')} (veja o .env.example).`);
}

// Fecha a conexão uma única vez, depois de todos os arquivos de teste.
export const mochaHooks = {
  async afterAll() {
    await mongoose.connection.close();
  },
};

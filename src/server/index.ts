import express from 'express';
import ViteExpress from 'vite-express';
import roiRoutes from './Routes/apiroutes';

const app = express();

// Permite ler JSON no corpo das requisições
app.use(express.json());

// Conecta as rotas da nossa calculadora
app.use('/api', roiRoutes);

// Configuração da porta dinâmica (Render usa process.env.PORT)
const port = process.env.PORT || 3000;

// Sobe o servidor
ViteExpress.listen(app, Number(port), () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
});
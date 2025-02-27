const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const app = express();
const port = 3000;

// Conexão com MongoDB
mongoose.connect('mongodb+srv://ManoKondz:Enzo@1997@cluster0.lk1mn.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Modelo de Campanha de D&D
const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, default: 'default.jpg' },
  date: { type: Date, default: Date.now },
});

const Campaign = mongoose.model('Campaign', campaignSchema);

// Configuração do Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Campanhas de D&D',
      version: '1.0.0',
      description: 'API para gerenciar campanhas de RPG',
    },
    servers: [{ url: 'http://localhost:3000' }],
  },
  apis: ['./server.js'], // Caminho do arquivo com os endpoints
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /api/campaigns:
 *   get:
 *     summary: Retorna todas as campanhas
 *     description: Retorna a lista de campanhas armazenadas no banco de dados.
 *     responses:
 *       200:
 *         description: Lista de campanhas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     example: "650a6cd9e45b48c3d8a1a89f"
 *                   name:
 *                     type: string
 *                     example: "Aventura na Ferradura"
 *                   description:
 *                     type: string
 *                     example: "Uma jornada épica para salvar o reino"
 */
app.get('/api/campaigns', async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.json(campaigns);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar campanhas' });
  }
});

/**
 * @swagger
 * /api/campaigns:
 *   post:
 *     summary: Cria uma nova campanha
 *     description: Adiciona uma nova campanha ao banco de dados.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "A Lenda dos Dragões"
 *               description:
 *                 type: string
 *                 example: "Uma aventura cheia de mistérios e dragões ancestrais"
 *               image:
 *                 type: string
 *                 example: "dragons.jpg"
 *     responses:
 *       201:
 *         description: Campanha criada com sucesso
 *       400:
 *         description: Erro na requisição
 */
app.post('/api/campaigns', async (req, res) => {
  try {
    const { name, description, image } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Nome e descrição são obrigatórios' });
    }

    const newCampaign = new Campaign({ name, description, image });
    await newCampaign.save();

    res.status(201).json({ message: 'Campanha criada com sucesso!', campaign: newCampaign });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao criar campanha' });
  }
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${port}`);
  console.log(`📄 Documentação disponível em http://localhost:${port}/api-docs`);
});

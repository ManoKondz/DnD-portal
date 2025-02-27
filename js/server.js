const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const app = express();
const port = 3000;


app.use(cors());
// Conexão com MongoDB
mongoose.connect('mongodb+srv://ManoKondz:Enzo%401997@cluster0.lk1mn.mongodb.net/portal-aventuras', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ Conectado ao MongoDB'))
.catch((err) => console.error('❌ Erro ao conectar ao MongoDB:', err));

// Middleware
app.use(bodyParser.json());
app.use(express.static('public')); // Para servir arquivos estáticos como HTML, CSS, JS

// Modelo de Item
const itemSchema = new mongoose.Schema({
    tipo: { type: String, required: true, enum: ['campanha', 'personagem', 'monstro', 'item-magico'] },
    nome: { type: String, required: true },
    descricao: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const Item = mongoose.model('Item', itemSchema);

// Configuração do Swagger
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Portal de Aventuras API',
            version: '1.0.0',
            description: 'API para gerenciamento de itens no Portal de Aventuras D&D',
            contact: {
                name: 'Suporte',
                url: 'https://seusite.com',
                email: 'suporte@seusite.com',
            },
        },
        servers: [
            {
                url: 'http://localhost:3000',
            },
        ],
    },
    apis: ['./server.js'], // Arquivo onde as rotas estão descritas
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Funções para adicionar e retornar diferentes tipos de itens

// Adicionar Campanha
app.post('/api/adicionar-campanha', async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: "Nome e descrição são obrigatórios!" });
    }

    try {
        const novaCampanha = new Item({ tipo: 'campanha', nome, descricao });
        await novaCampanha.save();
        res.status(201).json({ message: `Campanha ${nome} adicionada com sucesso!`, item: novaCampanha });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar a campanha", error: error.message });
    }
});

// Adicionar Personagem
app.post('/api/adicionar-personagem', async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: "Nome e descrição são obrigatórios!" });
    }

    try {
        const novoPersonagem = new Item({ tipo: 'personagem', nome, descricao });
        await novoPersonagem.save();
        res.status(201).json({ message: `Personagem ${nome} adicionado com sucesso!`, item: novoPersonagem });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar o personagem", error: error.message });
    }
});

// Adicionar Monstro
app.post('/api/adicionar-monstro', async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: "Nome e descrição são obrigatórios!" });
    }

    try {
        const novoMonstro = new Item({ tipo: 'monstro', nome, descricao });
        await novoMonstro.save();
        res.status(201).json({ message: `Monstro ${nome} adicionado com sucesso!`, item: novoMonstro });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar o monstro", error: error.message });
    }
});

// Adicionar Item Mágico
app.post('/api/adicionar-item-magico', async (req, res) => {
    const { nome, descricao } = req.body;

    if (!nome || !descricao) {
        return res.status(400).json({ message: "Nome e descrição são obrigatórios!" });
    }

    try {
        const novoItemMagico = new Item({ tipo: 'item-magico', nome, descricao });
        await novoItemMagico.save();
        res.status(201).json({ message: `Item Mágico ${nome} adicionado com sucesso!`, item: novoItemMagico });
    } catch (error) {
        res.status(500).json({ message: "Erro ao salvar o item mágico", error: error.message });
    }
});

// Obter campanhas
app.get('/api/campanhas', async (req, res) => {
    try {
        const campanhas = await Item.find({ tipo: 'campanha' }).sort({ createdAt: -1 });
        res.json(campanhas);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar campanhas", error: error.message });
    }
});

// Obter personagens
app.get('/api/personagens', async (req, res) => {
    try {
        const personagens = await Item.find({ tipo: 'personagem' }).sort({ createdAt: -1 });
        res.json(personagens);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar personagens", error: error.message });
    }
});

// Obter monstros
app.get('/api/monstros', async (req, res) => {
    try {
        const monstros = await Item.find({ tipo: 'monstro' }).sort({ createdAt: -1 });
        res.json(monstros);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar monstros", error: error.message });
    }
});

// Obter itens mágicos
app.get('/api/itens-magicos', async (req, res) => {
    try {
        const itensMagicos = await Item.find({ tipo: 'item-magico' }).sort({ createdAt: -1 });
        res.json(itensMagicos);
    } catch (error) {
        res.status(500).json({ message: "Erro ao buscar itens mágicos", error: error.message });
    }
});

// Endpoint para exibir a página principal
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Inicializa o servidor
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Documentação Swagger disponível em http://localhost:${port}/api-docs`);
});


/**
 * @swagger
 * tags:
 *   - name: Itens
 *     description: Endpoints para gerenciar campanhas, personagens, monstros e itens mágicos.
 */

/**
 * @swagger
 * /api/adicionar-campanha:
 *   post:
 *     summary: Adiciona uma nova campanha
 *     tags: [Itens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Campanha adicionada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Nome e descrição são obrigatórios
 *       500:
 *         description: Erro ao salvar a campanha
 */

/**
 * @swagger
 * /api/adicionar-personagem:
 *   post:
 *     summary: Adiciona um novo personagem
 *     tags: [Itens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Personagem adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Nome e descrição são obrigatórios
 *       500:
 *         description: Erro ao salvar o personagem
 */

/**
 * @swagger
 * /api/adicionar-monstro:
 *   post:
 *     summary: Adiciona um novo monstro
 *     tags: [Itens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Monstro adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Nome e descrição são obrigatórios
 *       500:
 *         description: Erro ao salvar o monstro
 */

/**
 * @swagger
 * /api/adicionar-item-magico:
 *   post:
 *     summary: Adiciona um novo item mágico
 *     tags: [Itens]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *               - descricao
 *             properties:
 *               nome:
 *                 type: string
 *               descricao:
 *                 type: string
 *     responses:
 *       201:
 *         description: Item mágico adicionado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 item:
 *                   $ref: '#/components/schemas/Item'
 *       400:
 *         description: Nome e descrição são obrigatórios
 *       500:
 *         description: Erro ao salvar o item mágico
 */
/**
 * @swagger
 * /api/campanhas:
 *   get:
 *     summary: Retorna todas as campanhas
 *     tags: [Itens]
 *     responses:
 *       200:
 *         description: Lista de campanhas retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Erro ao buscar campanhas
 */

/**
 * @swagger
 * /api/personagens:
 *   get:
 *     summary: Retorna todos os personagens
 *     tags: [Itens]
 *     responses:
 *       200:
 *         description: Lista de personagens retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Erro ao buscar personagens
 */

/**
 * @swagger
 * /api/monstros:
 *   get:
 *     summary: Retorna todos os monstros
 *     tags: [Itens]
 *     responses:
 *       200:
 *         description: Lista de monstros retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Erro ao buscar monstros
 */

/**
 * @swagger
 * /api/itens-magicos:
 *   get:
 *     summary: Retorna todos os itens mágicos
 *     tags: [Itens]
 *     responses:
 *       200:
 *         description: Lista de itens mágicos retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Erro ao buscar itens mágicos
 */

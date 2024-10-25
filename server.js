//MODULES -------------------------------------
const bodyParser = require('body-parser');
const path = require('path');

const manageDB = require('./server/manageDB.js');

const session = require('express-session');
const express = require('express');
const app = express();
const PORT = 1101;

//html paths
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/html', express.static(path.join(__dirname, 'html')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/js', express.static(path.join(__dirname, 'js')));
//ejs path
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'html'));
//body parser
app.use(bodyParser.urlencoded({extended: true}));
//session
app.use(session({
    secret: 'log_key',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

//ROUTES --------------------------------------

//Login: get=gerar/post=logar
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'login.html'));
});
app.post('/', async (req, res) => {
    const {email, senha} = req.body;
    const usuarioEncontrado = await manageDB.searchUsuarioPorEmail(email);
    if (!usuarioEncontrado || usuarioEncontrado.senha != senha) {
        res.redirect('/?error=1');
    } else {
        const user = {
            id: usuarioEncontrado.usuario_id,
            nome: usuarioEncontrado.nome,
            email: usuarioEncontrado.email
        }
        req.session.user = user;
        res.redirect('/home');
    }
});

//Logout: get=limpar dados e voltar pro menu
app.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            console.error('Logout error: ', error);
            return res.redirect('/home');
        } else {
            res.redirect('/');
        }
    })
})

//Cadastro Usuário: get=gerar/post=logar
app.get('/cadastrarUsuario', (req, res) => {
    res.sendFile(path.join(__dirname, 'html', 'cadastrarUsuario.html'));
});
app.post('/cadastrarUsuario', async (req, res) => {
    const {nome, email, senha, confirma} = req.body;
    const usuarioEncontrado = await manageDB.searchUsuarioPorEmail(email);
    if (senha != confirma) {
        res.redirect('/cadastrarUsuario?error=1');
    } else if (usuarioEncontrado) {
        res.redirect('/cadastrarUsuario?error=2');
    } else {
        await manageDB.addUsuario(nome, email, senha);
        res.redirect('/cadastrarUsuario?success=1');
    }
});

//Home para o usuário
app.get('/home', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); //Precisa logar
    }
    const user = req.session.user;
    const projetos = await manageDB.getProjetosUsuarioPorId(user.id);
    // const equipes = await manageDB.getEquipesComoUsuarioComumPorId(user.id);
    res.render('menuPrincipal', {user: user, projetos: projetos});
});
app.post('/home', async (req, res) => {
    const user = req.session.user;
    const {nome, dataInicio, dataFim} = req.body;
    // res.send(`${nome} :::: ${user.id}`)
    await manageDB.addProjeto(nome, user.id, dataInicio, dataFim);
    res.redirect('/home?success=1');
});
app.get('/del-projeto', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); //Precisa logar
    }
    const projeto_id = req.query.p;
    const user = req.session.user;
    const tarefas = await manageDB.getTarefasProjetosPorId(projeto_id);
    if (tarefas.length > 0) {
        return res.redirect('/home?error=3');
    } else {
        await manageDB.deleteProjetoPorId(projeto_id);
        res.redirect('/home')
    }
});

//Página dos detalhes Projeto
app.get('/projeto', (req, res) => {
    res.redirect('/');
})
app.get('/projeto/:id', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); //Precisa logar
    }
    const user = req.session.user;
    const projeto = await manageDB.getProjetoPorId(Number(req.params.id));
    const projetoID = projeto.projeto_id;
    const tarefas = await manageDB.getTarefasProjetosPorId(projetoID);

    res.render('menuDoProjeto', {user: user, projeto: projeto, tarefas: tarefas});
});
app.post('/projeto/:id', async (req, res) => {
    const projeto_id = Number(req.params.id);
    const {descricao, dataInicio, dataFim, status} = req.body;
    await manageDB.addTarefa(projeto_id, descricao, dataInicio, dataFim, status);
    res.redirect(`/projeto/${projeto_id}?success=1`);
});
//Deletar atividade
app.get('/del-tarefa/:projeto_id/:tarefa_id', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); //Precisa logar
    }
    const projeto_id = Number(req.params.projeto_id);
    const tarefa_id = Number(req.params.tarefa_id);
    await manageDB.deleteTarefaPorId(tarefa_id);
    res.redirect(`/projeto/${projeto_id}?success=2`);
});
app.get('/end-tarefa', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/'); //Precisa logar
    }
    const projeto_id = Number(req.query.p);
    const tarefa_id = Number(req.query.t);
    const status = Number(req.query.s);
    await manageDB.updateTarefaStatusPorId(tarefa_id, status);
    res.redirect(`/projeto/${projeto_id}`);
});

//SERVER --------------------------------------
app.listen(PORT, () => {
    console.log(`Servidor aberto em: http://localhost:${PORT}/`);
})
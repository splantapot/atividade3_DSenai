CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS projetos (
    projeto_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    usuario_lider INTEGER NOT NULL,
    FOREIGN KEY (usuario_lider) REFERENCES usuarios(usuario_id)
);

CREATE TABLE IF NOT EXISTS equipe_projeto (
    rel_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    usuario_id INTEGER NOT NULL,
    projeto_id INTEGER NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id),
    FOREIGN KEY (projeto_id) REFERENCES projetos(projeto_id)
);

CREATE TABLE IF NOT EXISTS tarefas (
    tarefa_id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    projeto_id INTEGER NOT NULL,
    descricao TEXT NOT NULL,
    dataInicio TEXT NOT NULL,
    dataFim TEXT NOT NULL,
    status INTEGER NOT NULL,
    FOREIGN KEY (projeto_id) REFERENCES projetos(projeto_id)
);

/* STATUS da tarefa
0 - Em andamento
1 - Concluída
2 - Cancelada
*/
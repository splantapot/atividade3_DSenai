//MODULES ---------------------------------------
const sqlite3 = require('sqlite3').verbose();

//MY DB SETUP -----------------------------------
const DB_NAME = 'database';
const DB_PATH = `./${DB_NAME}.db`

//LOAD and CLOSE --------------------------------
function openDB(path = DB_PATH) {
    let db = new sqlite3.Database(path, (error) => {
        if (error) {
            console.log('Erro openDB:', error);
        } else {
            console.log(`Banco em '${path}' aberto.`);
        }
    });
    return db;
}

const DEFAULT_DB = openDB();

function closeDB(db = DEFAULT_DB, path = DB_PATH) {
    db.close((error) => {
        if (error) {
            console.log('Erro closeDB:', error);
        } else {
            console.log(`Banco em '${path}' fechado.`)
        }
    });
    return null;
}

//INSERT FUNCTIONS
function addUsuario(nome, email, senha, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO usuarios(nome, email, senha) VALUES (?,?,?);';
        db.run(query, [nome, email, senha], (error) => {
            if (error) {
                console.error('addUsuario: ', error);
                reject(error);
            } else {
                console.log(`Usuario (${nome}) adicionado.`);
                resolve();
            }
        });
    });
}

function addProjeto(nome, usuario_lider, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO projetos(nome, usuario_lider) VALUES (?,?);';
        db.run(query, [nome, usuario_lider], (error) => {
            if (error) {
                console.error('addProjeto: ', error);
                reject(error);
            } else {
                console.log(`Projeto (${nome}) adicionado.`);
                resolve();
            }
        });
    });
}

function addTarefa(projeto_id, descricao, dataInicio, dataFim, status, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO tarefas(projeto_id, descricao, dataInicio, dataFim, status) VALUES (?,?,?,?,?);';
        db.run(query, [projeto_id, descricao, dataInicio, dataFim, status], (error) => {
            if (error) {
                console.error('addTarefa: ', error);
                reject(error);
            } else {
                console.log(`Tarefa (${descricao}) adicionada.`);
                resolve();
            }
        });
    });
}

function addUsuarioEmEquipe(usuario_id, projeto_id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO equipe_projeto(usuario_id, projeto_id) VALUES (?,?);';
        db.run(query, [usuario_id, projeto_id], (error) => {
            if (error) {
                console.error('addProjeto: ', error);
                reject(error);
            } else {
                console.log(`Usuario (${usuario_id} adicionado ao projeto (${projeto_id}))`);
                resolve();
            }
        });
    });
}

//GET DATA FUNCTIONS
function searchUsuarioPorEmail(email, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM usuarios WHERE email = ?';
        db.get(query, [email], (error, data) => {
            if (error) {
                console.error('searchUsuarioPorEmail: ', error);
                reject(error);
            } else {
                resolve(data);
            }
        })
    });
}

function getProjetosUsuarioPorId(id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM projetos WHERE usuario_lider = ?';
        db.all(query, [id], (error, data) => {
            if (error) {
                console.error('getProjetosProfessorPorId: ', error);
                reject(error);
            } else {
                resolve(data);
            }
        })
    });
}

// function getEquipesComoUsuarioComumPorId(id, db = DEFAULT_DB) {
//     return new Promise((resolve, reject) => {
//         const query = 'SELECT p.* FROM equipe_projeto e JOIN projetos p ON e.projeto_id = p.projeto_id WHERE e.usuario_id = ?;';
//         db.all(query, [id], (error, data) => {
//             if (error) {
//                 console.error('getEquipesComoUsuarioComumPorId: ', error);
//                 reject(error);
//             } else {
//                 resolve(data);
//             }
//         })
//     });
// }

function getProjetoPorId(id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM projetos WHERE projeto_id = ?';
        db.get(query, [id], (error, data) => {
            if (error) {
                console.error('getProjetoPorId: ', error);
                reject(error);
            } else {
                resolve(data);
            }
        })
    });
}

function getTarefasProjetosPorId(id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tarefas WHERE projeto_id = ?';
        db.all(query, [id], (error, data) => {
            if (error) {
                console.error('getTarefasProjetosPorId: ', error);
                reject(error);
            } else {
                resolve(data);
            }
        })
    });
}

//DELETE
function deleteTarefaPorId(id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM tarefas WHERE tarefa_id = ?';
        db.run(query, [id], (error) => {
            if (error) {
                console.error('deleteTarefaPorId: ', error);
                reject(error);
            } else {
                resolve();
            }
        })
    });
}
function deleteProjetoPorId(id, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'DELETE FROM projetos WHERE projeto_id = ?';
        db.run(query, [id], (error) => {
            if (error) {
                console.error('deleteProjetoPorId: ', error);
                reject(error);
            } else {
                resolve();
            }
        })
    });
}

//UPDATE
function updateTarefaStatusPorId(id, status, db = DEFAULT_DB) {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE tarefas SET status = ? WHERE tarefa_id = ?';
        db.run(query, [status, id], (error) => {
            if (error) {
                console.error('deleteTarefaPorId: ', error);
                reject(error);
            } else {
                resolve();
            }
        })
    });
}

//EXPORTS
module.exports = {
    openDB,
    closeDB,
    addUsuario,
    addProjeto,
    addTarefa,
    addUsuarioEmEquipe,
    searchUsuarioPorEmail,
    getProjetosUsuarioPorId,
    getProjetoPorId,
    getTarefasProjetosPorId,
    deleteTarefaPorId,
    deleteProjetoPorId,
    updateTarefaStatusPorId,
    updateTarefaStatusPorId
}
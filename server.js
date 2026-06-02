// importação do micro framework fastify
import { fastify } from 'fastify';
// importação do banco de dados local
// Não esquecer de colocar a extensão do arquivo
import { DatabaseMemory } from './database-memory.js';

// instanciar o meu servidor de aplicação
const server = fastify();

// instanciar o banco de dados
const database = new DatabaseMemory();

// criar um endpoint default (padrão)
// testar se minha aplicação está funcionando (ar)
server.get('/', () => {
    console.log('Iniciando API...')
    return 'API da Biblioteca em execução!!';
})

// enpoints para manipular os livros
// GET -> retorna informação (listagem)
// POST -> enviar informação (inserir)
// PUT -> atualizar informação
// DELETE -> remover informação
// listar livros
server.get('/books', () => {
    // retorna a listagem dos livros
    return database.list();
})
// inserir livros
// request -> receber os dados enviados pelo cliente
// response -> retorno algo para o cliente
server.post('/books', (request, response) => {
    // como que eu pego os dados enviados pelo client??
    const { title, author, year, category } = request.body;

    // REGRAS DE INSERÇÃO

    // - 400 -> parâmetros obrigatórios
    if (!title || ! author || !year || !category) {
        return response.status(400).send({
            message: 'title, author, year e category são obrigatórios!'
        });
    }

    // year número e > 0
    // faço um cast do atributo do year para sempre ser númerico
    if (Number(year) <= 0){
        return response.status(400).send({
            message: 'Year deve ser númerico e maior que 0!'
        });
    }

    // verifricar se existe duplicidade
    const existingBook = database.list().find((book) => {
        
        return (
            book.title.toLowerCase() === title.toLowerCase() &&
            book.author.toLowerCase() === author.toLowerCase()
        )
    })

    if (existingBook) {
        return response.status(400).send({
            message: 'Já existe um livro com esse título e autor'
        });
    }

    // nome da coluna no banco de dados: dados enviados requisição
    database.create({
        title: title,
        author: author,
        year: Number(year),
        category: category,
        available: true,
        borrowedBy: null
    });
    // retorno um código
    // - 201 -> dado inserido com sucesso!
    return response.status(201).send();
})
// atualização de livrosx'
// 1 - autor: dom casmurro | titulo: dom casmurro 1 ....
// 2 - autor: J. K. Rowling | titulo: Harry Potter e a pedra filosofal ..
// 3 - autor: J. K. Rowling | titulo: Harry Potter e a câmera secreta ....
server.put('/books/:bookId', (request, response) => {
    // pegar o ID do livro a ser atualizado
    // request.body -> dados enviados pelo cliente
    // request.params -> parâmetros dinâmicos da rota
    const { bookId } = request.params;

    // pegar os dados do livro a ser atualizado
    const { title, author, year, category } = request.body;

    // verificar se o livro existe
    const book = database.findById(bookId);
    
    if (!book) {
        // 404 - informação errada/não encontrada
        return response.status(404).send({
            message: 'Livro não encontrado!'
        });
    }
    // Livro existe, posso atualizar
    database.update(bookId, {
        ...book,
        title: title,
        author: author,
        year: Number(year),
        category: category
    });
    // atualização de dados -> 204 -> Sucesso e não tem retorno
    return response.status(204).send();

})
// deletar livro
// passo o id a ser removido
// TEM QUE INICIAR COM / o endpoint
server.delete('/books/:bookId', (request, response) => {
    // pegar o id enviado por parâmetro
    const { bookId } = request.params;
    // buscar o livro pelo id
    const book = database.findById(bookId);

    // verificar se o livro existe
    if (!book) {
        return response.status(404).send({
            message: 'Livro não encontrado!'
        });
    }

    // verificar se o livro está emprestado
    // available -> true = está disponível
    // available -> false = está emprestado
    // 404 -> bad request (parâmetros inválidos, condições não atendidas)
    if (!book.available) {
        return response.status(404).send({
            message: 'Não é possível excluir um livro emprestado!'
        });
    }

    database.delete(bookId);
    return response.status(204).send();

})
// PUT -> atualização total dos dados
// PATCH -> atualização parcial dos dados
// Empréstimo de livro
server.patch('/books/:bookId/borrow', (request, response) => {
    // pego o id do livro a ser modificado
    const { bookId } = request.params;
    const { name } = request.body;

    // busca o livro usando o id
    const book = database.findById(bookId);

    // verifico se o livro existe
    if (!book) {
        return response.status(404).send({
            message: 'Livro não encontrado!'
        });
    }
    // verificar se está disponível
    if (!book.available) {
        return response.status(404).send({
            message: 'Não é possível excluir um livro emprestado!'
        });
    }

    // verificar se o nome foi informado para o empréstimo
    if (!name) {
        return response.status(400).send({
            message: 'Informe o nome de quem está realizando o empréstimo!'
        });
    }

    database.update(bookId, {
        ...book,
        available: false, // emprestou o livro
        borrowedBy: name  // quem emprestou o livro
    })
    // patch -> 200 com alguma mensagem
    // put/delete -> 204 houve modificação de registro 
    return response.status(200).send({
        message: 'Empréstimo realizado com sucesso!'
    });

})
// Devolução de livro
server.patch('/books/:bookId/return', (request, response) => {
    // pego o id do livro a ser modificado
    const { bookId } = request.params;

    // busca o livro usando o id
    const book = database.findById(bookId);

    // verifico se o livro existe
    if (!book) {
        return response.status(404).send({
            message: 'Livro não encontrado!'
        });
    }
    // verificar se está disponível
    // available = true -> ele já está disponível
    if (book.available) {
        return response.status(404).send({
            message: 'Esse livro já está disponível na biblioteca!'
        });
    }

    database.update(bookId, {
        ...book,
        available: true, // devolveu o livro
        borrowedBy: null  // apaga quem emprestou
    })
    // patch -> 200 com alguma mensagem
    // put/delete -> 204 houve modificação de registro 
    return response.status(200).send({
        message: 'Devolução realizado com sucesso!'
    });

})

// definir a porta em que a aplicação será executada
server.listen({
    port: 3000
})
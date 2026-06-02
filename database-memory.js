// importação de uma biblioteca que vai gerar o ID de forma
// aleatória e ÚNICA
// UUID -> Universal Unique ID
// node: -> digo que é biblioteca raiz do node
import { randomUUID } from 'node:crypto';
// criar uma classe do meu banco de dados local
// export -> possibilita a importação dessa classe em outro arquivo
export class DatabaseMemory{
    // criar uma variável privada local
    // funciona como banco de dados
    // set -> evita duplicidade
    // map -> possui vários métodos para execução
    #books = new Map();

    // métodos que o banco de dados possui
    list(){
        // retornar a listagem dos livros sem Id -> values()
        // retornar a listagem dos livros com Id -> entries()
        const book = Array.from(this.#books.entries())
            .map(([id, book]) => {
                return { 
                    id,
                    ...book
                }
            });
        //console.log('list() -> ', book)
        return book;
    }
    // recebe por parâmetro os dados a serem inseridos no banco
    create(book){
        // gera um ID único de forma aleatória
        const bookId = randomUUID();
        // salva as informações na variável privada
        this.#books.set(bookId, book);
    }
    // recebe por parâmetro:
    // - id do registro a ser alterado
    // - os dados que serão alterados
    update(bookId, book){
        // Método .set
        // se o ID não existe, ele cria
        // se o ID existe, ele altera
        this.#books.set(bookId, book);
    }
    // recebe por parâmetro o id a ser removido
    delete(bookId){
        this.#books.delete(bookId);
    }

    findById(id){
        return this.#books.get(id);
    }

}
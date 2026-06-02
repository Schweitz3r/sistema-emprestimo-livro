import 'dotenv/config';
import pg from 'pg';

const{ Pool }  = pg;

export class DatabasePostgreSQL{
    #pool = new Pool ({
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE
    });

    async list(){
        const result= await this.#pool.query("SELECT * FROM books");
        return result.rows;
    }

    async create(book){
        await this.#pool.query(`
            INSERT INTO books(
                title,
                author,
                year,
                category
            )VALUES($1, $2, $3, $4)
        
        `,
        [
            book.title, book.author, book.year, book.category
        ]);
    }
}
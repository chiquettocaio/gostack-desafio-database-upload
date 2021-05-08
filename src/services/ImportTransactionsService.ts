import csvParse from 'csv-parse'
import fs from 'fs'

import Transaction from '../models/Transaction';
import CreateTransactionService from '../services/CreateTransactionService';

class ImportTransactionsService {
  async execute(path: string): Promise<Transaction[]> {
    const file = fs.readFileSync(path, { encoding: 'utf8' })
    const lines = file.replace(/\r/g, '').split(/\n/)

    const transactions = []

    for (let i = 0; i < lines.length; i++) {
      if (i) {
        const [title, type, value, category] = lines[i].split(',')

        if (title) {
          const createTransactionS = new CreateTransactionService()
          const fixedType = /income/.test(type) ? 'income' : 'outcome'

          const transaction = await createTransactionS
            .execute({
              title: title.trim(),
              value: Number(value),
              type: fixedType,
              category: category.trim()
            })

            transactions.push(transaction)
          }
        }
      }

    return transactions
  }
}

export default ImportTransactionsService;

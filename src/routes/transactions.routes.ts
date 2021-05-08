import { Router } from 'express';
import { getCustomRepository } from 'typeorm'
import multer from 'multer'

import TransactionsRepository from '../repositories/TransactionsRepository'
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
import uploadConfig from '../config/upload'

const transactionsRouter = Router();
const upload = multer(uploadConfig)

transactionsRouter.get('/', async (request, response) => {
  const transactionR = getCustomRepository(TransactionsRepository)
  const transactions = await transactionR.find()
  const balance = await transactionR.getBalance()

  return response
    .status(200)
    .json({
      transactions,
      balance
    })
});

transactionsRouter.post('/', async (request, response) => {
  const { title, value, type, category } = request.body
  const createTransactionS = new CreateTransactionService()
  const transaction = await createTransactionS
    .execute({ title, value, type, category })

  return response
    .status(200)
    .json(transaction)
});

transactionsRouter.delete('/:id', async (request, response) => {
  const { id } = request.params

  const deleteTransactionS = new DeleteTransactionService()
  await deleteTransactionS.execute(id)

  response
    .status(200)
    .send()
});

transactionsRouter.post('/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactionsS = new ImportTransactionsService()
    const transactions = await importTransactionsS.execute(request.file.path)
    return response
      .status(200)
      .json(transactions)
});

export default transactionsRouter;

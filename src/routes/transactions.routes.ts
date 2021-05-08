import { Router } from 'express';
import { getCustomRepository } from 'typeorm'

import Transaction from '../models/Transaction'
import TransactionRepository from '../repositories/TransactionsRepository'

// import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
// import DeleteTransactionService from '../services/DeleteTransactionService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

transactionsRouter.get('/', async (request, response) => {
  const transactionR = getCustomRepository(TransactionRepository)
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
  // TODO
});

transactionsRouter.post('/import', async (request, response) => {
  // TODO
});

export default transactionsRouter;

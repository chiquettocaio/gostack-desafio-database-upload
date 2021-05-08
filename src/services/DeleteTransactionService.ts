import { getCustomRepository } from 'typeorm'

import TransactionsRepository from '../repositories/TransactionsRepository'
import Transaction from '../models/Transaction'
import AppError from '../errors/AppError';

class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionR = getCustomRepository(TransactionsRepository)

    const transaction = await transactionR.findOne(id)

    if (!transaction) {
      throw new AppError('Transaction not found', 404)
    }

    await transactionR.remove(transaction)
  }
}

export default DeleteTransactionService;

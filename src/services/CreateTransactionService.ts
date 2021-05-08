import { getRepository, getCustomRepository } from 'typeorm'

import AppError from '../errors/AppError';

import Category from '../models/Category';
import Transaction from '../models/Transaction';
import TransactionsRepository from '../repositories/TransactionsRepository'

interface RequestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute(data: RequestDTO): Promise<Transaction> {
    const { title, value, type, category } = data

    if (!title || typeof title !== 'string') {
      throw new AppError('Invalid transaction title')
    }

    if (!value || typeof value !== 'number') {
      throw new AppError('Invalid transaction value')
    }

    if (!type || typeof type !== 'string' || !/^income|outcome$/.test(type)) {
      throw new AppError('Invalid transaction type')
    }

    if (!category || typeof category !== 'string') {
      throw new AppError('Invalid transaction category')
    }

    const categoryRepository = getRepository(Category)

    let categoryTarget = await categoryRepository.findOne({
      where: { title: category }
    })

    if (!categoryTarget) {
      categoryTarget = categoryRepository.create({
        title: category
      })

      await categoryRepository.save(categoryTarget)
    }

    const transactionR = getCustomRepository(TransactionsRepository)

    const { total } = await transactionR.getBalance()
    if (/^outcome$/.test(type) && value > total) {
      throw new AppError('No enough money available')
    }


    const transaction = transactionR.create({
      category_id: categoryTarget.id,
      title,
      type,
      value,
      category: categoryTarget
    })

    await transactionR.save(transaction)

    return transaction
  }
}

export default CreateTransactionService;

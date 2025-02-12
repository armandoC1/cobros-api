import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entities/payment.entity';
import { Between, Repository } from 'typeorm';
import { Debt } from 'src/debts/entities/debts.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { SearchPaymentDto } from './dto/search-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Injectable()
export class PaymentService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    try {
      const debt = await this.debtRepository.findOne({
        where: { id: createPaymentDto.debtId },
      });

      if (!debt)
        throw new HttpException('Debt not found', HttpStatus.NOT_FOUND);

      const payment = new Payment();

      payment.amount = createPaymentDto.amount;
      payment.debt = debt;
      payment.paymentDate = createPaymentDto.paymentDate as unknown as Date;

      await this.paymentRepository.save(payment);

      return {
        ok: true,
        message: 'Created payment successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: `Error to created payment ${error}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({ active, ...searchPaymentDto }: SearchPaymentDto) {
    try {
      const [payment, total] = await this.paymentRepository.findAndCount({
        relations: {
          debt: true,
        },
        where: {
          isActive: !!active,
          paymentDate: Between(
            new Date(searchPaymentDto.startDate),
            new Date(searchPaymentDto.endDate),
          ),
        },
        order: { id: 'DESC' },
        skip: (searchPaymentDto.page - 1) * searchPaymentDto.limit,
        take: searchPaymentDto.limit,
      });

      if (payment.length > 0) {
        let totalPag: number = total / searchPaymentDto.limit;
        if (totalPag % 1 !== 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        const nextPag: number =
          searchPaymentDto.page >= totalPag
            ? searchPaymentDto.page
            : Number(searchPaymentDto.page) + 1;

        const prevPag: number =
          searchPaymentDto.page <= totalPag
            ? searchPaymentDto.page
            : Number(searchPaymentDto.page) - 1;

        return {
          ok: true,
          payment,
          total,
          totalPag,
          currentPage: Number(searchPaymentDto.page),
          nextPag,
          prevPag,
          stautus: HttpStatus.OK,
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          message: `Error to search, ${error}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id, isActive: true },
        relations: {
          debt: true,
        },
      });
      if (!payment)
        throw new HttpException('Payment not found ', HttpStatus.NOT_FOUND);
      return {
        ok: true,
        message: 'Debit found successfully',
        payment,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: `Error ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id, isActive: true },
      });

      const debt = await this.debtRepository.findOne({
        where: { id: updatePaymentDto.debtId },
      });

      if (!payment || !debt) {
        throw new HttpException(
          'Payment or Debti not found',
          HttpStatus.NOT_FOUND,
        );
      }

      payment.amount = updatePaymentDto.amount;

      await this.paymentRepository.save(payment);

      return {
        ok: true,
        message: 'Payment updated successfully',
        payment,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          message: `Error unespected, ${error} `,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const payment = await this.paymentRepository.findOne({
        where: { id, isActive: true },
      });
      if (!payment) {
        throw new HttpException('Payment not found ', HttpStatus.NOT_FOUND);
      }

      payment.isActive = false;

      await this.paymentRepository.save(payment);

      return {
        ok: true,
        message: 'Payment removed successfully',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          message: `Error unexpend ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

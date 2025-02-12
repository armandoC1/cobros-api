import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Debt } from './entities/debts.entity';
import { In, Like, Repository } from 'typeorm';
import { Payment } from 'src/payment/entities/payment.entity';
import { CreateDetDto } from './dto/create-debts.dto';
import { User } from 'src/Users/entities/user.entity';
import { SearchDebtsDto } from './dto/seach-debts.dto';
import { UpdateDebtsDto } from './dto/update-debts.dto';

@Injectable()
export class DebtService {
  constructor(
    @InjectRepository(Debt)
    private readonly debtRepository: Repository<Debt>,
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createDetDto: CreateDetDto) {
    try {
      const customer = await this.userRepository.findOne({
        where: { id: createDetDto.customerId },
      });

      if (!customer) {
        throw new HttpException('Customer not found', HttpStatus.NOT_FOUND);
      }

      const debt = new Debt();

      debt.amount = createDetDto.amount;
      debt.amountPaid = createDetDto.amountPaid;
      debt.customer = customer;
      debt.descripcion = createDetDto.descripcion;
      debt.registrationDate = createDetDto.registationDate as unknown as Date;
      debt.remainingAmount = debt.amount - debt.amountPaid;

      await this.debtRepository.save(debt);

      return {
        ok: true,
        message: 'Debt created successfully',
        status: HttpStatus.CREATED,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: `Error to create debt, ${error}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findAll({ active, ...searchDebtsDto }: SearchDebtsDto) {
    try {
      const [debt, total] = await this.debtRepository.findAndCount({
        relations: {
          customer: true,
        },
        where: {
          isActive: !!active,
          customer: {
            fullName: Like(`%${searchDebtsDto.customer}%`),
          },
        },
        order: { id: 'DESC' },
        skip: (searchDebtsDto.page - 1) * searchDebtsDto.limit,
        take: searchDebtsDto.limit,
      });

      if (debt.length > 0) {
        let totalPag: number = total / searchDebtsDto.limit;
        if (totalPag % 1 !== 0) {
          totalPag = Math.trunc(totalPag) + 1;
        }
        const nextPag: number =
          searchDebtsDto.page >= totalPag
            ? searchDebtsDto.page
            : Number(searchDebtsDto.page) + 1;

        const prevPag: number =
          searchDebtsDto.page <= totalPag
            ? searchDebtsDto.page
            : Number(searchDebtsDto.page) - 1;

        return {
          ok: true,
          debt,
          total,
          totalPag,
          currentPage: Number(searchDebtsDto.page),
          nextPag,
          prevPag,
          status: HttpStatus.OK,
        };
      }
    } catch (error) {
      throw new HttpException(
        {
          message: `Error to search debt, ${error}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: number) {
    try {
      const debt = await this.debtRepository.findOne({
        where: { id, isActive: true },
        relations: {
          customer: true,
        },
      });

      if (!debt) {
        throw new HttpException('Debts not found', HttpStatus.NOT_FOUND);
      }
      return {
        ok: true,
        message: 'Debit found successfully',
        debt,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: `Error debt not found, ${error}`,
          error: error.message,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: number, updateDetbDto: UpdateDebtsDto) {
    try {
      const debt = await this.debtRepository.findOne({
        where: { id, isActive: true },
      });

      const customer = await this.userRepository.findOne({
        where: { id: updateDetbDto.customerId },
      });

      if (!debt || !customer) {
        throw new HttpException(
          'Debt not found or User not found',
          HttpStatus.NOT_FOUND,
        );
      }
      debt.amount = updateDetbDto.amount;
      debt.amountPaid = updateDetbDto.amountPaid;
      debt.descripcion = updateDetbDto.descripcion;
      debt.registrationDate = updateDetbDto.registationDate as unknown as Date;
      debt.remainingAmount = updateDetbDto.remainingAmount;

      await this.debtRepository.save(debt);

      return {
        ok: true,
        message: 'Debit updated successfully',
        debt,
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          message: `Error to update debt, ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async remove(id: number) {
    try {
      const debt = await this.debtRepository.findOne({
        where: { id, isActive: true },
      });

      if (!debt)
        throw new HttpException('Debt not found', HttpStatus.NOT_FOUND);

      debt.isActive = false;

      await this.debtRepository.save(debt);
      return {
        ok: true,
        message: 'Debt deleted successfullly',
        status: HttpStatus.OK,
      };
    } catch (error) {
      throw new HttpException(
        {
          ok: false,
          message: `Error on remove debt, ${error}`,
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}

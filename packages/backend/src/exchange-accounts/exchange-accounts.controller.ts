import { Body, Controller, Get, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { CreateExchangeAccountRequestBodyDto } from 'src/exchange-accounts/dto/create-exchange-account/create-exchange-account-request-body.dto';
import { CreateExchangeAccountResponseBodyDto } from 'src/exchange-accounts/dto/create-exchange-account/create-exchange-account-response-body.dto';
import { GetExchangeAccountsResponseBodyDto } from 'src/exchange-accounts/dto/get-exchange-accounts/get-exchange-accounts-response-body.dto';
import { ExchangeAccountsService } from 'src/exchange-accounts/exchange-accounts.service';

@Controller({
  path: 'exchange-accounts',
})
@ApiTags('Exchange Accounts')
export class ExchangeAccountsController {
  constructor(private readonly accountsService: ExchangeAccountsService) {}

  @Get('/accounts')
  async getAccounts(
    @FirebaseUser() user: IUser,
  ): Promise<GetExchangeAccountsResponseBodyDto> {
    const exchangeAccounts = await this.accountsService.getExchangeAccounts(
      user.uid,
    );

    return {
      exchangeAccounts,
    };
  }

  @Post('/account')
  async createAccount(
    @FirebaseUser() user: IUser,
    @Body() body: CreateExchangeAccountRequestBodyDto,
  ): Promise<CreateExchangeAccountResponseBodyDto> {
    const exchangeAccount = await this.accountsService.createExchangeAccount(
      body,
      user,
    );

    return {
      exchangeAccount,
    };
  }
}

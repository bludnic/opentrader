import { ExchangeAccountEndpoint } from '@bifrost/swagger/dist/endpoints/exchange-account';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';
import { CreateExchangeAccountRequestBodyDto } from 'src/exchange-accounts/dto/create-exchange-account/create-exchange-account-request-body.dto';
import { CreateExchangeAccountResponseBodyDto } from 'src/exchange-accounts/dto/create-exchange-account/create-exchange-account-response-body.dto';
import { GetExchangeAccountResponseBodyDto } from 'src/exchange-accounts/dto/get-exchange-account/get-exchange-account-response-body.dto';
import { GetExchangeAccountsResponseBodyDto } from 'src/exchange-accounts/dto/get-exchange-accounts/get-exchange-accounts-response-body.dto';
import { UpdateExchangeAccountRequestBodyDto } from 'src/exchange-accounts/dto/update-exchange-account/update-exchange-account-request-body.dto';
import { UpdateExchangeAccountResponseBodyDto } from 'src/exchange-accounts/dto/update-exchange-account/update-exchange-account-response-body.dto';
import { ExchangeAccountsService } from 'src/exchange-accounts/exchange-accounts.service';

@Controller({
  path: 'exchange-accounts',
})
@ApiTags(ExchangeAccountEndpoint.tagName())
export class ExchangeAccountsController {
  constructor(private readonly accountsService: ExchangeAccountsService) {}

  @Get('/accounts')
  @ApiOperation(ExchangeAccountEndpoint.operation('getExchangeAccounts'))
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

  @Get('/account/:id')
  @ApiOperation(ExchangeAccountEndpoint.operation('getExchangeAccount'))
  async getAccount(
    @Param('id') accountId: string,
  ): Promise<GetExchangeAccountResponseBodyDto> {
    const exchangeAccount = await this.accountsService.getExchangeAccount(
      accountId,
    );

    return {
      exchangeAccount,
    };
  }

  @Put('/account/:id')
  @ApiOperation(ExchangeAccountEndpoint.operation('updateExchangeAccount'))
  async updateAccount(
    @Param('id') accountId: string,
    @Body() body: UpdateExchangeAccountRequestBodyDto,
  ): Promise<UpdateExchangeAccountResponseBodyDto> {
    const exchangeAccount = await this.accountsService.updateExchangeAccount(
      body,
      accountId,
    );

    return {
      exchangeAccount,
    };
  }

  @Post('/account')
  @ApiOperation(ExchangeAccountEndpoint.operation('createExchangeAccount'))
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

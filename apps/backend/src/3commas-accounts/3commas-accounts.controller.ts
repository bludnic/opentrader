import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ThreeCommasAccountsService } from './3commas-accounts.service';
import { Create3CommasAccountRequestBodyDto } from './dto/create-account/create-3commas-account-request-body.dto';
import { Create3CommasAccountResponseBodyDto } from './dto/create-account/create-3commas-account-response-body.dto';
import { Get3CommasAccountResponseBodyDto } from './dto/get-account/get-3commas-account-response-body.dto';
import { Get3CommasAccountsResponseBodyDto } from './dto/get-accounts/get-3commas-accounts-response-body.dto';
import { Update3CommasAccountRequestBodyDto } from './dto/update-account/update-3commas-account-request-body.dto';
import { Update3CommasAccountResponseBodyDto } from './dto/update-account/update-3commas-account-response-body.dto';
import { FirebaseUser } from 'src/common/decorators/firebase-user.decorator';
import { IUser } from 'src/core/db/types/entities/users/user/user.interface';

@Controller({
  path: '3commas-accounts',
})
@ApiTags('3Commas Accounts')
export class ThreeCommasAccountsController {
  constructor(private readonly accountsService: ThreeCommasAccountsService) {}

  @Get('/accounts')
  @ApiOperation({
    operationId: 'get3CommasAccounts',
  })
  async getAccounts(
    @FirebaseUser() user: IUser,
  ): Promise<Get3CommasAccountsResponseBodyDto> {
    const accounts = await this.accountsService.getAccounts(user.uid);

    return {
      accounts,
    };
  }

  @Get('/account/:id')
  @ApiOperation({
    operationId: 'get3CommasAccount',
  })
  async getAccount(
    @Param('id') accountId: string,
  ): Promise<Get3CommasAccountResponseBodyDto> {
    const account = await this.accountsService.getAccount(accountId);

    return {
      account,
    };
  }

  @Put('/account/:id')
  @ApiOperation({
    operationId: 'update3CommasAccount',
  })
  async updateAccount(
    @Param('id') accountId: string,
    @Body() body: Update3CommasAccountRequestBodyDto,
  ): Promise<Update3CommasAccountResponseBodyDto> {
    const account = await this.accountsService.updateAccount(body, accountId);

    return {
      account,
    };
  }

  @Post('/account')
  @ApiOperation({
    operationId: 'create3CommasAccount',
  })
  async createAccount(
    @FirebaseUser() user: IUser,
    @Body() body: Create3CommasAccountRequestBodyDto,
  ): Promise<Create3CommasAccountResponseBodyDto> {
    const account = await this.accountsService.createAccount(body, user);

    return {
      account,
    };
  }
}

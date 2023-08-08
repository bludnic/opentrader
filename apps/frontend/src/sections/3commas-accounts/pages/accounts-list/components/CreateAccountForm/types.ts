import {
  Create3CommasAccountRequestBodyDto,
  Update3CommasAccountRequestBodyDto,
} from "src/lib/bifrost/client";

export type CreateAccountFormValues = Pick<
  Create3CommasAccountRequestBodyDto,
  "id" | "name"
> &
  Create3CommasAccountRequestBodyDto["credentials"];

export type UpdateAccountFormValues = Pick<
  Update3CommasAccountRequestBodyDto,
  "name"
> &
  Update3CommasAccountRequestBodyDto["credentials"];

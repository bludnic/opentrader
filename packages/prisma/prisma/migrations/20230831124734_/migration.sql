-- AlterTable
CREATE SEQUENCE exchangeaccount_id_seq;
ALTER TABLE "ExchangeAccount" ALTER COLUMN "id" SET DEFAULT nextval('exchangeaccount_id_seq');
ALTER SEQUENCE exchangeaccount_id_seq OWNED BY "ExchangeAccount"."id";

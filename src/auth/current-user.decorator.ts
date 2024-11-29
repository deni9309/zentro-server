import { createParamDecorator, ExecutionContext } from '@nestjs/common'

const getCurrentUserByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest().user

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
)

const getRequestHeaderByContext = (context: ExecutionContext) =>
  context.switchToHttp().getRequest().headers['authorization']

export const AuthorizationHeader = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getRequestHeaderByContext(context),
)
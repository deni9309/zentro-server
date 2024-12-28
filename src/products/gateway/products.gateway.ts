import {
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'

import { AuthService } from '../../auth/auth.service'

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ProductsGateway {
  constructor(private readonly authService: AuthService) {}

  @WebSocketServer()
  private readonly server: Server

  handleProductUpdated() {
    this.server.emit('productUpdated')
  }

  async handleConnection(client: Socket) {
    try {
      await this.authService.verifyToken(
        client.handshake.auth.Authentication.value,
      )
    } catch (error) {
      console.error(
        'Error handling client connection - Unauthorized',
        error.message,
        error.stack,
      )
      throw new WsException('Unauthorized')
    }
  }
}

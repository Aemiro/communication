import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import * as socketIo from 'socket.io';
import { User } from './user';
import {
  SendBroadcastNotificationDto,
  SendNotificationToRolesDto,
  SendNotificationToRoomDto,
  SendNotificationToUserDto,
  SendNotificationToUsersDto,
} from './notification.dto';
import { error } from 'console';
@WebSocketGateway({
  transports: ['websocket'],
  connectionStateRecovery: {
    // Duration in milliseconds (optional, default is 2 minutes)
    maxDisconnectionDuration: 2 * 60 * 1000,

    // Define whether we need to skip middlewares (optional)
    skipMiddlewares: false,
  },
})
export class SocketGateway implements OnGatewayDisconnect, OnGatewayConnection {
  @WebSocketServer()
  server: socketIo.Server;
  connectedDevices: User[] = [];
  handleConnection(client: socketIo.Socket) {
    const handshakeData = client?.handshake?.query;
    const connectedUser: User = {
      id: handshakeData?.id ? handshakeData?.id.toString() : null,
      name: handshakeData?.name ? handshakeData?.name.toString() : null,
      gender: handshakeData?.gender ? handshakeData?.gender.toString() : null,
      phone: handshakeData?.phone ? handshakeData?.phone.toString() : null,
      email: handshakeData?.email ? handshakeData?.email.toString() : null,
      windowNumber: handshakeData?.windowNumber
        ? handshakeData?.windowNumber.toString()
        : null,
      branchId: handshakeData?.branchId
        ? handshakeData?.branchId.toString()
        : null,
      sessionId: client?.id,
      type: handshakeData?.type.toString(),
      rooms: [],
    };
    connectedUser.roles = [];
    if (handshakeData?.roles) {
      if (Array.isArray(handshakeData?.roles)) {
        connectedUser.roles = handshakeData?.roles;
      } else {
        connectedUser.roles = handshakeData?.roles.toString().split(',');
      }
    }

    console.log('Connected User ', connectedUser, client.rooms);
    this.connectedDevices.push(connectedUser);
    client.broadcast.emit('user-connected', {
      message: `${connectedUser.name} Connected to Notification Service`,
      ...connectedUser,
    });
    if (connectedUser.branchId) {
      this.joinRoom(connectedUser.id, connectedUser.branchId)
        .then((res) => {
          console.log(res);
        })
        .catch((error) => {
          console.error(error?.message);
        });
    }
  }
  handleDisconnect(client: socketIo.Socket) {
    console.log('handleDisconnect');
    //console.log('disconnect', client);
    const handshakeData = client?.handshake?.query;
    const connectedUser: User = {
      id: handshakeData?.id ? handshakeData?.id.toString() : null,
      name: handshakeData?.name ? handshakeData?.name.toString() : null,
      gender: handshakeData?.gender ? handshakeData?.gender.toString() : null,
      phone: handshakeData?.phone ? handshakeData?.phone.toString() : null,
      email: handshakeData?.email ? handshakeData?.email.toString() : null,
      windowNumber: handshakeData?.windowNumber
        ? handshakeData?.windowNumber.toString()
        : null,
      branchId: handshakeData?.branchId
        ? handshakeData?.branchId.toString()
        : null,
      sessionId: client?.id,
      type: handshakeData?.type.toString(),
      rooms: [],
    };
    client.broadcast.emit('user-disconnected', {
      message: `${connectedUser.name} Disconnected from Notification Service`,
      ...connectedUser,
    });
    this.connectedDevices = this.connectedDevices.filter((d: any) => {
      return d.sessionId !== client.id;
    });
  }
  @SubscribeMessage('send-broadcast-notification')
  async handleBroadcastNotification(
    @ConnectedSocket() client: socketIo.Socket,
    @MessageBody() data: SendBroadcastNotificationDto,
  ): Promise<void> {
    console.log('send-broadcast-notification', data);
    const connectedUser = this.connectedDevices.find(
      (d: User) => d.sessionId === client.id,
    );
    if (connectedUser) {
    }
    client.broadcast.emit('broadcast-notification', data);
  }
  @SubscribeMessage('send-user-notification')
  async handleNotificationToUser(
    @ConnectedSocket() client: socketIo.Socket,
    @MessageBody() data: SendNotificationToUserDto,
  ): Promise<void> {
    console.log('send-user-notification', data);
    const connectedUser = this.connectedDevices.find(
      (d: User) => d.sessionId === client.id,
    );
    if (connectedUser) {
    }
    const receiverUser = this.connectedDevices.find(
      (d: User) => d.id === data.receiverId,
    );
    if (receiverUser) {
      const clients = await this.server.fetchSockets();
      const receiver = clients.find((client) => {
        return client.id === receiverUser.sessionId;
      });
      if (receiver) {
        receiver.emit('user-notification', data);
      }
    }
  }
  @SubscribeMessage('send-room-notification')
  async handleNotificationToRooms(
    @ConnectedSocket() client: socketIo.Socket,
    @MessageBody() data: SendNotificationToRoomDto,
  ): Promise<void> {
    console.log('send-room-notification', data);
    const senderUser = this.connectedDevices.find(
      (d: User) => d.sessionId === client.id,
    );
    if (senderUser) {
    }
    this.server.to(data.room).emit('room-notification', data);
  }
  @SubscribeMessage('send-notification-by-roles')
  async handleNotificationByRoles(
    @ConnectedSocket() client: socketIo.Socket,
    @MessageBody() data: SendNotificationToRolesDto,
  ): Promise<void> {
    console.log('send-notification-by-roles', data);
    const senderUser = this.connectedDevices.find(
      (d: User) => d.sessionId === client.id,
    );
    if (senderUser) {
    }
    const receiverUsers = this.connectedDevices.filter((d: User) => {
      return data.roles.map((role: string) => {
        return d.roles.includes(role);
      });
    });
    if (receiverUsers.length > 0) {
      const clients = await this.server.fetchSockets();
      receiverUsers.forEach((receiverUser: User) => {
        const receiver = clients.find((client) => {
          return client.id === receiverUser.sessionId;
        });
        if (receiver) {
          receiver.emit('user-notification', data);
        }
      });
    }
  }

  @SubscribeMessage('send-notification-to-users')
  async handleNotificationToUsers(
    @ConnectedSocket() client: socketIo.Socket,
    @MessageBody() data: SendNotificationToUsersDto,
  ): Promise<void> {
    console.log('send-notification-to-users', data);
    const senderUser = this.connectedDevices.find(
      (d: User) => d.sessionId === client.id,
    );
    if (senderUser) {
    }
    const receiverUsers = this.connectedDevices.filter((d: User) => {
      // return data.receivers.includes(d.id);
      return data.receivers.forEach((receiver) => receiver.id === d.id);
    });
    if (receiverUsers.length > 0) {
      const clients = await this.server.fetchSockets();
      receiverUsers.forEach((receiverUser: User) => {
        const receiver = clients.find((client) => {
          return client.id === receiverUser.sessionId;
        });
        if (receiver) {
          receiver.emit('user-notification', data);
        }
      });
    }
  }

  // functions

  async sendBroadcastNotification(
    eventName: string,
    data: SendBroadcastNotificationDto,
  ): Promise<void> {
    console.log(eventName, data);
    const clients = await this.server.fetchSockets();
    // client.broadcast.emit('broadcast-notification', data);
    if (clients.length > 0) {
      clients.forEach((client) => {
        client.emit(eventName, data);
      });
    }
  }
  async sendNotificationToUser(
    eventName: string,
    data: SendNotificationToUserDto,
  ): Promise<void> {
    console.log(eventName, data);
    const receiverUsers = this.connectedDevices.filter(
      (d: User) => d.id === data.receiverId,
    );
    if (receiverUsers.length > 0) {
      for (const receiverUser of receiverUsers) {
        const clients = await this.server.fetchSockets();
        const receiver = clients.find((client) => {
          return client.id === receiverUser.sessionId;
        });
        if (receiver) {
          receiver.emit(eventName, data);
        }
      }
    }
  }
  async sendNotificationByRoles(
    eventName: string,
    data: SendNotificationToRolesDto,
  ): Promise<void> {
    console.log(eventName, data);
    if (data.roles.length > 0) {
      const clients = await this.server.fetchSockets();
      for (const role of data.roles) {
        const receiverUsers = this.connectedDevices.filter((d: User) => {
          return d.roles.includes(role);
        });

        console.log(eventName, receiverUsers);
        if (receiverUsers.length > 0) {
          receiverUsers.forEach((receiverUser: User) => {
            const receiver = clients.find((client) => {
              return client.id === receiverUser.sessionId;
            });
            if (receiver) {
              receiver.emit(eventName, data);
            }
          });
        }
      }
    }
  }

  async sendNotificationToUsers(
    eventName: string,
    data: SendNotificationToUsersDto,
  ): Promise<void> {
    console.log(eventName, data);
    const ids = data.receivers.map((receiver) => receiver.id);
    const receiverUsers = this.connectedDevices.filter((d: User) =>
      ids.includes(d.id),
    );

    if (receiverUsers.length > 0) {
      const clients = await this.server.fetchSockets();
      receiverUsers.forEach((receiverUser: User) => {
        const receiver = clients.find((client) => {
          return client.id === receiverUser.sessionId;
        });
        if (receiver) {
          receiver.emit(eventName, data);
        }
      });
    }
  }

  async countConnectedUsers(receiverId: string) {
    const users = this.connectedDevices.filter(
      (user) => user.id === receiverId,
    );
    //const clients = await this.server.fetchSockets();
    return users.length;
  }

  async joinRoom(userId: string, branchId: string): Promise<void> {
    const connectedUser = this.connectedDevices.find(
      (d: User) => d.id === userId,
    );
    const roomId = `branch:${branchId}`;

    const clients = await this.server.fetchSockets();
    const client = clients.find((c) => {
      return c.id === connectedUser.sessionId;
    });
    if (client) {
      client.join(roomId);
      const existIndex = this.connectedDevices.findIndex(
        (element) => element.sessionId === client.id,
      );
      if (!connectedUser.rooms) connectedUser.rooms = [];
      connectedUser.rooms.push(roomId);
      this.connectedDevices[existIndex] = connectedUser;
      this.server
        .to(roomId)
        .emit(
          'broadcast-notification',
          `${connectedUser.name} Joined room ${roomId}`,
        );
    }
  }
  async handleLeaveRoom(userId: string, branchId: string): Promise<void> {
    const connectedUser = this.connectedDevices.find(
      (d: User) => d.id === userId,
    );
    const roomId = `branch:${branchId}`;

    const clients = await this.server.fetchSockets();
    const client = clients.find((c) => {
      return c.id === connectedUser.sessionId;
    });
    if (client) {
      client.leave(roomId);
      const existIndex = this.connectedDevices.findIndex(
        (element) => element.sessionId === client.id,
      );
      if (connectedUser.rooms && connectedUser.rooms.length > 0) {
        connectedUser.rooms = connectedUser.rooms.filter((r) => r !== roomId);
      }
      this.connectedDevices[existIndex] = connectedUser;
      this.server
        .to(roomId)
        .emit(
          'broadcast-notification',
          `${connectedUser.name} left room ${roomId}`,
        );
    }
  }
  async isUserOnline(userId: string): Promise<boolean> {
    if (this.connectedDevices.length === 0) return false;
    const user = this.connectedDevices.find((d: User) => d.id === userId);
    if (user) {
      return true;
    }
    return false;
  }
  async sendToRoom(room: string, event: string, payload: any) {
    const roomId = this.server.sockets.adapter.rooms.get(room);

    if (roomId === undefined) {
      for (const connectedUser of this.connectedDevices) {
        const clients = await this.server.fetchSockets();
        const client = clients.find((c) => {
          return c.id === connectedUser.sessionId;
        });
        if (client) {
          client.join(room);
          const existIndex = this.connectedDevices.findIndex(
            (element) => element.sessionId === client.id,
          );
          if (!connectedUser.rooms) connectedUser.rooms = [];
          connectedUser.rooms.push(room);
          this.connectedDevices[existIndex] = connectedUser;
          this.server
            .to(room)
            .emit(
              'broadcast-notification',
              `${connectedUser.name} Joined room ${room}`,
            );
        }
      }
    }
    this.server.to(room).emit(event, payload);
  }
}

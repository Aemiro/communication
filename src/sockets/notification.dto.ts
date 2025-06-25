import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class SendBroadcastNotificationDto {
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  sender: string;
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  data?: {
    [name: string]: any;
  };
  @ApiProperty()
  url?: string;
  @ApiProperty()
  isExternalUrl?: boolean = false;
}
export class SendNotificationToUserDto {
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  sender: string;
  @ApiProperty()
  senderId?: string;
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsNotEmpty()
  receiverId: string;
  @ApiProperty()
  @IsNotEmpty()
  receiver: string;
  @ApiProperty()
  data?: {
    [name: string]: any;
  };
  @ApiProperty()
  url?: string;
  @ApiProperty()
  isExternalUrl?: boolean = false;
}
export class SendNotificationToRoomDto {
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  sender: string;
  @ApiProperty()
  senderId?: string;
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  room: string;
  @ApiProperty()
  roomId: string;
  @ApiProperty()
  data?: {
    [name: string]: any;
  };
  @ApiProperty()
  url?: string;
  @ApiProperty()
  isExternalUrl?: boolean = false;
}
export class SendNotificationToRolesDto {
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  sender: string;
  @ApiProperty()
  senderId?: string;
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsNotEmpty()
  roles: string[];
  @ApiProperty()
  data?: {
    [name: string]: any;
  };
  @ApiProperty()
  url?: string;
  @ApiProperty()
  isExternalUrl?: boolean = false;
}

export class SendNotificationToUsersDto {
  @ApiProperty()
  @IsNotEmpty()
  message: string;
  @ApiProperty()
  @IsNotEmpty()
  sender: string;
  @ApiProperty()
  senderId?: string;
  @ApiProperty()
  @IsNotEmpty()
  subject: string;
  @ApiProperty()
  @IsNotEmpty()
  receivers: Receiver[];
  @ApiProperty()
  data?: {
    [name: string]: any;
  };
  @ApiProperty()
  url?: string;
  @ApiProperty()
  isExternalUrl?: boolean = false;
}
export class Receiver {
  @ApiProperty()
  @IsNotEmpty()
  id: string;
  @ApiProperty()
  @IsNotEmpty()
  name: string;
}

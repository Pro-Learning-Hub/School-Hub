import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from './events.gateway';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.TOKEN_SECRET_KEY || 'secret',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}

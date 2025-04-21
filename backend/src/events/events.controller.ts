/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// src/events/events.controller.ts
import { Controller, Get, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  reminderTime?: Date;
}

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  createEvent(@Body() event: Event) {
    this.eventsService.createEvent(event);
    return { message: 'Event added successfully' };
  }

  @Get()
  getEvents() {
    return this.eventsService.getEvents();
  }
}

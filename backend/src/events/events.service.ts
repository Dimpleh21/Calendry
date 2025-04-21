/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
// events.service.ts

import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';

// In-memory data store
const events: {
  id: number;
  title: string;
  start: Date;
  end: Date;
  reminderTime?: Date;
}[] = [];

@Injectable()
export class EventsService {
  // Modify to accept the proper DTO
  createEvent(createEventDto: CreateEventDto) {
    const newEvent = {
      ...createEventDto,
      id: events.length + 1,
      start: new Date(createEventDto.start),
      end: new Date(createEventDto.end),
      reminderTime: createEventDto.reminderTime
        ? new Date(createEventDto.reminderTime)
        : undefined,
    };

    events.push(newEvent);
    return newEvent;
  }

  // Get all events
  getEvents() {
    return events;
  }
}

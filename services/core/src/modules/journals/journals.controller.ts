import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import {
  JOURNAL_MESSAGE_PATTERNS,
  CreateJournalDto,
  UpdateJournalDto,
} from "@nexous-accounting/types";
import { JournalsService } from "./journals.service";

@Controller("journals")
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.CREATE_JOURNAL)
  createJournal(@Payload() dto: CreateJournalDto) {
    return this.journalsService.create(dto);
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.UPDATE_JOURNAL)
  updateJournal(@Payload() payload: { id: string; data: UpdateJournalDto }) {
    return this.journalsService.updateJournal(payload.id, payload.data);
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.LIST_JOURNAL)
  listJournal() {
    return this.journalsService.listJournal();
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.GET_JOURNAL)
  getJournalByCode(@Payload() id: string) {
    return this.journalsService.getJournalById(id);
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.DELETE_JOURNAL)
  deleteJournal(@Payload() id: string) {
    return this.journalsService.deleteJournal(id);
  }
}

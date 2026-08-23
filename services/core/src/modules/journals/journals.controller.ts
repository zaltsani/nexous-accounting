import { Controller } from "@nestjs/common";
import { MessagePattern, Payload } from "@nestjs/microservices";
import { CreateJournalDto, UpdateJournalDto } from "@nexous-accounting/common";
import { JOURNAL_MESSAGE_PATTERNS } from "@nexous-accounting/types";
import { JournalsService } from "./journals.service";

@Controller("journals")
export class JournalsController {
  constructor(private readonly journalsService: JournalsService) {}

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.CREATE_JOURNAL)
  createJournal(@Payload() dto: CreateJournalDto) {
    return this.journalsService.create(dto);
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.UPDATE_JOURNAL)
  updateJournal(@Payload() payload: { code: string; data: UpdateJournalDto }) {
    return this.journalsService.updateJournal(payload.code, payload.data);
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.LIST_JOURNAL)
  listJournal() {
    return this.journalsService.listJournal();
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.GET_JOURNAL)
  getJournalByCode(@Payload() code: string) {
    return this.journalsService.getJournalByCode(code);
  }

  @MessagePattern(JOURNAL_MESSAGE_PATTERNS.DELETE_JOURNAL)
  deleteJournal(@Payload() code: string) {
    return this.journalsService.deleteJournal(code);
  }
}

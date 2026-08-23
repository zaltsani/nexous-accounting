import { Injectable } from "@nestjs/common";
import { CreateJournalDto, UpdateJournalDto } from "@nexous-accounting/common";
import { PrismaService } from "src/database/prisma.service";

@Injectable()
export class JournalsService {
  constructor(private readonly db: PrismaService) {}

  async create(data: CreateJournalDto) {
    return this.db.journal.create({
      data,
    });
  }

  async listJournal() {
    return this.db.journal.findMany();
  }

  async getJournalByCode(code: string) {
    return this.db.journal.findUniqueOrThrow({
      where: { code },
    });
  }

  async updateJournal(code: string, data: UpdateJournalDto) {
    return this.db.journal.update({
      where: { code },
      data,
    });
  }

  async deleteJournal(code: string) {
    return this.db.journal.delete({
      where: { code },
    });
  }
}

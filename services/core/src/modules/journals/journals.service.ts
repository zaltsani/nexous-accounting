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

  async getJournalById(id: string) {
    return this.db.journal.findUniqueOrThrow({
      where: { id },
    });
  }

  async getJournalByCode(code: string) {
    return this.db.journal.findUniqueOrThrow({
      where: { code },
    });
  }

  async updateJournal(id: string, data: UpdateJournalDto) {
    return this.db.journal.update({
      where: { id },
      data,
    });
  }

  async deleteJournal(id: string) {
    return this.db.journal.delete({
      where: { id },
    });
  }
}

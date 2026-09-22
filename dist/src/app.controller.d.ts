import { PrismaService } from './prisma/prisma.service';
export declare class AppController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getHello(): string;
    testDb(): Promise<{
        status: string;
        message: string;
        totalUsers: number;
    }>;
}

import { prisma } from '@/lib/prisma';
import 'dotenv/config';
import { execSync } from 'node:child_process';
import { randomUUID } from "node:crypto";
import { URL } from "node:url";
import { Environment } from "vitest";

function generateDatabaseURL(schema: string) {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);

  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  async setup() {
    const schema = randomUUID();

    // Criando a URL do banco de dados com o schema gerado
    const DATABASE_URL = generateDatabaseURL(schema);

    // Substituindo a variável de ambiente DATABASE_URL
    process.env.DATABASE_URL = DATABASE_URL;

    // Executando os comandos de criação do banco de dados
    execSync(`npx prisma migrate deploy --preview-feature --schema=./prisma/schema.prisma`);

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schema}" CASCADE;`);
        await prisma.$disconnect();
      },
    };
  }
}
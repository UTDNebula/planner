import { PrismaClient, TemplateDataType } from '@prisma/client';

import dummyTemplate from '../src/data/degree_template.json';
const prisma = new PrismaClient();

interface TemplateDataItems {
  name: string;
  type: TemplateDataType;
}

type RawTemplateData = (string | { options: string })[];

async function main() {
  const annoyed = dummyTemplate as unknown as { [key: string]: RawTemplateData[] };
  const orderedTemplate: { [key: string]: RawTemplateData[] } = Object.keys(dummyTemplate)
    .sort()
    .reduce((obj: { [key: string]: RawTemplateData[] }, key) => {
      obj[key] = annoyed[key];
      return obj;
    }, {});

  const templatesFromDb = await prisma.template.findMany();
  let templatesToAdd: Array<string> = [];
  if (templatesFromDb.length !== Object.keys(orderedTemplate).length) {
    templatesToAdd = Object.keys(orderedTemplate).filter(
      (item) => !templatesFromDb.some((dbItem) => dbItem.name === item),
    );
  }

  if (templatesToAdd.length > 0) {
    for (const key of templatesToAdd) {
      const value = orderedTemplate[key];
      const template = await prisma.template.create({
        data: {
          name: key,
        },
      });
      for (let i = 0; i < value.length; i++) {
        const templateDataItems: Array<TemplateDataItems> = [];
        for (let j = 0; j < value[i].length; j++) {
          if (typeof value[i][j] === 'object') {
            templateDataItems.push({
              name: (value[i][j] as { options: string }).options + ' Course',
              type: 'OPTIONAL',
            });
          } else {
            templateDataItems.push({ name: value[i][j] as string, type: 'CORE' });
          }
        }
        await prisma.templateData.create({
          data: {
            semester: i + 1,
            items: {
              create: [...templateDataItems],
            },
            template: {
              connect: { id: template.id },
            },
          },
        });
      }
      console.log(`Created template ${key}`);
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

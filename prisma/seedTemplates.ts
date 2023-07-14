import { Prisma, PrismaClient } from '@prisma/client';
import { ObjectID, ObjectId } from 'bson';

import dummyTemplate from '../src/data/degree_template.json';

type RawTemplateData = (string | { options: string })[];

export const seedTemplates = async (prisma: PrismaClient) => {
  const annoyed = dummyTemplate as unknown as { [key: string]: RawTemplateData[] };
  const orderedTemplate: { [key: string]: RawTemplateData[] } = Object.keys(dummyTemplate)
    .sort()
    .reduce((obj: { [key: string]: RawTemplateData[] }, key) => {
      obj[key] = annoyed[key];
      return obj;
    }, {});

  const templatesFromDb = await prisma.template.findMany();
  let templatesToAdd: Array<{ id: string; name: string }> = [];
  if (templatesFromDb.length !== Object.keys(orderedTemplate).length) {
    templatesToAdd = Object.keys(orderedTemplate)
      .filter((item) => !templatesFromDb.some((dbItem) => dbItem.name === item))
      .map((name) => ({ id: new ObjectId().toString(), name }));
  }

  const templateDataArray: Array<Prisma.TemplateDataCreateManyInput> = [];

  if (templatesToAdd.length > 0) {
    for (const { id: templateId, name } of templatesToAdd) {
      const value = orderedTemplate[name];

      for (let i = 0; i < value.length; i++) {
        // Create TemplateData ID
        const id = new ObjectID().toString();

        const templateDataItems: Array<Prisma.TemplateItemCreateManyInput> = [];
        for (let j = 0; j < value[i].length; j++) {
          if (typeof value[i][j] === 'object') {
            templateDataItems.push({
              name: (value[i][j] as { options: string }).options + ' Course',
              type: 'OPTIONAL',
              templateDataId: id,
            });
          } else {
            templateDataItems.push({
              templateDataId: id,
              name: value[i][j] as string,
              type: 'CORE',
            });
          }
        }

        templateDataArray.push({
          id: id,
          semester: i + 1,
          templateId,
        });

        await prisma.templateItem.createMany({ data: templateDataItems });
      }
    }
  }

  if (templatesToAdd.length && templateDataArray) {
    await prisma.template.createMany({ data: templatesToAdd });
    await prisma.templateData.createMany({ data: templateDataArray });
  }
};

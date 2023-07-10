import { Prisma, PrismaClient, Template } from '@prisma/client';
import { ObjectID } from 'bson';

import degreeTemplates from '../src/data/degree_template.json';

type UnwrapArray<T> = T extends Array<infer U> ? U : T;
type TemplateItem = UnwrapArray<UnwrapArray<UnwrapArray<typeof degreeTemplates>['Biology(BS)']>>;

export async function seedTemplates(prisma: PrismaClient) {
  const existingTemplates = await prisma.template.findMany();

  console.log('attempting to find new templates');
  const { newTemplates, newTemplateSemesters, newTemplateItems } = findNewTemplates(
    existingTemplates,
    degreeTemplates,
  );
  console.log('found new templates: ', newTemplates.map((t) => t.name).join(', '));

  console.log('attempting to create new templates');
  if (newTemplates.length > 0) {
    await prisma.template.createMany({ data: newTemplates });
    await prisma.templateData.createMany({ data: newTemplateSemesters });
    await prisma.templateItem.createMany({ data: newTemplateItems });
  }
}

function findNewTemplates(
  existingTemplates: Template[],
  allTemplates: Partial<typeof degreeTemplates>,
) {
  const newTemplates: { id: string; name: string }[] = [];
  const newTemplateSemesters: Prisma.TemplateDataCreateManyInput[] = [];
  const newTemplateItems: Prisma.TemplateItemCreateManyInput[] = [];

  for (const [templateName, templateData] of Object.entries(allTemplates)) {
    // Skip if template is already in database.
    if (existingTemplates.find((t) => t.name === templateName)) {
      console.warn(`template ${templateName} already exists, skipping`);
      continue;
    }

    // Generate new template.
    const templateId = new ObjectID().toString();
    newTemplates.push({ id: templateId, name: templateName });

    for (const [semesterIndex, templateSemester] of templateData.entries()) {
      // Generate template semesters.
      const templateSemesterId = new ObjectID().toString();
      newTemplateSemesters.push(
        createTemplateSemester(semesterIndex + 1, templateSemesterId, templateId),
      );

      // Generate template semester items.
      for (const courseOrOption of templateSemester) {
        newTemplateItems.push(createTemplateItem(courseOrOption, templateSemesterId));
      }
    }
  }

  return {
    newTemplates,
    newTemplateSemesters,
    newTemplateItems,
  };
}

function createTemplateSemester(
  index: number,
  semesterTemplateId: string,
  templateId: string,
): Prisma.TemplateDataCreateManyInput {
  return {
    id: semesterTemplateId,
    templateId: templateId,
    semester: index,
  };
}

function createTemplateItem(
  item: TemplateItem,
  templateSemesterId: string,
): Prisma.TemplateItemCreateManyInput {
  return typeof item === 'string'
    ? {
        templateDataId: templateSemesterId,
        name: item,
        type: 'CORE',
      }
    : {
        name: item.options + ' Course',
        type: 'OPTIONAL',
        templateDataId: templateSemesterId,
      };
}

export const TEST_ONLY = { findNewTemplates };

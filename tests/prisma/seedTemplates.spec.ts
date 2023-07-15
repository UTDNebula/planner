import { describe, test, expect } from '@jest/globals';
import { TEST_ONLY } from '../../prisma/seedTemplates';
import { Template } from '@prisma/client';
import degreeTemplates from '../../src/data/degree_template.json';
const { findNewTemplates } = TEST_ONLY;

describe('finding new templates during seeding', () => {
  const testCases: {
    desc: string;
    existingTemplates: Template[];
    allTemplates: Partial<typeof degreeTemplates>;
    wantTemplateCount: number;
    wantTemplateSemestersCount: number;
    wantTemplateItemsCount: number;
  }[] = [
    {
      desc: 'no existing templates',
      existingTemplates: [],
      allTemplates: {
        'Accounting(BS)': [['HIST 1301']],
        'Actuarial Science(BS)': [['HIST 1302']],
        'Arts, Technology, and Emerging Communication(BA)': [],
      },
      wantTemplateCount: 3,
      wantTemplateSemestersCount: 2,
      wantTemplateItemsCount: 2,
    },
    {
      desc: '2/3 existing templates',
      existingTemplates: [
        {
          id: '1',
          name: 'Accounting(BS)',
        },
        {
          id: '1',
          name: 'Actuarial Science(BS)',
        },
      ],
      allTemplates: {
        'Accounting(BS)': [],
        'Actuarial Science(BS)': [['HIST 1301']],
        'Arts, Technology, and Emerging Communication(BA)': [['AHST 1301']],
      },
      wantTemplateCount: 1,
      wantTemplateItemsCount: 1,
      wantTemplateSemestersCount: 1,
    },
    {
      desc: 'all templates exist',
      existingTemplates: [
        {
          id: '1',
          name: 'Accounting(BS)',
        },
        {
          id: '1',
          name: 'Actuarial Science(BS)',
        },
      ],
      allTemplates: {
        'Accounting(BS)': [],
        'Actuarial Science(BS)': [['HIST 1301']],
      },
      wantTemplateCount: 0,
      wantTemplateItemsCount: 0,
      wantTemplateSemestersCount: 0,
    },
  ];

  test.each(testCases)('$desc', (tc) => {
    const { newTemplates, newTemplateItems, newTemplateSemesters } = findNewTemplates(
      tc.existingTemplates,
      tc.allTemplates,
    );
    expect(newTemplates.length).toBe(tc.wantTemplateCount);
    expect(newTemplateSemesters.length).toBe(tc.wantTemplateSemestersCount);
    expect(newTemplateItems.length).toBe(tc.wantTemplateItemsCount);
    if (newTemplateSemesters.length > 0) {
      expect(newTemplateSemesters[0].templateId).toBe(newTemplates[0].id);
    }
    if (newTemplateItems.length > 0) {
      expect(newTemplateItems[0].templateDataId).toBe(newTemplateSemesters[0].id);
    }
  });
});

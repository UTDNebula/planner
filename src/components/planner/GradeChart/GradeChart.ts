import _ from 'lodash';

// Credits to UTDGrades for these helper functions

export const reformatArray = (array) => {
  const result = [];

  for (const property in array) {
    if (array.hasOwnProperty(property)) {
      result.push({
        key: property,
        value: parseInt(array[property]),
      });
    }
  }

  return result;
};

export const sortByGrades = (grades) => {
  const order = {
    'A+': 100,
    A: 95,
    'A-': 92,
    'B+': 89,
    B: 85,
    'B-': 82,
    'C+': 79,
    C: 75,
    'C-': 72,
    'D+': 68,
    D: 65,
    'D-': 62,
    F: 50,
    W: 40,
  };

  const sorted = _.sortBy(grades, (o) => {
    return order[o.key];
  });
  return _.reverse(sorted);
};

export const splitGradeData = (grades) => {
  const keys = [];
  const values = [];

  for (let i = 0; i < grades.length; i++) {
    keys.push(grades[i].key);
    values.push(grades[i].value);
  }

  return { keys, values };
};

export const getGradeColors = (keys) => {
  const colorMap = {
    'A+': 'rgb(45, 179, 63)',
    A: 'rgb(48, 199, 55)',
    'A-': 'rgb(107, 212, 15)',
    'B+': 'rgb(147, 209, 13)',
    B: 'rgb(205, 255, 79)',
    'B-': 'rgb(255, 225, 77)',
    'C+': 'rgb(255, 208, 54)',
    C: 'rgb(255, 173, 51)',
    'C-': 'rgb(255, 112, 77)',
    'D+': 'rgb(245, 24, 169)',
    D: 'rgb(160, 30, 86)',
    'D-': 'rgb(117, 14, 58)',
    F: 'rgb(216, 10, 55)',
    W: 'rgb(102, 102, 102)',
  };

  const colors = [];

  for (let i = 0; i < keys.length; i++) {
    colors.push(colorMap[keys[i]]);
  }

  return colors;
};

import formidable, { File } from 'formidable';
import * as fs from 'fs';
import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import pdf from 'pdf-parse';

import courseCode from './../../../data/courseCode.json';

/* Don't miss that! */
export const config = {
  api: {
    bodyParser: false,
  },
};

type ProcessedFiles = Array<[string, File]>;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  /* Get files using formidable */
  const files = await new Promise<ProcessedFiles | undefined>((resolve, reject) => {
    const form = new formidable.IncomingForm();
    const files: ProcessedFiles = [];
    // pushing the file data into files
    form.on('file', function (field, file) {
      files.push([field, file]);
    });
    form.on('end', () => resolve(files));
    form.on('error', (err) => reject(err));
    form.parse(req, () => {
      console.log('Transcript parsing via formitable success');
    });
  }).catch((e) => {
    res.status(500).json({
      message: e,
    });
  });

  try {
    // files?.length
    // make sure files is not null, undefined, NaN, empty, 0, false...
    if (files) {
      /* Create directory for uploads */
      const targetPath = path.join(process.cwd(), `/public/uploads/`);
      try {
        await fs.promises.access(targetPath);
      } catch (e) {
        await fs.promises.mkdir(targetPath);
      }

      /* Move uploaded files to directory */
      for (const file of files) {
        const tempPath = file[1].filepath;
        await fs.promises.rename(tempPath, targetPath + file[1].originalFilename);
      }

      /* Parse the uploaded file */
      const dataBuffer = fs.readFileSync(
        process.cwd() + '/public/uploads/' + files[0][1]['originalFilename'],
      );
      //const dataBuffer = Buffer.from(files[0][1]);

      pdf(dataBuffer).then(function (data) {
        // Separate the words by whitespace and newline
        const words = data.text.replace(/\n/g, ' ').split(' ');

        // store keywords that arn't "[""]"
        const keywords = [];

        // store strings into the keywords array
        for (let i = 0; i < words.length; i++) {
          const line = JSON.stringify(words[i].split(' '));
          if (line != '[""]') {
            const newLine = '\\' + 'n';
            const tmp = line
              .replace('"', '')
              .replace('[', '')
              .replace(']', '')
              .replace('"', '')
              .replace(newLine, '');
            keywords.push(tmp);
          }
        }

        const temp = [];
        for (let j = 0; j < keywords.length; j++) {
          const code = keywords[j];
          if (courseCode.includes(code) && j < keywords.length - 1) {
            const digit = keywords[j + 1].slice(0, 4).replace(/^\s+|\s+$/g, '');
            if (/^\d+$/.test(digit)) {
              temp.push(code + ' ' + digit);
            }
          }
        }
        // remove duplicates
        const takenCourses = Array.from(new Set(temp));
        res.status(200).json({
          message: 'Transcript successfully parsed',
          data: takenCourses,
        });
      });
    }
  } catch (error) {
    res.status(400).json({
      message: JSON.stringify(error),
    });
  }
};

export default handler;

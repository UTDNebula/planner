import type { NextApiRequest, NextApiResponse } from 'next';
import nodemailer from 'nodemailer';
import { env } from '@/env/server.mjs';

function escapeHtml(unsafe: string) {
  return unsafe
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const transporter = nodemailer.createTransport({
      host: env.EMAIL_SERVER_HOST,
      port: env.EMAIL_SERVER_PORT,
      auth: {
        user: env.EMAIL_SERVER_USER,
        pass: env.EMAIL_SERVER_PASSWORD,
      },
    });

    const mailOptions = {
      from: req.body.email,
      to: 'planner@utdallas.edu',
      subject: 'Planner Feedback',
      text: `The following message was sent by ${req.body.email} from the contact form on the planner website: ${req.body.message}`,
      html: `<p style="font-family: sans-serif">
              The following message was sent by <em>${escapeHtml(req.body.email)}</em> from the
              contact form on the planner website:
            </p>
            <p style="font-family: sans-serif">${escapeHtml(req.body.message)}</p>`,
    };

    transporter.verify(function (error: Error) {
      if (error) {
        console.log(error);
        res.status(500).json(error);
      } else {
        transporter.sendMail(mailOptions, (error: Error, info: SentMessageInfo) => {
          if (error) {
            console.log(error);
            res.status(500).json(error);
          } else res.status(200).json(`Email sent: ${info.messageId}`);
        });
      }
    });
  } else {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }
}

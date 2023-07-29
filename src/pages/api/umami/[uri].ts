import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

import { env } from '@/env/client.mjs';

const scriptName = 'test';
const endpointName = 'endpoint-name';
const umamiUrl = env.NEXT_PUBLIC_UMAMI_URL;
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
  'Access-Control-Max-Age': '86400',
};

/***
 * Purpose of this NextJS api endpoint is to allow umami to
 * track website usage in spite of adblockers
 *
 * More information can be found here:
 * https://github.com/umami-software/umami/discussions/1026
 *
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { uri } = req.query;

  if ((uri as string).endsWith(scriptName)) {
    return getScript(req, res);
  } else if ((uri as string).endsWith(endpointName)) {
    return postData(req, res);
  }
  res.status(404).send(null);
}

async function getScript(req: NextApiRequest, res: NextApiResponse) {
  // Uses axios because I don't feel like changing it rn
  // Also host field causes issues when converting to fetch
  const response = await axios(umamiUrl + '/umami.js', {
    headers: {
      ...req.headers,
      ...corsHeaders,
      'accept-encoding': 'gzip',
      host: null, // not removing host header will result in a weird SSL error that leads to a 500 code (EPROTO SSL alert number 80)
    } as unknown as Record<string, string>,
  });

  const originalScript = await response.data;
  const obfuscatedScript = originalScript.replace(
    new RegExp('/api/collect', 'g'),
    `/${endpointName}`,
  );
  res.status(response.status ?? 200).send(obfuscatedScript);
}

async function postData(req: NextApiRequest, res: NextApiResponse) {
  const response = await axios.post(umamiUrl + '/api/collect', req.body, {
    headers: {
      ...req.headers,
      ...corsHeaders,
      host: null, // not removing host header will result in a weird SSL error that leads to a 500 code (EPROTO SSL alert number 80)
    } as unknown as Record<string, string>,
  });
  res.status(response.status ?? 201).send(response.data);
}

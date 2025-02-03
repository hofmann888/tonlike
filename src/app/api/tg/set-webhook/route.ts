'use server'

import { tgApiRequest } from "../request";

export async function POST(req: Request) {
  try {
    console.log('post set-webhook');

    const params = new URLSearchParams({ url: `${process.env.NEXT_PUBLIC_SITE_URL}/webhook` });
    const data = await tgApiRequest('setWebhook', params);
    
    return Response.json({ success: true, result: data });
  } catch (error: any) {
    console.log(error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
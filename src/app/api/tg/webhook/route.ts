'use server'

import { createReport } from "@/db/query";
import { ReportReasonEnum } from "@/lib/definitions";

export async function POST(req: Request) {
  try {
    console.log('post set-webhook');

    const body = await req.json();
    console.log('webhook body:', body);

    await createReport({ userId: 1, taskId: 1, reasons: [ReportReasonEnum.OTHER], comment: JSON.stringify(body) });

    return Response.json(null);
  } catch (error: any) {
    console.log('webhook error:', error);
    return Response.json({ success: false, error }, { status: 500 });
  }
}
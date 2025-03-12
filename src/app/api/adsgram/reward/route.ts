'use server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  console.log('userId:', userId);
 
  return new Response(null, { status: 200 });
}
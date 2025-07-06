import { db } from "@/lib/db";

// import { NextRequest, NextResponse } from 'next/server';
export async function POST(request: Request) {
  const { email } = await request.json();
  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ success: false, message: 'Invalid email.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  try {
    const existing = await db.waitlist.findUnique({
      where: {
        email
      }
    });
    if (existing) {
        return new Response(JSON.stringify({ success: false, message: 'Email already exists.' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json' }
        });
    }
    await db.waitlist.create({
      data: {
        email,
        createdAt: new Date()
      }
    });
    const count = await db.waitlist.count();

    return new Response(JSON.stringify({ success: true, message: 'Added to waitlist!', count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: 'Server error.' }), {
      status: 500
    });
  }
}

export async function GET() {
  try {
    const count = await db.waitlist.count();
    return new Response(JSON.stringify({ count: count + 20 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (e) {
    console.error("Error fetching waitlist count:", e);
    return new Response(JSON.stringify({ count: 20 }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}


// export async function GET(request: Request) {
//   // For example, fetch data from your DB here
//   const users = [
//     { id: 1, name: 'Alice' },
//     { id: 2, name: 'Bob' }
//   ];
//   return new Response(JSON.stringify(users), {
//     status: 200,
//     headers: { 'Content-Type': 'application/json' }
//   });
// }
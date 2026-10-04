// Registration is open. Keep the legacy endpoint explicit rather than collecting unused addresses.
export async function POST() {
  return Response.json(
    {
      success: false,
      message: "Registration is open. Create an account at /auth/register.",
    },
    { status: 410 },
  );
}
export async function GET() {
  return Response.json({ registrationOpen: true });
}

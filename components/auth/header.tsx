export default function AuthHeader({ label }: { label: string }) {
  return (
    <div className="space-y-3">
      <h1 className="text-3xl font-medium">{label}</h1>
      <p className="text-sm text-muted-foreground">
        Your independent creative studio.
      </p>
    </div>
  );
}

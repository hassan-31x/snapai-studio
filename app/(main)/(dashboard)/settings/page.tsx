"use client";
import { useState, useTransition } from "react";
import { useSession, signOut } from "next-auth/react";
import { settings } from "@/actions/settings";
import { deleteUser } from "@/actions/delete-user";
import { Button } from "@/components/ui/button";
import Link from "next/link";
export default function Settings() {
  const { data: session, update } = useSession();
  const [pending, start] = useTransition();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [confirm, setConfirm] = useState("");
  function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    setError("");
    setMessage("");
    start(async () => {
      try {
        const result = await settings({
          name: String(data.get("name")),
          currentPassword: String(data.get("currentPassword") || ""),
          password: String(data.get("password") || ""),
          isTwoFactorEnabled: data.get("twoFactor") === "on",
        });
        if (result.error) setError(result.error);
        else {
          setMessage(result.success || "Saved");
          if (data.get("password"))
            await signOut({ redirectTo: "/auth/login" });
          else await update();
        }
      } catch {
        setError("Could not save your settings. Please try again.");
      }
    });
  }
  function remove() {
    start(async () => {
      try {
        const result = await deleteUser();
        if (result.error) setError(result.error);
        else await signOut({ redirectTo: "/" });
      } catch {
        setError("Could not delete your account. Please try again.");
      }
    });
  }
  return (
    <div className="studio-page max-w-3xl">
      <h1 className="text-3xl font-medium">Account settings</h1>
      <p className="mb-8 mt-3 text-sm text-muted-foreground">
        Your profile, account security, and studio allowance.
      </p>
      <form onSubmit={save} className="space-y-6 rounded-xl border p-6">
        <h2 className="text-lg font-medium">Profile</h2>
        <label className="field">
          Name
          <input
            key={session?.user?.name}
            name="name"
            required
            maxLength={100}
            defaultValue={session?.user?.name || ""}
            disabled={pending}
          />
        </label>
        <div>
          <p className="text-sm font-medium">Email</p>
          <p className="mt-2 text-sm text-muted-foreground">
            {session?.user?.email}
          </p>
        </div>
        {!session?.user?.isOAuth && (
          <>
            <h2 className="pt-4 text-lg font-medium">Security</h2>
            <label className="field">
              Current password
              <input
                type="password"
                name="currentPassword"
                autoComplete="current-password"
                maxLength={72}
                disabled={pending}
              />
            </label>
            <label className="field">
              New password
              <input
                type="password"
                name="password"
                autoComplete="new-password"
                minLength={8}
                maxLength={72}
                disabled={pending}
              />
              <span className="text-xs font-normal text-muted-foreground">
                Leave blank to keep your password. Changing it signs out all
                sessions.
              </span>
            </label>
            <label className="flex items-center gap-3 text-sm">
              <input
                key={String(session?.user?.isTwoFactorEnabled)}
                type="checkbox"
                name="twoFactor"
                defaultChecked={session?.user?.isTwoFactorEnabled}
                disabled={pending}
              />
              Email a verification code at sign in
            </label>
          </>
        )}
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        {message && (
          <p role="status" className="text-sm text-green-700">
            {message}
          </p>
        )}
        <Button disabled={pending}>
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </form>
      <section className="mt-8 rounded-xl border p-6">
        <h2 className="text-lg font-medium">Free studio</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          {session?.user?.tokens ?? "—"} credits remaining. Product shots and
          variations cost 1 credit; a five image campaign costs 5. Your
          allowance does not renew.
        </p>
        <div className="mt-4 flex gap-6 text-sm">
          <Link href="/privacy" className="underline">
            Privacy policy
          </Link>
          <Link href="/terms" className="underline">
            Terms of use
          </Link>
        </div>
        {process.env.NEXT_PUBLIC_SUPPORT_EMAIL && (
          <p className="mt-4 text-sm">
            Contact:{" "}
            <a
              href={`mailto:${process.env.NEXT_PUBLIC_SUPPORT_EMAIL}`}
              className="underline"
            >
              {process.env.NEXT_PUBLIC_SUPPORT_EMAIL}
            </a>
          </p>
        )}
      </section>
      <section className="mt-8 rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-medium">Delete account</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          This removes your account and saved projects. Download the images you
          want to keep first. Type DELETE to confirm.
        </p>
        <label className="field my-4">
          <span className="sr-only">
            Type DELETE to confirm account deletion
          </span>
          <input
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="DELETE"
            disabled={pending}
          />
        </label>
        <Button
          variant="destructive"
          disabled={confirm !== "DELETE" || pending}
          onClick={remove}
        >
          Delete my account
        </Button>
      </section>
    </div>
  );
}

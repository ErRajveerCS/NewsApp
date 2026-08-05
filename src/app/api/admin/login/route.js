import bcrypt from "bcryptjs";
import { queryOne } from "@/lib/db";
import { signSession, setSessionCookie } from "@/lib/auth";

// Simple in-memory brute-force guard. Resets on server restart/redeploy, which
// is an acceptable tradeoff for a single-instance deployment like this one —
// it stops rapid automated guessing without needing a separate service.
const MAX_ATTEMPTS = 5;
const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const attempts = new Map(); // key -> { count, firstAttemptAt }

function getClientKey(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded ? forwarded.split(",")[0].trim() : "unknown";
}

function isLockedOut(key) {
  const record = attempts.get(key);
  if (!record) return false;
  if (Date.now() - record.firstAttemptAt > WINDOW_MS) {
    attempts.delete(key);
    return false;
  }
  return record.count >= MAX_ATTEMPTS;
}

function recordFailure(key) {
  const record = attempts.get(key);
  if (!record || Date.now() - record.firstAttemptAt > WINDOW_MS) {
    attempts.set(key, { count: 1, firstAttemptAt: Date.now() });
  } else {
    record.count += 1;
  }
}

function clearFailures(key) {
  attempts.delete(key);
}

export async function POST(request) {
  const key = getClientKey(request);

  if (isLockedOut(key)) {
    return Response.json(
      { error: "Too many failed attempts. Try again in 15 minutes." },
      { status: 429 }
    );
  }

  const { email, password } = await request.json();
  const user = await queryOne("SELECT * FROM users WHERE email = ?", [email]);

  if (!user || !bcrypt.compareSync(password, user.password_hash)) {
    recordFailure(key);
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  clearFailures(key);
  const token = signSession(user);
  await setSessionCookie(token);
  return Response.json({ ok: true });
}

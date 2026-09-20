import os from "node:os";
import { execSync } from "node:child_process";

/**
 * Server-only. Returns the origin a *phone on the same Wi-Fi* can reach.
 *
 * Priority:
 *   1. NEXT_PUBLIC_APP_URL env (set this when using a tunnel or a deploy)
 *   2. The request's own host, if it is not a loopback address
 *   3. The Mac's first non-internal IPv4 address (Wi-Fi / Ethernet) + the dev port
 */
const LOOPBACK = new Set(["localhost", "127.0.0.1", "0.0.0.0", "::1", "[::1]"]);

interface Candidate {
  iface: string;
  address: string;
}

function ipv4Candidates(): Candidate[] {
  const nets = os.networkInterfaces();
  const out: Candidate[] = [];
  for (const name of Object.keys(nets)) {
    for (const net of nets[name] ?? []) {
      const isV4 = net.family === "IPv4" || (net.family as unknown) === 4;
      if (!isV4 || net.internal) continue;
      // Skip link-local (169.254.x) and typical VPN / virtual adapters.
      if (net.address.startsWith("169.254.")) continue;
      if (/^(utun|tun|tap|bridge|vmnet|docker|awdl|llw|ipsec|ppp)/i.test(name)) continue;
      out.push({ iface: name, address: net.address });
    }
  }
  return out;
}

/** macOS / Linux: the interface that carries the default route (the real Wi-Fi). */
function defaultRouteInterface(): string | null {
  try {
    if (process.platform === "darwin") {
      const txt = execSync("route -n get default", { encoding: "utf8", timeout: 1500 });
      const m = txt.match(/interface:\s*(\S+)/);
      return m ? m[1] : null;
    }
    if (process.platform === "linux") {
      const txt = execSync("ip route show default", { encoding: "utf8", timeout: 1500 });
      const m = txt.match(/dev\s+(\S+)/);
      return m ? m[1] : null;
    }
  } catch {
    /* fall through */
  }
  return null;
}

export function lanIPv4(): string | null {
  const candidates = ipv4Candidates();
  if (candidates.length === 0) return null;
  const viaRoute = defaultRouteInterface();
  const onRoute = viaRoute ? candidates.find((c) => c.iface === viaRoute) : undefined;
  if (onRoute) return onRoute.address;
  // Prefer en0 (Wi-Fi on most Macs), then private ranges, then anything.
  const en0 = candidates.find((c) => c.iface === "en0");
  if (en0) return en0.address;
  const priv = candidates.find(
    (c) => c.address.startsWith("192.168.") || c.address.startsWith("10.") || /^172\.(1[6-9]|2\d|3[01])\./.test(c.address),
  );
  return (priv ?? candidates[0]).address;
}

export function lanDebug(): { chosen: string | null; defaultRouteInterface: string | null; candidates: Candidate[] } {
  return { chosen: lanIPv4(), defaultRouteInterface: defaultRouteInterface(), candidates: ipv4Candidates() };
}

export function getPublicOrigin(req: Request): string {
  const env = process.env.NEXT_PUBLIC_APP_URL?.trim();
  if (env) return env.replace(/\/+$/, "");

  const url = new URL(req.url);
  const proto = req.headers.get("x-forwarded-proto") ?? url.protocol.replace(":", "");
  const hostHeader = req.headers.get("x-forwarded-host") ?? req.headers.get("host") ?? url.host;
  const [hostname, port] = splitHost(hostHeader);

  if (!LOOPBACK.has(hostname)) return `${proto}://${hostHeader}`;

  const lan = lanIPv4();
  if (!lan) return `${proto}://${hostHeader}`;
  return `${proto}://${lan}${port ? `:${port}` : ""}`;
}

function splitHost(host: string): [string, string] {
  // handles "host:port", "[::1]:3000", and bare hosts
  const m = host.match(/^(\[[^\]]+\]|[^:]+)(?::(\d+))?$/);
  if (!m) return [host, ""];
  return [m[1], m[2] ?? ""];
}

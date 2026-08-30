# Cloudflare DNS & Security Guide — AR Events Co.

This guide explains connecting **Cloudflare DNS, SSL/TLS, and Edge CDN** to your Vercel deployment of `areventsco.com`.

---

## 1. Cloudflare DNS Configuration

In your Cloudflare Dashboard for domain `areventsco.com`, navigate to **DNS → Records**:

| Type | Name | Content / Target | Proxy Status | TTL |
| :--- | :--- | :--- | :--- | :--- |
| **CNAME** | `@` (root) | `cname.vercel-dns.com` | **Proxied (Orange Cloud)** | Auto |
| **CNAME** | `www` | `cname.vercel-dns.com` | **Proxied (Orange Cloud)** | Auto |

> **Note on CNAME Flattening**: Cloudflare automatically flattens root `@` CNAME records to ANAME records according to RFC standards.

---

## 2. SSL/TLS Encryption Settings

Navigate to **SSL/TLS → Overview**:

- Set encryption mode to **Full (Strict)**.
  *(This ensures complete end-to-end encryption between the user browser, Cloudflare edge, and Vercel edge servers).*

Navigate to **SSL/TLS → Edge Certificates**:
- Toggle **Always Use HTTPS** to **ON**.
- Toggle **Automatic HTTPS Rewrites** to **ON**.
- Set **Minimum TLS Version** to `TLS 1.2`.

---

## 3. Speed & Performance Optimization

Navigate to **Speed → Optimization**:
- **Brotli Compression**: Enabled
- **Early Hints**: Enabled
- **Rocket Loader**: Disabled (avoids interference with Next.js hydration)

---

## 4. Verification

1. In the Vercel Dashboard under **Settings → Domains**, click **Refresh** on `areventsco.com`.
2. Confirm that domain status displays a green checkmark **Valid Configuration**.
3. Visit `https://areventsco.com` in a browser and verify the SSL padlock and HTTP/3 connection.

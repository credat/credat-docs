# Credat Docs: Accuracy Fix, Refactor & New Sections

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all SDK-vs-docs discrepancies, refactor for maintainability, and add missing documentation sections.

**Architecture:** Content-only changes across Nextra MDX files. No structural changes to the Next.js app — only MDX content files and `_meta.ts` navigation files are touched. New API reference pages added for undocumented exports.

**Tech Stack:** Nextra 4 / MDX / TypeScript code examples

---

## Phase 1: Fix SDK Accuracy

### Task 1: Replace `delegation.raw` with `delegation.token` across all files

The SDK returns `DelegationCredential` with a `token` field, not `raw`. All 17 occurrences must be fixed.

**Files to modify:**

**Step 1: Fix `src/content/index.mdx`**
- Line 43: `delegation.raw` → `delegation.token`

**Step 2: Fix `src/content/getting-started.mdx`**
- Line 38: `delegation.raw` → `delegation.token`

**Step 3: Fix `src/content/security.mdx`**
- Line 210: `delegation.raw` → `delegation.token`

**Step 4: Fix `src/content/guides/delegation.mdx`**
- Line 55: `delegation.raw` → `delegation.token`
- Line 69: prose "The delegation.raw string" → "The delegation.token string"
- Line 78: `delegation.raw` → `delegation.token`

**Step 5: Fix `src/content/guides/handshake.mdx`**
- Line 58: `delegation.raw` → `delegation.token`
- Line 108: `delegation.raw` → `delegation.token`

**Step 6: Fix `src/content/concepts/delegation.mdx`**
- Line 33: prose "delegation.raw" → "delegation.token"
- Line 53: `delegation.raw` → `delegation.token`

**Step 7: Fix `src/content/concepts/handshake.mdx`**
- Line 56: `delegation.raw` → `delegation.token`

**Step 8: Fix `src/content/concepts/scopes.mdx`**
- Line 35: `delegation.raw` → `delegation.token`
- Line 119: `delegation.raw` → `delegation.token`

**Step 9: Fix `src/content/api/delegation.mdx`**
- Line 99: table reference "delegation.raw" → "delegation.token"
- Line 129: `delegation.raw` → `delegation.token`

**Step 10: Fix `src/content/api/handshake.mdx`**
- Line 59: table reference "delegation.raw" → "delegation.token"
- Line 81: `delegation.raw` → `delegation.token`

**Step 11: Commit**
```bash
git add src/content/
git commit -m "fix: replace delegation.raw with delegation.token across all docs"
```

---

### Task 2: Fix `statusListUrl`/`statusListIndex` → `statusList: { url, index }`

The SDK uses `statusList?: { url: string; index: number }` as a single nested object, not two separate parameters.

**Files to modify:**

**Step 1: Fix `src/content/api/delegation.mdx`**
- Lines 24-25: Replace the two separate parameter rows with one `statusList` row of type `{ url: string; index: number }`

**Step 2: Fix `src/content/guides/delegation.mdx`**
- Lines 154-155: Replace:
```typescript
statusListUrl: "https://acme.com/.well-known/status-list.json",
statusListIndex: 42,
```
With:
```typescript
statusList: { url: "https://acme.com/.well-known/status-list.json", index: 42 },
```

**Step 3: Fix `src/content/concepts/delegation.mdx`**
- Lines 120-121: Same replacement as step 2.

**Step 4: Fix `src/content/security.mdx`**
- Lines 265-266: Same replacement pattern, using index `0`.

**Step 5: Commit**
```bash
git add src/content/
git commit -m "fix: correct statusList parameter shape to match SDK API"
```

---

### Task 3: Remove non-existent `checkRevocation` from `verifyDelegation` docs

The SDK's `VerifyDelegationOptions` only has `ownerPublicKey`. The docs incorrectly list `checkRevocation` and `algorithm` options.

**Files to modify:**

**Step 1: Fix `src/content/api/delegation.mdx`**
- Line 107: Remove the `checkRevocation` parameter row from the table
- Line 106 (if present): Remove any `algorithm` parameter row from the verifyDelegation parameters table
- The only valid parameter for the options object is `ownerPublicKey: Uint8Array`

**Step 2: Commit**
```bash
git add src/content/api/delegation.mdx
git commit -m "fix: remove non-existent checkRevocation and algorithm from verifyDelegation docs"
```

---

### Task 4: Fix owner DID inconsistency in getting-started.mdx

Two occurrences use `did:web:acme.com:owner` while all other pages use `did:web:acme.com`. The `:owner` suffix is misleading — it looks like a path but is never explained.

**Files to modify:**

**Step 1: Fix `src/content/getting-started.mdx`**
- Line 31: `"did:web:acme.com:owner"` → `"did:web:acme.com"`
- Line 45: `"did:web:acme.com:owner"` → `"did:web:acme.com"`

**Step 2: Commit**
```bash
git add src/content/getting-started.mdx
git commit -m "fix: normalize owner DID to did:web:acme.com across all examples"
```

---

### Task 5: Add `challengeMaxAgeMs` to verifyPresentation docs

The SDK supports `challengeMaxAgeMs?: number` (default 5 minutes) on `VerifyPresentationOptions` but it's not documented.

**Files to modify:**

**Step 1: Fix `src/content/api/handshake.mdx`**
- In the `verifyPresentation` parameters table, add a row:
  `| challengeMaxAgeMs | number | No | 300000 (5 min) | Maximum age of challenge before rejection |`

**Step 2: Commit**
```bash
git add src/content/api/handshake.mdx
git commit -m "fix: document challengeMaxAgeMs option on verifyPresentation"
```

---

### Task 6: Build and verify all changes

**Step 1: Run the build**
```bash
cd /Users/samsepiol/Downloads/GithubRepos/Work/Credat/credat-docs && npm run build
```
Expected: Build succeeds with no errors.

**Step 2: Spot-check the dev server**
```bash
npm run dev
```
Verify pages render correctly at localhost:3000/docs.

---

## Phase 2: Refactor for Scalability & Maintainability

### Task 7: Audit and improve code example consistency

Ensure all code examples across the docs use the same variable names, patterns, and import style so the site reads as one coherent document.

**Consistency rules to enforce:**
- Owner key pair always named `ownerKeys` (from `generateKeyPair`)
- Agent always named `agent` (from `createAgent`)
- Delegation always named `delegation` (from `delegate`)
- Challenge always named `challenge` (from `createChallenge`)
- Presentation always named `presentation` (from `presentCredentials`)
- Result always named `result` (from verify functions)
- Scope examples use consistent domain: `email:read`, `email:send`, `calendar:read`, `api:call`
- All code blocks include the import line: `import { ... } from "credat"`

**Files to review and fix:**
- `src/content/index.mdx`
- `src/content/getting-started.mdx`
- `src/content/concepts/*.mdx` (4 files)
- `src/content/guides/*.mdx` (4 files)
- `src/content/security.mdx`

**Step 1:** Read each file, identify deviations from the rules above, fix them.

**Step 2: Commit**
```bash
git add src/content/
git commit -m "refactor: normalize variable names and imports across all code examples"
```

---

### Task 8: Complete incomplete code examples

Several examples reference undefined functions or are missing setup. Fix these to be copy-pasteable.

**Files to modify:**

**Step 1: Fix `src/content/security.mdx` — EncryptedStorage example**
- Add `encrypt`/`decrypt` function stubs using Web Crypto API or a note that they are user-provided.
- Add the constructor with `encryptionKey` parameter and initialization.

**Step 2: Fix `src/content/guides/basic-agent.mdx` — RedisStorage example**
- Add constructor with Redis client initialization.
- Add import comment for the Redis library.

**Step 3: Fix `src/content/security.mdx` — status list index inconsistency**
- Line 270 uses index `0` but earlier context uses `42`. Pick one and be consistent within the example.

**Step 4: Commit**
```bash
git add src/content/
git commit -m "refactor: complete all incomplete code examples with proper setup"
```

---

### Task 9: Build and verify phase 2

**Step 1: Run build**
```bash
cd /Users/samsepiol/Downloads/GithubRepos/Work/Credat/credat-docs && npm run build
```

---

## Phase 3: Add Missing Sections

### Task 10: Add Revocation & Status Lists API reference page

The SDK exports `createStatusList`, `setRevocationStatus`, `isRevoked`, `encodeStatusList`, `decodeStatusList`, `createStatusListCredential`, `verifyStatusListCredential` — none are in the API reference.

**Files to create:**
- `src/content/api/revocation.mdx`

**Content structure:**
```markdown
---
title: Revocation & Status Lists
---

# Revocation & Status Lists

Manage credential revocation using W3C-compatible Status List 2021.

## `createStatusList(options)`

Create a new status list for tracking revocation.

### Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| id | string | Yes | — | Unique identifier for the list |
| issuer | string | Yes | — | DID of the issuer |
| url | string | Yes | — | Public URL where the list will be hosted |
| size | number | No | 131072 | Number of entries (min 131,072 per W3C spec) |

### Returns: `StatusListData`
| Field | Type | Description |
|-------|------|-------------|
| bitstring | Uint8Array | The revocation bitstring |
| issuer | string | Issuer DID |
| id | string | List identifier |
| size | number | Total entries |

### Example
```ts
import { createStatusList } from "credat";

const statusList = createStatusList({
  id: "status-list-1",
  issuer: "did:web:acme.com",
  url: "https://acme.com/.well-known/status-list.json",
});
```

## `setRevocationStatus(list, index, revoked)`

Set or clear the revocation status of a credential.

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| list | StatusListData | Yes | The status list |
| index | number | Yes | Index of the credential (0 to size-1) |
| revoked | boolean | Yes | `true` to revoke, `false` to reinstate |

### Example
```ts
import { setRevocationStatus } from "credat";

// Revoke credential at index 42
setRevocationStatus(statusList, 42, true);

// Reinstate it
setRevocationStatus(statusList, 42, false);
```

## `isRevoked(list, index)`

Check if a credential is revoked.

### Parameters
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| list | StatusListData | Yes | The status list |
| index | number | Yes | Index to check |

### Returns: `boolean`

### Example
```ts
import { isRevoked } from "credat";

if (isRevoked(statusList, 42)) {
  throw new Error("Credential has been revoked");
}
```

## `encodeStatusList(bitstring)`

Compress and base64url-encode a status list bitstring for transport.

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| bitstring | Uint8Array | Raw bitstring from StatusListData |

### Returns: `string` — base64url-encoded gzip-compressed bitstring

## `decodeStatusList(encoded)`

Decode a compressed status list back to a bitstring.

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| encoded | string | base64url-encoded compressed bitstring |

### Returns: `Uint8Array`

## `createStatusListCredential(options)`

Create a signed JWT credential wrapping the status list for public hosting.

### Parameters
| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| list | StatusListData | Yes | — | The status list |
| issuerPrivateKey | Uint8Array | Yes | — | Issuer's private key for signing |
| url | string | Yes | — | Public URL of the credential |
| algorithm | Algorithm | No | "ES256" | Signing algorithm |

### Returns: `string` — signed JWT (`statuslist+jwt`)

### Example
```ts
import { createStatusListCredential, generateKeyPair } from "credat";

const ownerKeys = generateKeyPair("ES256");

const jwt = createStatusListCredential({
  list: statusList,
  issuerPrivateKey: ownerKeys.privateKey,
  url: "https://acme.com/.well-known/status-list.json",
});

// Host this JWT at the URL above
```

## `verifyStatusListCredential(jwt, publicKey)`

Verify a signed status list credential.

### Parameters
| Parameter | Type | Description |
|-----------|------|-------------|
| jwt | string | The status list JWT |
| publicKey | Uint8Array | Issuer's public key |

### Returns: `VerifyStatusListCredentialResult`
| Field | Type | Description |
|-------|------|-------------|
| valid | boolean | Whether the credential is valid |
| bitstring | Uint8Array? | Decoded bitstring (if valid) |
| issuer | string? | Issuer DID (if valid) |
| errors | string[]? | Error messages (if invalid) |
```

**Step 1:** Create the file with the content above.

**Step 2:** Update `src/content/api/_meta.ts` — add `revocation: "Revocation & Status Lists"` after `errors`.

**Step 3: Commit**
```bash
git add src/content/api/
git commit -m "feat: add Revocation & Status Lists API reference page"
```

---

### Task 11: Add TypeScript Types reference page

The SDK exports 25+ types/interfaces that aren't documented anywhere. Users need this.

**Files to create:**
- `src/content/api/types.mdx`

**Content:** Document all exported types from `src/types.ts` grouped by domain:
- **Agent types:** `AgentConfig`, `AgentIdentity`
- **Delegation types:** `DelegateOptions`, `DelegationCredential`, `DelegationClaims`, `DelegationConstraints`, `DelegationResult`
- **Handshake types:** `ChallengeMessage`, `PresentationMessage`, `AckMessage`, `HandshakeMessage`
- **DID types:** `DIDDocument`, `DIDResolutionResult`, `DIDMethod`, `VerificationMethod`, `ServiceEndpoint`
- **Credential types:** `CredentialFormat`, `CredentialClaims`, `CredentialClaimValue`, `VerificationError`
- **Status List types:** `StatusListData`, `StatusListEntry`, `RevocationStatus`
- **Crypto types:** `Algorithm`, `KeyPair`, `JsonWebKey`
- **Storage types:** `StorageAdapter`

Each type should show the full interface definition as a TypeScript code block with a brief description.

**Step 1:** Create the file.

**Step 2:** Update `src/content/api/_meta.ts` — add `types: "Types"` after `revocation`.

**Step 3: Commit**
```bash
git add src/content/api/
git commit -m "feat: add TypeScript Types reference page"
```

---

### Task 12: Add Architecture Overview page

A high-level page showing how all pieces connect — critical for new developers.

**Files to create:**
- `src/content/concepts/architecture.mdx`

**Content structure:**
1. **System Overview** — What Credat is in 2 sentences
2. **The Three Pillars** — Identity (DIDs), Authorization (Delegation), Verification (Handshake)
3. **How They Connect** — Text flow: Owner creates agent → issues delegation → agent presents to service → service verifies
4. **Trust Model** — Who trusts whom and why (owner anchors, DID resolution, cryptographic proof)
5. **Protocol Layers** — Crypto → Credentials → Protocol → Application
6. **What Credat Does vs. Doesn't Do** — Clarify: Credat proves identity + permissions. It does NOT enforce constraints, manage sessions, or handle transport.

**Step 1:** Create the file.

**Step 2:** Update `src/content/concepts/_meta.ts` — add `architecture: "Architecture Overview"` as the first entry.

**Step 3: Commit**
```bash
git add src/content/concepts/
git commit -m "feat: add Architecture Overview page to concepts"
```

---

### Task 13: Add Troubleshooting / FAQ page

**Files to create:**
- `src/content/troubleshooting.mdx`

**Content:** Common issues grouped by category:
- **Agent Creation** — "AGENT_CREATION_FAILED: Domain is required", storage errors
- **Delegation** — "DELEGATION_EXPIRED", "DELEGATION_SCOPE_INVALID", constraint mismatches
- **Handshake** — "HANDSHAKE_INVALID_NONCE" (replay / expired challenge), "HANDSHAKE_VERIFICATION_FAILED" (wrong keys, algorithm mismatch)
- **DID Resolution** — "DID_NOT_FOUND" (hosting issues, CORS), "DID_METHOD_UNSUPPORTED"
- **Key Management** — Algorithm mismatch between agent and verification, key format issues
- **Common Patterns** — Clock skew handling, debugging with error codes, enabling verbose logging

Each item: **symptom** (error message), **cause**, **fix** (with code).

**Step 1:** Create the file.

**Step 2:** Update `src/content/_meta.ts` — add `troubleshooting: "Troubleshooting"` after `security`.

**Step 3: Commit**
```bash
git add src/content/
git commit -m "feat: add Troubleshooting page"
```

---

### Task 14: Add Credential Internals page (low-level API)

The SDK exports `createSdJwtVc`, `verifySdJwtVc`, `selectDisclosures` — undocumented but public.

**Files to create:**
- `src/content/api/credentials.mdx`

**Content:** Document:
- `createSdJwtVc(options)` — Low-level SD-JWT VC creation
- `verifySdJwtVc(sdJwt, issuerPublicKey)` — Low-level SD-JWT VC verification
- `selectDisclosures(sdJwt, revealClaims)` — Selective disclosure for privacy
- Note: these are low-level building blocks; most users should use `delegate`/`verifyDelegation` instead

**Step 1:** Create the file.

**Step 2:** Update `src/content/api/_meta.ts` — add `credentials: "Credentials (Low-level)"` after `types`.

**Step 3: Commit**
```bash
git add src/content/api/
git commit -m "feat: add low-level Credentials API reference page"
```

---

### Task 15: Final build, verify, and commit

**Step 1: Run build**
```bash
cd /Users/samsepiol/Downloads/GithubRepos/Work/Credat/credat-docs && npm run build
```

**Step 2: Fix any build errors**

**Step 3: Verify site navigation**
- All new pages appear in sidebar
- All links work
- Code examples render correctly

---

## Summary

| Phase | Tasks | What |
|-------|-------|------|
| 1 — Accuracy | Tasks 1-6 | Fix 17x `delegation.raw`, 8x `statusList` params, remove phantom options, normalize DIDs, add missing option |
| 2 — Refactor | Tasks 7-9 | Normalize variable names, complete incomplete examples, verify build |
| 3 — Sections | Tasks 10-15 | Add Revocation API, Types ref, Architecture, Troubleshooting, Credentials API |

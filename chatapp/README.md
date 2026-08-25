# TCP Chat Application

A multi-user chat app built directly on Node's `net` module — no external
networking libraries.

## 1. Protocol / Framing Design

**Framing:** Messages are delimited by newlines (`\n`). Since a single
`socket.on('data')` event can contain zero, one, or several messages (or a
partial one), incoming bytes are appended to a per-connection `buffer`
string. On every `data` event, the buffer is scanned for `\n` in a loop —
each time one is found, everything before it is extracted as one complete
message and removed from the buffer, and scanning continues until no more
complete messages remain. Any partial message stays in the buffer until the
rest arrives in a future `data` event.

Because some clients (e.g. Windows terminals, telnet) send `\r\n` instead of
just `\n`, any trailing `\r` is stripped from each extracted message before
it's processed.

To prevent a misbehaving or malicious client from growing the buffer
unboundedly (e.g. never sending a newline), the connection is closed if the
buffer exceeds 10,000 characters without a complete message.

**Message types**, distinguished by convention:
- A line with no special prefix → **broadcast** message, sent to everyone
  except the sender.
- A line starting with `/` → a **command**. Three are supported:
  - `/msg <username> <text>` — private direct message
  - `/who` — list currently connected usernames
  - `/quit` — gracefully disconnect

**DM syntax:** `/msg <username> <message text>`. The command is split on
spaces; `parts[1]` is the target username and everything after it
(`parts.slice(2).join(' ')`) is the message body, so DM text itself can
contain spaces.

## 2. Additional Features Implemented

Two features from Section 4 were implemented:

1. **`/who` — list connected users.** The server iterates its `Map` of
   connected usernames and writes each one back to the requesting client.
2. **`/quit` — graceful exit.** The client sends `/quit`; the server calls
   `socket.end()`, which triggers the `close` event, which removes the user
   from the client list and broadcasts a "left the chat" notice to everyone
   else.

## 3. Handling Disconnects & Errors

Every socket gets its own `error` handler (so one bad connection can't crash
the whole process) and a `close` handler that removes the user from the
`clients` map and notifies everyone else — this covers both graceful
disconnects (`/quit`) and abrupt ones (closing the terminal, network drop),
since `close` fires either way.

## 4. How to Run

Requires Node.js (built-in `net` module only — no npm install needed).

**Start the server:**
```bash
PORT=3000 node server.js
```

**Connect a client** (in a separate terminal, one per user):
```bash
HOST=localhost PORT=3000 node client.js
```

When prompted, type a username and press Enter. Then:
- Type any plain text + Enter to broadcast it to everyone else.
- Type `/msg <username> <message>` to send a private message.
- Type `/who` to see who's currently connected.
- Type `/quit` to disconnect gracefully.

## 5. Self-Check Results

- ✅ 3 clients connected at once; broadcasts reach both others, not the sender.
- ✅ DMs are only visible to the intended recipient.
- ✅ Duplicate usernames are rejected with a clear message.
- ✅ Closing a client abruptly does not affect other clients.
- ✅ `/msg` to a nonexistent username notifies the sender instead of failing silently.
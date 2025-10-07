# **What are network packets?**

## What Happens When You Send Data Over the Internet

### The Journey of a JSON Request

```javascript
// Client side (Browser/App)
fetch("http://localhost:3000/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John", age: 30 }),
});
```

Let's break down what actually travels over the network:

## Step-by-Step: From JavaScript Object to Bytes

### Step 1: JavaScript Object (In Memory)

```javascript
const user = { name: "John", age: 30 };
// This exists in your computer's RAM
// Memory representation (conceptual):
// Memory Address: 0x7fff5fbff8a0
// Object: { name: 'John', age: 30 }
```

### Step 2: Convert to JSON String

```javascript
const jsonString = JSON.stringify(user);
console.log(jsonString);
// '{"name":"John","age":30}'
// Still in memory, but now as a string
```

### Step 3: Convert String to Bytes (Encoding)

The string is converted to **bytes** using UTF-8 encoding:

```
String: '{"name":"John","age":30}'

Bytes (in hexadecimal):
7B 22 6E 61 6D 65 22 3A 22 4A 6F 68 6E 22 2C 22 61 67 65 22 3A 33 30 7D

Bytes (in decimal):
123 34 110 97 109 101 34 58 34 74 111 104 110 34 44 34 97 103 101 34 58 51 48 125

Bytes (in binary):
01111011 00100010 01101110 01100001 01101101 01100101 ...
```

**What each byte represents:**

```
7B = {
22 = "
6E = n
61 = a
6D = m
65 = e
22 = "
3A = :
22 = "
4A = J
6F = o
68 = h
6E = n
22 = "
2C = ,
... and so on
```

### Step 4: Send Over Network (TCP/IP)

These bytes are sent as **packets** over the network:

```
┌─────────────────────────────────────────┐
│  HTTP Request                           │
├─────────────────────────────────────────┤
│  POST /users HTTP/1.1                   │
│  Host: localhost:3000                   │
│  Content-Type: application/json         │
│  Content-Length: 27                     │
│                                         │
│  7B 22 6E 61 6D 65 22 3A 22 4A 6F ...  │ ← Raw bytes!
│  ({"name":"John","age":30})             │
└─────────────────────────────────────────┘
```

## What "Stream of Bytes" Means

A **stream** means data arrives **gradually**, not all at once:

```javascript
// Server side - receiving data
req.on("data", (chunk) => {
  // Data arrives in chunks (pieces)
  console.log("Received chunk:", chunk);
  // <Buffer 7b 22 6e 61 6d 65 22 3a>  ← First chunk
  // <Buffer 22 4a 6f 68 6e 22 2c 22>  ← Second chunk
  // <Buffer 61 67 65 22 3a 33 30 7d>  ← Third chunk
});

req.on("end", () => {
  console.log("All data received");
});
```

**Why in chunks?**

- Network packets have size limits (MTU - Maximum Transmission Unit, typically ~1500 bytes)
- Large data is split into multiple packets
- Packets arrive separately over time

## Visual: The Complete Flow

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT (Browser/App)                                       │
│                                                             │
│  JavaScript Object:                                         │
│  { name: 'John', age: 30 }                                  │
│                                                             │
│  ↓ JSON.stringify()                                         │
│                                                             │
│  JSON String:                                               │
│  '{"name":"John","age":30}'                                 │
│                                                             │
│  ↓ UTF-8 Encoding                                           │
│                                                             │
│  Bytes (Buffer):                                            │
│  7B 22 6E 61 6D 65 22 3A 22 4A 6F 68 6E 22 2C 22 61 67 65  │
│  22 3A 33 30 7D                                             │
└──────────────────┬──────────────────────────────────────────┘
                   │
                   │ TCP/IP Network
                   │ (Packets of bytes)
                   ↓
┌─────────────────────────────────────────────────────────────┐
│  SERVER (Node.js/Express)                                   │
│                                                             │
│  Raw bytes arrive as stream:                                │
│  <Buffer 7b 22 6e 61 6d 65 22 3a 22 4a 6f 68 6e 22 ...>    │
│                                                             │
│  ↓ express.json() middleware                                │
│                                                             │
│  1. Collect all chunks                                      │
│  2. Combine into complete buffer                            │
│  3. Convert buffer to string (UTF-8 decode)                 │
│  4. Parse JSON string to object                             │
│                                                             │
│  JavaScript Object:                                         │
│  req.body = { name: 'John', age: 30 }                       │
└─────────────────────────────────────────────────────────────┘
```

## Code Example: Manual Parsing (What Express Does)

```javascript
const express = require("express");
const app = express();

// ❌ Without express.json() - manual parsing required
app.post("/users", (req, res) => {
  let rawData = ""; // Will hold the string

  // Event: data chunk received
  req.on("data", (chunk) => {
    console.log("Chunk received:", chunk);
    // <Buffer 7b 22 6e 61 6d 65 22 3a 22 4a 6f 68 6e 22 2c 22 61 67 65 22 3a 33 30 7d>

    // Convert bytes to string and append
    rawData += chunk.toString("utf8");
    // After all chunks: '{"name":"John","age":30}'
  });

  // Event: all data received
  req.on("end", () => {
    try {
      // Parse JSON string to object
      const jsonObject = JSON.parse(rawData);
      console.log("Parsed object:", jsonObject);
      // { name: 'John', age: 30 }

      res.json({ received: jsonObject });
    } catch (error) {
      res.status(400).json({ error: "Invalid JSON" });
    }
  });
});

// ✅ With express.json() - automatic parsing
app.use(express.json());

app.post("/users-easy", (req, res) => {
  // express.json() already did all the work above!
  console.log(req.body); // { name: 'John', age: 30 }
  res.json({ received: req.body });
});
```

## Real Example: See the Raw Bytes

```javascript
const express = require("express");
const app = express();

app.post("/debug", (req, res) => {
  console.log("\n=== RAW REQUEST DATA ===");

  const chunks = [];

  req.on("data", (chunk) => {
    console.log("\n📦 Chunk received:");
    console.log("  Type:", typeof chunk); // object
    console.log("  Is Buffer:", Buffer.isBuffer(chunk)); // true
    console.log("  Hex:", chunk.toString("hex"));
    // 7b226e616d65223a224a6f686e222c22616765223a33307d

    console.log("  As String:", chunk.toString("utf8"));
    // {"name":"John","age":30}

    console.log("  Byte values:", Array.from(chunk));
    // [123, 34, 110, 97, 109, 101, 34, 58, 34, 74, ...]

    chunks.push(chunk);
  });

  req.on("end", () => {
    // Combine all chunks
    const fullBuffer = Buffer.concat(chunks);
    console.log("\n✅ Complete data:");
    console.log("  Total bytes:", fullBuffer.length);
    console.log("  Full hex:", fullBuffer.toString("hex"));
    console.log("  As string:", fullBuffer.toString("utf8"));

    // Parse JSON
    const jsonString = fullBuffer.toString("utf8");
    const jsonObject = JSON.parse(jsonString);
    console.log("  As object:", jsonObject);

    res.json({ received: jsonObject });
  });
});

app.listen(3000);
```

**When you send:**

```javascript
fetch("http://localhost:3000/debug", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "John", age: 30 }),
});
```

**Console output:**

```
=== RAW REQUEST DATA ===

📦 Chunk received:
  Type: object
  Is Buffer: true
  Hex: 7b226e616d65223a224a6f686e222c22616765223a33307d
  As String: {"name":"John","age":30}
  Byte values: [123, 34, 110, 97, 109, 101, 34, 58, 34, 74, 111, 104, 110, 34, 44, 34, 97, 103, 101, 34, 58, 51, 48, 125]

✅ Complete data:
  Total bytes: 27
  Full hex: 7b226e616d65223a224a6f686e222c22616765223a33307d
  As string: {"name":"John","age":30}
  As object: { name: 'John', age: 30 }
```

## Why "Stream" Instead of All-at-Once?

### Small Data (Like our example)

```
Single packet: 7B 22 6E 61 6D 65 22 3A 22 4A 6F 68 6E 22 2C 22 61 67 65 22 3A 33 30 7D
Arrives in: 1 chunk
```

### Large Data (File upload, big JSON)

```
Packet 1: 7B 22 75 73 65 72 73 22 3A 5B 7B ... (1500 bytes)
Packet 2: 22 6E 61 6D 65 22 3A 22 41 6C ... (1500 bytes)
Packet 3: 69 63 65 22 2C 22 61 67 65 22 ... (1500 bytes)
...
Packet N: 33 30 7D 5D 7D (remaining bytes)

Arrives in: Multiple chunks over time
```

## Buffer Object in Node.js

```javascript
// Create a buffer from string
const buffer = Buffer.from('{"name":"John"}', "utf8");

console.log(buffer);
// <Buffer 7b 22 6e 61 6d 65 22 3a 22 4a 6f 68 6e 22 7d>

console.log(buffer.toString("hex"));
// 7b226e616d65223a224a6f686e227d

console.log(buffer.toString("utf8"));
// {"name":"John"}

console.log(buffer[0]); // First byte
// 123 (which is '{' in ASCII)
```

## Summary

**"Raw stream of bytes" means:**

1. **Raw** - Not parsed, not processed, just pure binary data
2. **Stream** - Data arrives gradually in chunks, not all at once
3. **Bytes** - The fundamental unit: numbers from 0-255 representing characters

**The transformation:**

```
JavaScript Object (in memory)
  → JSON String (in memory)
  → Bytes/Buffer (binary)
  → Network packets
  → Server receives bytes
  → express.json() converts back
  → JavaScript Object (req.body)
```

Without `express.json()`, you'd have to manually:

1. Listen for data chunks
2. Collect all chunks
3. Convert Buffer to string
4. Parse JSON string to object

With `express.json()`, it just works: `req.body` already contains your object! ✨

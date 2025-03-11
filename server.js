const express = require("express");
const crypto = require("crypto");
const cors = require("cors");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

const SECRET_FLAG = "flag{The_Game_Is_Afoot_221B_BakerStreet}";

// Helper functions
const base64Encode = (text) => Buffer.from(text, "utf-8").toString("base64");
const base64Decode = (text) => Buffer.from(text, "base64").toString("utf-8");

const caesarCipherEncrypt = (text, shift) =>
  text.replace(/[a-zA-Z]/g, (c) =>
    String.fromCharCode(
      c.charCodeAt(0) + shift > (c >= "a" ? 122 : 90)
        ? c.charCodeAt(0) + shift - 26
        : c.charCodeAt(0) + shift
    )
  );

const caesarCipherDecrypt = (text, shift) => caesarCipherEncrypt(text, -shift);

// Generate encrypted C++ code
const cppCode = `#include <iostream>\nusing namespace std;\nint main() { cout << 12345; return 0; }`;

// Apply the encryption steps
let encryptedCode = base64Encode(cppCode); // Step 1: Base64 encode
encryptedCode = caesarCipherEncrypt(encryptedCode, 3); // Step 2: Caesar cipher shift

fs.writeFileSync("nextclue.txt", encryptedCode);

// API to validate flag and return encrypted file
app.post("/validate-flag", (req, res) => {
  const { flag } = req.body;
  if (flag === SECRET_FLAG) {
    res.setHeader("Content-Type", "application/octet-stream");
    res.setHeader("Content-Disposition", "attachment; filename=nextclue.txt");
    res.send(fs.readFileSync("nextclue.txt"));
  } else {
    res.status(403).json({ error: "Incorrect flag" });
  }
});

// API to validate final CTF answer
app.post("/validate-final", (req, res) => {
  const userCode = req.body.code;
  const correctCode = "12345"; // This should match the C++ output

  if (String(userCode) !== correctCode) {
    return res.status(403).json({ error: "Incorrect code!" });
  }
  else{

  res.json({ flag: "CTF{SURFER_YOU_CRACKED_IT}" });
  }
});

// Start server
app.listen(5500, () => console.log("Server running on port 3000"));

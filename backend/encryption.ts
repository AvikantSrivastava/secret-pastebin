const algorithm = { name: "AES-GCM", length: 256 };

function encode(text: string): Uint8Array {
  return new TextEncoder().encode(text);
}

function decode(data: ArrayBuffer): string {
  return new TextDecoder().decode(data);
}

async function getKey(passphrase: string): Promise<CryptoKey> {
  const hash = await crypto.subtle.digest("SHA-256", encode(passphrase));
  return crypto.subtle.importKey("raw", hash, algorithm, false, [
    "encrypt",
    "decrypt",
  ]);
}

export async function encrypt(text: string, passphrase: string) {
  const key = await getKey(passphrase);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encode(text),
  );

  return {
    iv: Array.from(iv),
    content: Array.from(new Uint8Array(encrypted)),
  };
}

export async function decrypt(
  encrypted: { iv: number[]; content: number[] },
  passphrase: string,
) {
  const key = await getKey(passphrase);
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: new Uint8Array(encrypted.iv) },
    key,
    new Uint8Array(encrypted.content),
  );

  return decode(decrypted);
}

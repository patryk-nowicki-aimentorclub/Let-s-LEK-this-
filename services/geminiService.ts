// This service simulates an encrypted file by encrypting/decrypting data
// stored in localStorage.
// WARNING: The encryption key is stored in the client-side code, which is not
// secure against a determined attacker who can inspect the source code.
// This approach is chosen based on the project's specific requirement for a
// serverless, simple setup where high security is not a primary concern.

const encoder = new TextEncoder();
const decoder = new TextDecoder();

// A fixed key, stored as a string. This will be imported as a CryptoKey.
const KEY_MATERIAL_STRING = 'my-super-secret-lek-app-key-32-bytes';
const IV_LENGTH = 12; // Bytes for AES-GCM

// Function to derive a CryptoKey from a string
async function getKey(): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(KEY_MATERIAL_STRING.slice(0, 32)), // Use first 32 bytes for AES-256
    { name: 'AES-GCM' },
    false,
    ['encrypt', 'decrypt']
  );
  return keyMaterial;
}

// Encrypts a plaintext string and returns a Base64 encoded string
export async function encrypt(plaintext: string): Promise<string> {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));
  const encryptedContent = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    encoder.encode(plaintext)
  );

  const buffer = new Uint8Array(iv.length + encryptedContent.byteLength);
  buffer.set(iv, 0);
  buffer.set(new Uint8Array(encryptedContent), iv.length);

  return btoa(String.fromCharCode.apply(null, Array.from(buffer)));
}

// Decrypts a Base64 encoded string and returns the original plaintext
export async function decrypt(base64Ciphertext: string): Promise<string> {
    const buffer = Uint8Array.from(atob(base64Ciphertext), c => c.charCodeAt(0));
    const key = await getKey();
    const iv = buffer.slice(0, IV_LENGTH);
    const data = buffer.slice(IV_LENGTH);

    const decryptedContent = await crypto.subtle.decrypt(
        {
            name: 'AES-GCM',
            iv: iv,
        },
        key,
        data
    );

    return decoder.decode(decryptedContent);
}


// Hashes a password using SHA-256 and returns a hex string
export async function hashPassword(password: string): Promise<string> {
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

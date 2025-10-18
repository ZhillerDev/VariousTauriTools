use serde::{Serialize, Deserialize};
use std::error::Error;

// XOR 密钥（可自定义长度，建议至少 8 字节）
// 注意：生产环境需动态生成，不要硬编码！
const XOR_KEY: &[u8] = b"secret_key_for_secret"; // 示例密钥

// XOR 加解密（同一函数，加密后再加密一次即解密）
fn xor_crypt(data: &[u8], key: &[u8]) -> Vec<u8> {
  data.iter()
      .zip(key.iter().cycle()) // 循环使用密钥（密钥长度可小于数据长度）
      .map(|(d, k)| d ^ k)
      .collect()
}

// 加密数据（序列化 + XOR）
pub fn encrypt_data<T: Serialize>(data: &T) -> Result<Vec<u8>, Box<dyn Error>> {
  let json_str = serde_json::to_string(data)?; // 序列化为 JSON
  let encrypted = xor_crypt(json_str.as_bytes(), XOR_KEY);
  Ok(encrypted)
}

// 解密数据（XOR + 反序列化）
pub fn decrypt_data<T: for<'de> Deserialize<'de>>(encrypted_data: &[u8]) -> Result<T, Box<dyn Error>> {
  let decrypted_bytes = xor_crypt(encrypted_data, XOR_KEY); // XOR 解密
  let data: T = serde_json::from_slice(&decrypted_bytes)?; // 反序列化
  Ok(data)
}
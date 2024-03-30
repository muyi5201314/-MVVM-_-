import path from 'path'
import fs from 'fs'

const filePath = 'D:/新建文件夹/qq/playerassets.assets';
// const outputFile = path.join("C:/Users/11971/Downloads/lysjdsn_134297/assets/assetpack/cc", `${Math.random().toString(36).substring(7)}.ab`);

// 定义要扫描的字节序列和标志
const signature = Buffer.from([0x55, 0x6E, 0x69, 0x74, 0x79, 0x46, 0x53, 0x00, 0x00, 0x00, 0x00, 0x08, 0x35, 0x2E, 0x78, 0x2E, 0x78]);
const unityFSSignature = Buffer.from('UnityFS');

// 读取二进制文件
fs.readFile(filePath, (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  let currentIndex = 0;
  let matches = [];
  
  // 扫描文件以找到所有匹配项
  while ((currentIndex = data.indexOf(signature, currentIndex)) !== -1) {
    matches.push(currentIndex);
    currentIndex += signature.length;
  }

  if (matches.length === 0) {
    console.error('Signature not found in the file.');
    return;
  }
  console.log(matches.length);

  let outputFile
  let fileIndex = 0
  // 针对每个匹配项提取内容
  for (let i = 0; i < matches.length; i++) {
    let matchIndex = matches[i]
    const unityFSIndex = data.indexOf(unityFSSignature, matchIndex + 1);
    if (unityFSIndex !== -1) {
      // 提取需要的内容
      const extractedContent = data.slice(matchIndex, unityFSIndex);
      // 创建并写入新文件s
      try {
        // 同步写入新文件
        outputFile = path.join("D:/新建文件夹/qq/cc", `${fileIndex++}.ab`);
        fs.writeFileSync(outputFile, extractedContent);
        console.log(`Content extracted and saved to ${outputFile}`);
      } catch (writeErr) {
        console.error('Error writing to the output file:', writeErr);
      }

    }
  }
});
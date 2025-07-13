// Fallback image upload using base64 data URLs
export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
    reader.readAsDataURL(file);
  });
};

// Convert multiple files to base64
export const convertFilesToBase64 = async (files: File[]): Promise<string[]> => {
  const base64Promises = files.map(file => convertToBase64(file));
  return Promise.all(base64Promises);
};
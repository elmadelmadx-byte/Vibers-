/**
 * Utility functions for fast, reliable image handling, compression, and direct preview.
 */

export async function processImageFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('الملف المختار ليس صورة صالحة'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('فشل قراءة ملف الصورة'));

    reader.onload = () => {
      const rawDataUrl = reader.result as string;

      // If file is smaller than 700KB, return as-is immediately
      if (file.size <= 700 * 1024) {
        resolve(rawDataUrl);
        return;
      }

      // For larger images, optimize via canvas to ensure instant rendering and fast sync
      const img = new Image();
      img.onerror = () => resolve(rawDataUrl); // Fallback to raw data URL on any error
      img.onload = () => {
        try {
          const maxDim = 1920;
          let width = img.width;
          let height = img.height;

          if (width > maxDim || height > maxDim) {
            if (width > height) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            } else {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(rawDataUrl);
            return;
          }

          ctx.drawImage(img, 0, 0, width, height);
          const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
          const optimizedDataUrl = canvas.toDataURL(mimeType, 0.88);
          resolve(optimizedDataUrl);
        } catch {
          resolve(rawDataUrl);
        }
      };
      img.src = rawDataUrl;
    };

    reader.readAsDataURL(file);
  });
}

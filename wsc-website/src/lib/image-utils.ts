/**
 * Check that an image file is within max width and height. Rejects if over.
 * No resizing — user must provide an image that fits.
 */
export function validateImageDimensions(
  file: File,
  maxWidth: number,
  maxHeight: number
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      resolve();
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);
      const { width, height } = img;
      if (width > maxWidth || height > maxHeight) {
        reject(
          new Error(
            `Image dimensions are too large. Maximum size is ${maxWidth}×${maxHeight} pixels (width×height). Your image is ${width}×${height} pixels. Please resize or crop the image before uploading.`
          )
        );
        return;
      }
      resolve();
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Could not read the image file. Make sure it\'s a valid image (JPEG, PNG, WebP, or AVIF) and try again.'));
    };

    img.src = url;
  });
}

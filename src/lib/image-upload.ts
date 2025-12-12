import imageCompression from "browser-image-compression";

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 0.3, // Target 300KB
    maxWidthOrHeight: 1280, // Good for mobile
    useWebWorker: true,
    fileType: "image/webp" as const,
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Image compression failed:", error);
    // Return original file if compression fails
    return file;
  }
}

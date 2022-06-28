import * as fsp from 'fs/promises';
import * as path from 'path';

const MEDIA_FOLDER = path.join(__dirname, '..', '..', 'media');

export class ImageService {
  private static instance: ImageService;

  private constructor() {
    // Intentionally left blank
  }

  public static getInstance(): ImageService {
    if (!this.instance) {
      this.instance = new ImageService();
    }

    return this.instance;
  }

  /**
   * Delete image from disk.
   * @param name
   * @returns true if an image was deleted, false otherwise.
   */
  public async deleteImage(name: string): Promise<boolean> {
    const destination = this.getPath(name);

    if (await this.fileExists(destination)) {
      await fsp.unlink(destination);
      try {
        // Remove dir if empty
        await fsp.rmdir(path.dirname(destination));
      } catch {
        // Errors on non-empty dir, ignore it
      }
      return true;
    }
    return false;
  }

  /**
   * Save an image to disk.
   *
   * @param buffer
   * @param name
   * @returns Returns true if file was saved, false if it exists.
   */
  public async saveImage(buffer: Buffer, name: string): Promise<boolean> {
    const destination = this.getPath(name);

    await fsp.mkdir(path.dirname(destination), { recursive: true });

    if (await this.fileExists(destination)) {
      return false;
    }

    await fsp.writeFile(destination, buffer, 'binary');

    return true;
  }

  /**
   * Get filepath from file name.
   */
  private getPath(name: string): string {
    return path.join(MEDIA_FOLDER, path.normalize(name));
  }

  /**
   * Checks whether or not a file exists.
   */
  private async fileExists(file: string): Promise<boolean> {
    try {
      const stat = await fsp.stat(file);
      if (stat.isFile()) {
        return true;
      }
    } catch (error) {
      // stat errors on non-existent file, ignore it to return false.
    }

    return false;
  }
}

import * as fsp from 'fs/promises';
import * as path from 'path';

const MEDIA_FOLDER = path.join(__dirname, '..', '..', 'media');

export class ImageService {
  public async deleteImage(name: string): Promise<boolean> {
    const destination = this.getPath(name);

    if (await this.fileExists(destination)) {
      await fsp.unlink(destination);
      try {
        // Removy empty dirs only
        await fsp.rmdir(path.dirname(destination));
      } catch {
        // Ignore error
      }
      return true;
    }
    return false;
  }

  public async saveImage(buffer: Buffer, name: string): Promise<boolean> {
    const destination = this.getPath(name);

    await fsp.mkdir(path.dirname(destination), { recursive: true });

    if (await this.fileExists(destination)) {
      return false;
    }

    await fsp.writeFile(destination, buffer, 'binary');

    return true;
  }

  private getPath(name: string): string {
    return path.join(MEDIA_FOLDER, path.normalize(name));
  }

  private async fileExists(file: string): Promise<boolean> {
    try {
      const stat = await fsp.stat(file);
      if (stat.isFile()) {
        return true;
      }
    } catch (error) {
      // Ignore error
    }

    return false;
  }
}

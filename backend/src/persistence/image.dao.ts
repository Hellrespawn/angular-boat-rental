import * as fsp from 'fs/promises';
import * as path from 'path';

export class ImageDao {
  private static instance?: ImageDao;

  private constructor(
    private folder = path.join(__dirname, '..', '..', 'media')
  ) {
    // Intentionally left blank
  }

  public static getInstance(): ImageDao {
    if (!this.instance) {
      this.instance = new ImageDao();
    }

    return this.instance;
  }

  public async delete(filename: string): Promise<boolean> {
    if (await this.exists(filename)) {
      await fsp.unlink(filename);
      try {
        // Remove dir if empty
        await fsp.rmdir(path.dirname(filename));
      } catch {
        // Errors on non-empty dir, ignore it
      }
      return true;
    }
    return false;
  }

  public async save(buffer: Buffer, filename: string): Promise<boolean> {
    await fsp.mkdir(path.dirname(filename), { recursive: true });

    if (await this.exists(filename)) {
      return false;
    }

    await fsp.writeFile(filename, buffer, 'binary');

    return true;
  }

  public async exists(filename: string): Promise<boolean> {
    try {
      const stat = await fsp.stat(filename);
      if (stat.isFile()) {
        return true;
      }
    } catch (error) {
      // stat errors on non-existent file, ignore it to return false.
    }

    return false;
  }

  public getPath(name: string): string {
    return path.join(this.folder, path.normalize(name));
  }
}

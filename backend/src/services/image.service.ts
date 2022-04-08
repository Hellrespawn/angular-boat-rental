import * as fs from 'fs/promises';
import * as path from 'path';

const MEDIA_FOLDER = path.join(__dirname, '..', '..', 'media');

export class ImageService {
  public async saveImage(image: Buffer, name: string): Promise<string> {
    const destination = this.getPath(name);

    await fs.writeFile(destination, image);

    return destination;
  }

  public async getImagePath(name: string): Promise<string> {
    const destination = this.getPath(name);

    const stat = await fs.stat(destination);
    if (!stat.isFile()) {
      throw Error(`${name} is not a valid file!`);
    }

    return destination;
  }

  private getPath(name: string): string {
    return path.join(MEDIA_FOLDER, path.normalize(name));
  }
}

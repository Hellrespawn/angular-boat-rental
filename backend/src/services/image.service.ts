import { ImageDao } from '../persistence/image.dao';

export class ImageService {
  private static instance?: ImageService;

  private constructor(private imageDao = ImageDao.getInstance()) {}

  public static getInstance(): ImageService {
    if (!this.instance) {
      this.instance = new ImageService();
    }

    return this.instance;
  }

  public delete(filename: string): Promise<boolean> {
    const target = this.imageDao.getPath(filename);
    return this.imageDao.delete(target);
  }

  public save(buffer: Buffer, filename: string): Promise<boolean> {
    const target = this.imageDao.getPath(filename);
    return this.imageDao.save(buffer, target);
  }

  public exists(filename: string): Promise<boolean> {
    const target = this.imageDao.getPath(filename);
    return this.imageDao.exists(target);
  }
}

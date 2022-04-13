import { Request, Response } from 'express';
import { ImageService } from '../services/image.service';

export class ImageController {
  constructor(private imageService: ImageService = new ImageService()) {}

  /**
   * Returns buffer with image from request.
   *
   * TODO No security at this point, will take any file of any size.
   *
   * @param req
   * @returns
   */
  private async bufferImage(req: Request): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const chunks: Buffer[] = [];

      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });

      req.on('end', () => {
        const buffer = Buffer.concat(chunks);
        resolve(buffer);
      });

      req.on('error', reject);
    });
  }

  /**
   * Saves image to disk and responds with the route.
   */
  public async saveImage(req: Request, res: Response): Promise<void> {
    const buffer = await this.bufferImage(req);
    const name = req.params.name;

    if (await this.imageService.saveImage(buffer, name)) {
      res.json({ route: `/image/${name}` });
    } else {
      res.status(400).json({ error: 'File exists!' });
    }
  }

  /**
   * Deletes an image from disk and responds with the former route.
   */
  public async deleteImage(req: Request, res: Response): Promise<void> {
    const name = req.params.name;

    if (await this.imageService.deleteImage(name)) {
      res.json({ deleted: `/image/${name}` });
    } else {
      res.status(404).end();
    }
  }
}

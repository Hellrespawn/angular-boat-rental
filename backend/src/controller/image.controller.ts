import { ImageResponse } from 'auas-common';
import { type Request, type Response } from 'express';
import { ImageService } from '../services/image.service';

export class ImageController {
  private static instance?: ImageController;

  private constructor(private imageService = ImageService.getInstance()) {}

  public static getInstance(): ImageController {
    if (!this.instance) {
      this.instance = new ImageController();
    }

    return this.instance;
  }

  /**
   * Saves image to disk and responds with the route.
   *
   * @param req
   * @param res
   */
  public async save(req: Request, res: Response): Promise<void> {
    const buffer = await this.bufferImage(req);
    const { name } = req.params;

    const imageResponse: ImageResponse = { route: `/images/${name}` };

    if (await this.imageService.save(buffer, name)) {
      console.log(`Saved image to /images/${name}`);
      res.json(imageResponse);
    } else {
      res.status(400).json({ error: 'File exists!' });
    }
  }

  /**
   * Saves image to disk and responds with the route.
   *
   * @param req
   * @param res
   */
  public async exists(req: Request, res: Response): Promise<void> {
    const { name } = req.params;

    if (await this.imageService.exists(name)) {
      res.status(400).json({ error: 'File exists!' });
    } else {
      res.status(200).end();
    }
  }

  /**
   * Deletes an image from disk and responds with the former route.
   *
   * @param req
   * @param res
   */
  public async delete(req: Request, res: Response): Promise<void> {
    const { name } = req.params;

    if (await this.imageService.delete(name)) {
      console.log(`deleted /images/${name}`);
      res.json({ deleted: `/images/${name}` });
    } else {
      res.status(404).end();
    }
  }

  /**
   * Returns buffer with image from request.
   *
   * @param req
   *
   * TODO No security at this point, will take any file of any size.
   */
  private bufferImage(req: Request): Promise<Buffer> {
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
}

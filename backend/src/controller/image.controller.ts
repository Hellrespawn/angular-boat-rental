import { Request, Response } from 'express';
import { ImageService } from '../services/image.service';

export class ImageController {
  constructor(private imageService: ImageService = new ImageService()) {}

  public async saveImage(req: Request, res: Response): Promise<void> {
    // TODO Moet nog gedaan worden!
    const error = 'saveImage() is not yet implemented!';
    res.status(500).json({ error });
    throw error;
  }

  public async getImage(req: Request, res: Response): Promise<void> {
    const name = req.params.name;
    const path = await this.imageService.getImagePath(name);
    res.sendFile(path);
  }
}

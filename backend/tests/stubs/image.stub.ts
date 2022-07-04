import { type SinonSandbox, type SinonStub } from 'sinon';
import { ImageDao } from '../../src/persistence/image.dao';

export function stubImageDao(sandbox: SinonSandbox): {
  imageDaoDeleteStub: SinonStub<[filename: string], Promise<boolean>>;
  imageDaoExistsStub: SinonStub<[filename: string], Promise<boolean>>;
  imageDaoSaveStub: SinonStub<
    [buffer: Buffer, filename: string],
    Promise<boolean>
  >;
} {
  const imageDaoDeleteStub = sandbox.stub(ImageDao.prototype, 'delete');
  const imageDaoExistsStub = sandbox.stub(ImageDao.prototype, 'exists');
  const imageDaoSaveStub = sandbox.stub(ImageDao.prototype, 'save');

  return { imageDaoDeleteStub, imageDaoExistsStub, imageDaoSaveStub };
}

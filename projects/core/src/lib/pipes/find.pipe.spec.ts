import { FindPipe } from './find.pipe';

describe('FindPipe', (): void => {
    it('create an instance', (): void => {
        const pipe: FindPipe = new FindPipe();
        void expect(pipe).toBeTruthy();
    });
});

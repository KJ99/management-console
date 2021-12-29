import * as PathUtil from  '../../../utils/PathUtil';

describe('Path util tests', () => {
    it('with all', () => {
        const path = PathUtil.preparePath(
            'https://localhost:3000/:hello/world',
            { hello: 'elmo' },
            { foo: 'bar', one: 'two' }
        );

        expect(path).toBe('https://localhost:3000/elmo/world?foo=bar&one=two')
    });
    it('without query', () => {
        const path = PathUtil.preparePath(
            'https://localhost:3000/:hello/world',
            { hello: 'elmo' }
        );

        expect(path).toBe('https://localhost:3000/elmo/world')
    });
    it('with base only', () => {
        const path = PathUtil.preparePath('https://localhost:3000/hello/world');

        expect(path).toBe('https://localhost:3000/hello/world')
    });
});
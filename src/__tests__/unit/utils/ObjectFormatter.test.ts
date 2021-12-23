import * as ObjectFormatter from '../../../utils/ObjectFormatter';

it('formats', () => {
    const source = {
        foo: null,
        hello: undefined,
        prop: 1,
        emp: '',
        tee: NaN
    }

    ObjectFormatter.format(source);

    const expected = {
        prop: 1
    }

    expect(JSON.stringify(source)).toBe(JSON.stringify(expected));
})
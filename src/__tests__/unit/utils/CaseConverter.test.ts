import Naming from '../../../extension/Naming';
import * as CaseConverter from '../../../utils/CaseConverter';

it('Camel to Sneak', () => {
    const source = {
        helloWorld: 'Hello',
        fooBar: 10,
        foo1: [
            18,
            {
                arrayObjProp1: 'Foo',
                objNested: {
                    nestedProp: 'Hello',
                    nestedProp2: 'World'
                }
            } 
        ]
    };

    const expected = {
        hello_world: 'Hello',
        foo_bar: 10,
        foo1: [
            18,
            {
                array_obj_prop1: 'Foo',
                obj_nested: {
                    nested_prop: 'Hello',
                    nested_prop2: 'World'
                }
            } 
        ]
    };

    const result = CaseConverter.convert(source, Naming.SNAKE_CASE);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

it('Camel to Sneak Array', () => {
    const source = [
        {
            helloWorld: 'Hello',
            fooBar: 10,
            foo1: [
                18,
                {
                    arrayObjProp1: 'Foo',
                    objNested: {
                        nestedProp: 'Hello',
                        nestedProp2: 'World'
                    }
                } 
            ]
        },
        {
            helloWorld: 'Hello',
            fooBar: 10,
            foo1: [
                18,
                {
                    arrayObjProp1: 'Foo',
                    objNested: {
                        nestedProp: 'Hello',
                        nestedProp2: 'World'
                    }
                } 
            ]
        }
    ];
    const expected = [
        {
            hello_world: 'Hello',
            foo_bar: 10,
            foo1: [
                18,
                {
                    array_obj_prop1: 'Foo',
                    obj_nested: {
                        nested_prop: 'Hello',
                        nested_prop2: 'World'
                    }
                } 
            ]
        },
        {
            hello_world: 'Hello',
            foo_bar: 10,
            foo1: [
                18,
                {
                    array_obj_prop1: 'Foo',
                    obj_nested: {
                        nested_prop: 'Hello',
                        nested_prop2: 'World'
                    }
                } 
            ]
        }
    ];

    const result = CaseConverter.convert(source, Naming.SNAKE_CASE);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

it('Sneak to Camel', () => {
    const source = {
        hello_world: 'Hello',
        foo_bar: 10,
        foo1: [
            18,
            {
                array_obj_prop1: 'Foo',
                obj_nested: {
                    nested_prop: 'Hello',
                    nested_prop2: 'World'
                }
            } 
        ]
    };

    const expected = {
        helloWorld: 'Hello',
        fooBar: 10,
        foo1: [
            18,
            {
                arrayObjProp1: 'Foo',
                objNested: {
                    nestedProp: 'Hello',
                    nestedProp2: 'World'
                }
            } 
        ]
    };


    const result = CaseConverter.convert(source, Naming.CAMEL_CASE);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));

});

it('Sneak to Camel Array', () => {
    const source = [
        {
            hello_world: 'Hello',
            foo_bar: 10,
            foo1: [
                18,
                {
                    array_obj_prop1: 'Foo',
                    obj_nested: {
                        nested_prop: 'Hello',
                        nested_prop2: 'World'
                    }
                } 
            ]
        },
        {
            hello_world: 'Hello',
            foo_bar: 10,
            foo1: [
                18,
                {
                    array_obj_prop1: 'Foo',
                    obj_nested: {
                        nested_prop: 'Hello',
                        nested_prop2: 'World'
                    }
                } 
            ]
        }
    ];
    const expected = [
        {
            helloWorld: 'Hello',
            fooBar: 10,
            foo1: [
                18,
                {
                    arrayObjProp1: 'Foo',
                    objNested: {
                        nestedProp: 'Hello',
                        nestedProp2: 'World'
                    }
                } 
            ]
        },
        {
            helloWorld: 'Hello',
            fooBar: 10,
            foo1: [
                18,
                {
                    arrayObjProp1: 'Foo',
                    objNested: {
                        nestedProp: 'Hello',
                        nestedProp2: 'World'
                    }
                } 
            ]
        }
    ];

    const result = CaseConverter.convert(source, Naming.CAMEL_CASE);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));

});


it('Camel to Kebab', () => {
    const source = {
        fooBar: 'foo',
        barFoo: 'bar'
    };
    
    const expected = {
        'foo-bar': 'foo',
        'bar-foo': 'bar'
    }

    const result = CaseConverter.convert(source, Naming.KEBAB_CASE);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));
});

it('Kebab to Camel', () => {
    const source = {
        'foo-bar': 'foo',
        'bar-foo': 'bar'
    }

    const expected = {
        fooBar: 'foo',
        barFoo: 'bar'
    };

    const result = CaseConverter.convert(source, Naming.CAMEL_CASE);

    expect(JSON.stringify(result)).toBe(JSON.stringify(expected));

});
import ApiClient from "../../../../infrastructure/api/ApiClient";
import nock from 'nock';
import fetchMock from "fetch-mock";
import UnauthorizedError from "../../../../infrastructure/api/exceptions/UnauthorizedError";
import UnexpectedError from "../../../../infrastructure/api/exceptions/UnexpectedError";
import BadRequestError from "../../../../infrastructure/api/exceptions/BadRequestError";
import ForbiddenError from "../../../../infrastructure/api/exceptions/ForbiddenError";
import NotFoundError from "../../../../infrastructure/api/exceptions/NotFoundError";

class TestModel {
    strProp: string;
    numberProp: number;
    boolProp: boolean;

    constructor(strProp: string, numberProp: number, boolProp: boolean) {
        this.strProp = strProp;
        this.numberProp = numberProp;
        this.boolProp = boolProp;
    }
}

class ResponseModel {
    createdId: number = 0;
}

class QueryModel {
    fooBar: string|null = null;
    bar: number|null = null;
}

afterEach(() => {
    fetchMock.restore();
});

it('get with query', async () => {    
    fetchMock.get('http://localhost/v1/test?foo-bar=hello', 200, {
        response: {
            str_prop: 'Hello, World',
            number_prop: 10,
            bool_prop: true
        }
    })
    
    const query = new QueryModel();
    query.fooBar = 'hello';

    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    
    const result = await client.get({ url: '/test', query: query }, TestModel);

    expect(result).toBeInstanceOf(TestModel);
    expect(result.strProp).toBe('Hello, World');
    expect(result.numberProp).toBe(10);
    expect(result.boolProp).toBe(true);
});

it('get with route params', async () => {
    fetchMock.get('http://localhost/v1/test/17', 200, {
        response: {
            str_prop: 'Hello, World',
            number_prop: 10,
            bool_prop: true
        }
    });

    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    
    const result = await client.get({ url: '/test/:id', routeParams: { id: 17 } }, TestModel);

    expect(result).toBeInstanceOf(TestModel);
    expect(result.strProp).toBe('Hello, World');
    expect(result.numberProp).toBe(10);
    expect(result.boolProp).toBe(true);

})

it('post', async () => {
    fetchMock.post('http://localhost/v1/test', 201, {
        response: {
            created_id: 10
        }
    });
    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });

    const body = new TestModel('one', 1, true);

    const result = await client.post({ url: '/test', body: body }, ResponseModel);

    expect(result).toBeInstanceOf(ResponseModel);
    expect(result.createdId).toBe(10);
})

it('patch', async () => {
    fetchMock.patch('http://localhost/v1/test', 204);
    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    const body = [{ op: 'replace', path: '/nameFoo', value: 'foo' }];

    await client.patch({ url: '/test', body: body });
})

it('put', async () => {
    fetchMock.put('http://localhost/v1/test', 204);
    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    const body = new TestModel('', 10, true);

    await client.put({ url: '/test', body: body });

})

it('delete', async () => {
    fetchMock.delete('http://localhost/v1/test/1', 204);
    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });

    await client.delete({ url: '/test/:id', routeParams: { id: 1 } });
})

it('token expired', async () => {
    fetchMock.getOnce('http://localhost/v1/test', 401);
    fetchMock.put('*', 200, {
        response: { access_token: 'Hello' }
    });
    fetchMock.getOnce('http://localhost/v1/test', 200, {
        response: {
            str_prop: 'Hello, World',
            number_prop: 10,
            bool_prop: true
        },
        overwriteRoutes: false
    });

    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    
    const result = await client.get({ url: '/test' }, TestModel);

    expect(result).toBeInstanceOf(TestModel);
    expect(result.strProp).toBe('Hello, World');
    expect(result.numberProp).toBe(10);
    expect(result.boolProp).toBe(true);
});

it('unauthorized', async () => {
    fetchMock.get('http://localhost/v1/test', 401);
    fetchMock.put('*', 401, {
        response: { access_token: 'Hello' }
    });
    
    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    let error: any = null;
    try {
        await client.get({ url: '/test' }, TestModel);
    } catch(e) {
        error = e;
    }

    expect(error).toBeInstanceOf(UnauthorizedError);
});

it('forbidden', async () => {
    fetchMock.get('http://localhost/v1/test', 403);
    
    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    let error: any = null;
    try {
        await client.get({ url: '/test' }, TestModel);
    } catch(e) {
        error = e;
    }

    expect(error).toBeInstanceOf(ForbiddenError);
});

it('not found', async () => {
    fetchMock.get('http://localhost/v1/test', 404);
    const client = new ApiClient({ host: 'http://localhost', baseUrl: 'v1' });
    let error: any = null;
    try {
        await client.get({ url: '/test' }, TestModel);
    } catch(e) {
        error = e;
    }

    expect(error).toBeInstanceOf(NotFoundError);
});
import MediaType from "../../extension/MediaType";
import * as TokenStorage from "../../utils/TokenStorage";
import HttpStatus from '../../extension/HttpStatus';
import BadRequestError from "./exceptions/BadRequestError";
import UnauthorizedError from "./exceptions/UnauthorizedError";
import ForbiddenError from "./exceptions/ForbiddenError";
import NotFoundError from "./exceptions/NotFoundError";
import UnexpectedError from "./exceptions/UnexpectedError";
import { ClassConstructor, classToPlain, instanceToPlain, plainToClass } from "class-transformer";
import { camelCase, paramCase, snakeCase } from "change-case";
import ApiError from "../../models/ApiError";
import HttpMethod from "../../extension/HttpMethod";
import joinUrl from 'url-join';
import * as CaseConverter from '../../utils/CaseConverter';
import Naming from "../../extension/Naming";
import * as Formatter from '../../utils/ObjectFormatter';

export interface ApiClientOptions {
    host: string,
    baseUrl?: string,
}

export interface RequestOptions {
    url: string,
    method: string,
    contentType?: string,
    body?: string|FormData,
    credentials: RequestCredentials,
    accept: string,
    preventTokenRefresh?: boolean,
}

export interface ApiCallOptions {
    url?: string,
    contentType?: string,
    routeParams?: object,
    query?: object,
    body?: any,
    preventTokenRefresh?: boolean,
    isFormData?: boolean,
    credentials?: RequestCredentials,
    accept?: string,
}

export default class ApiClient {
    private _options: ApiClientOptions

    constructor(options: ApiClientOptions) {
        this._options = options;
    }

    async get<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return this.request(this.requestOptions(HttpMethod.get, options), targetClass);
    }

    async post<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return this.request(
            this.requestOptions(HttpMethod.post, options, this.requestBody(options.body, options.isFormData ?? false)),
            targetClass
        );
    }

    async patch<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return this.request(
            this.requestOptions(HttpMethod.patch, options, this.requestBody(options.body))),
            targetClass
    }

    async put<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return this.request(
            this.requestOptions(HttpMethod.put, options, this.requestBody(options.body))),
            targetClass
    }

    async delete<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return this.request(this.requestOptions(HttpMethod.delete, options), targetClass);
    }

    private requestOptions(method: string, callOptions: ApiCallOptions, body: any = null): RequestOptions {
        return {
            method: method,
            url: this.requestUrl(callOptions.url, callOptions.routeParams, callOptions.query),
            credentials: callOptions.credentials ?? 'omit',
            accept: callOptions.accept ?? MediaType.json,
            body: body,
            contentType: callOptions.contentType
        }
    }

    private requestUrl(url: string|undefined, params: any, query: any): string {
        url ??= '';
        if (params != null && typeof params == 'object') {
            url = this.applyParams(url, params);
        }
        if (query != null && typeof query == 'object') {
            url = joinUrl(url, this.queryString(query));
        }

        const { host, baseUrl } = this._options;
        const base = baseUrl != null ? joinUrl(host, baseUrl) : host;

        return joinUrl(base, url);
    }

    private queryString(query: any): string {
        const plain = instanceToPlain(query);
        const converted = CaseConverter.convert(plain, Naming.KEBAB_CASE);
        Formatter.format(converted);
        const items = Object.keys(converted).map((key) => `${key}=${converted[key]}`);

        return items.length > 0 ? `?${items.join('&')}` : '';
    }

    private applyParams(url: string, params: any): string {
        Object.keys(params).forEach((key) => url = url.replace(`:${key}`, params[key]));
        
        return url;
    }

    private requestBody(data: any, isFormData: boolean = false) {
        let result = null;
        if (data != null) {
            if(isFormData) {
                result = this.formDataBody(data);
            } else {
                const plain = instanceToPlain(data);
                const converted = CaseConverter.convert(plain, Naming.SNAKE_CASE);
                Formatter.format(converted);
                
                result = JSON.stringify(converted);
            }
        }

        return result;
    }

    private formDataBody(data: any): FormData {
        const form = new FormData();
        Object.keys(data).forEach((key) => form.append(key, data[key]));

        return form;
    }

    private async request<T>(options: RequestOptions, targetClass: ClassConstructor<T>|null = null): Promise<any> {
        const response = await fetch(options.url, {
            method: options.method,
            mode: 'cors',
            credentials: options.credentials,
            headers: {
                'accept': options.accept ?? MediaType.json,
                ...this.contentTypeHeader(options),
                ...this.authHeader()
            },
            body: options.body
        });
        return response.ok 
            ? this.processSuccessfulResponse(response, targetClass) 
            : this.processErrorResponse(response, options, targetClass);
    }

    private async processErrorResponse<T>(
        response: Response, 
        requestOptions: RequestOptions, 
        targetClass: ClassConstructor<T>|null = null) {
        let result = null;
        switch(response.status) {
            case HttpStatus.badRequest:
                this.onBadRequest(response);
                break;
            case HttpStatus.unauthorized:
                result = this.onUnathorized(requestOptions, targetClass);
                 break;
            case HttpStatus.forbidden:
                this.onForbidden();
                break;
            case HttpStatus.notFound:
                this.onNotFound();
                break;
            default:
                this.onUnexpectedError();
                break;
        }

        return result;
    }

    private async onBadRequest(response: Response) {
        const body = await response.json();
        const converted = CaseConverter.convert(body, Naming.CAMEL_CASE);
        const errors = plainToClass(ApiError, converted);

        throw new BadRequestError(errors);
    }

    private async onUnathorized<T>(requestOptions: RequestOptions, targetClass: ClassConstructor<T>|null = null) {
        if(!requestOptions.preventTokenRefresh) {
            await this.refreshToken();
            return await this.request(
                {
                    ...requestOptions,
                    preventTokenRefresh: true
                },
                targetClass
            )
        } else {
            throw new UnauthorizedError();
        }
    }

    private onForbidden() {
        throw new ForbiddenError();
    }

    private onNotFound() {
        throw new NotFoundError();
    }

    private onUnexpectedError() {
        throw new UnexpectedError();
    }

    private async refreshToken() {
        try {
            const { accessToken } = await this.request({
                url: TokenStorage.RefreshTokenUrl,
                credentials: 'include',
                method: HttpMethod.put,
                accept: MediaType.json,
                preventTokenRefresh: true
            });

            TokenStorage.saveAccessToken(accessToken);
        } catch(e) {}
    }

    private async processSuccessfulResponse<T>(response: Response, targetClass: ClassConstructor<T>|null = null) {
        let result = null;
        if (response.status != HttpStatus.noContent) {
            if (response.headers.get('Content-Type') == MediaType.json) {
                result = this.processJsonResponse(response, targetClass);
            } else {
                result = await response.blob();
            }
        }

        return result;
    }

    private async processJsonResponse<T>(response: Response, targetClass: ClassConstructor<T>|null = null) {
        const json = await response.json();
        const jsonCamelCase = CaseConverter.convert(json, Naming.CAMEL_CASE);

        return targetClass != null ? plainToClass(targetClass, jsonCamelCase) : jsonCamelCase;
    }

    private authHeader(): object {
        const accessToken = TokenStorage.getAccessToken();
        const result: any = {};
        if(accessToken != null) {
            result.authorization = `${TokenStorage.TokenType} ${accessToken}`
        }

        return result;
    }

    private contentTypeHeader(options: RequestOptions): object {
        const result: any = {};
        if(options.contentType != null) {
            result['content-type'] = options.contentType;
        }

        return result;
    }
}
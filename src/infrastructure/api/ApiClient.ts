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
import ConflictError from "./exceptions/ConflictError";
import * as PathUtil from '../../utils/PathUtil';

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
        return await  this.request(this.requestOptions(HttpMethod.get, options), targetClass);
    }

    async post<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return await  this.request(
            this.requestOptions(HttpMethod.post, options, this.requestBody(options.body, options.isFormData ?? false)),
            targetClass
        );
    }

    async patch<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return await  this.request(
            this.requestOptions(HttpMethod.patch, options, this.requestBody(options.body))),
            targetClass
    }

    async put<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return await this.request(
            this.requestOptions(HttpMethod.put, options, this.requestBody(options.body))),
            targetClass
    }

    async delete<T>(options: ApiCallOptions, targetClass: ClassConstructor<T>|null = null) {
        return await  this.request(this.requestOptions(HttpMethod.delete, options), targetClass);
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

    private requestUrl(path: string|undefined, params: any, query: any): string {
        const { host, baseUrl } = this._options;
        const base = baseUrl != null ? joinUrl(host, baseUrl) : host;
        let url = joinUrl(base, path ?? '');

        if (params != null && typeof params == 'object') {
            url = PathUtil.applyParams(url, params);
        }
        if (query != null && typeof query == 'object') {
            url = joinUrl(url, this.queryString(query));
        }

        return url;
    }

    private queryString(query: any): string {
        const plain = instanceToPlain(query);
        const converted = CaseConverter.convert(plain, Naming.KEBAB_CASE);
        Formatter.format(converted);

        return PathUtil.createQueryString(converted);
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

        let result: any = null;
        if(response.ok) {
            result = await this.processSuccessfulResponse<T>(response, targetClass);
        } else {
            let errorProcessingResult: any = await this.processErrorResponse(response, options, targetClass);
            if(errorProcessingResult instanceof Error) {
                throw errorProcessingResult;
            } else {
                result = errorProcessingResult;
            }
        }

        return result;
    }

    private async processErrorResponse<T>(
        response: Response, 
        requestOptions: RequestOptions, 
        targetClass: ClassConstructor<T>|null = null) {
        let result = null;
        switch(response.status) {
            case HttpStatus.badRequest:
                result = this.onBadRequest(response);
                break;
            case HttpStatus.conflict:
                result = this.onConflict(response);
                break;
            case HttpStatus.unauthorized:
                result = this.onUnathorized(requestOptions, targetClass);
                 break;
            case HttpStatus.forbidden:
                result = this.onForbidden(response);
                break;
            case HttpStatus.notFound:
                result = this.onNotFound();
                break;
            default:
                result = this.onUnexpectedError();
                break;
        }

        return result;
    }

    private async onBadRequest(response: Response): Promise<BadRequestError> {
        const body = await response.json();
        const converted = CaseConverter.convert(body, Naming.CAMEL_CASE);
        const errors = plainToClass(ApiError, converted);
        return new BadRequestError(errors);
    }

    private async onUnathorized<T>(
        requestOptions: RequestOptions, 
        targetClass: ClassConstructor<T>|null = null
    ): Promise<UnauthorizedError|null> {
        let error: UnauthorizedError|null = null;
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
            error = new UnauthorizedError();
        }

        return error;
    }

    private async onConflict(response: Response): Promise<ConflictError> {
        const body = await response.json();
        const converted = CaseConverter.convert(body, Naming.CAMEL_CASE);
        const error = plainToClass(ApiError, converted);
        return new ConflictError(error);
    }

    private async onForbidden(response: Response): Promise<ForbiddenError> {
        const error =  new ForbiddenError();
        if (response.headers.get('content-type') === MediaType.json) {
            const body = await response.json();
            const converted = CaseConverter.convert(body, Naming.CAMEL_CASE);
            error.additionalData = converted?.additionalData;
        }

        return error;
    }

    private async onNotFound(): Promise<NotFoundError> {
        throw new NotFoundError();
    }

    private onUnexpectedError(): Promise<UnexpectedError> {
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
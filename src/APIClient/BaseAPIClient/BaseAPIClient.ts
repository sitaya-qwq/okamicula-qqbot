import { HTTPError } from "./Error/HTTPError";

export class BaseAPIClient {
    protected readonly baseUrl_: string;
    protected readonly name_: string;

    constructor(base_url: string, name: string) {
        this.baseUrl_ = base_url;
        this.name_ = name;
        
    }

    protected async GetJson<T = any>(path: string, headers: Record<string,string>): Promise<T>{
        try {
            const url: string = this.baseUrl_ + path;
            const response: Response = await fetch(url,{
                method: "GET",
                headers: {
                    "Accept":"application/json",
                    ...headers
                }
            });
            if (!response.ok) {
                throw new HTTPError(response.status,await response.clone().text(),url,response);
            }
            return await response.json() as T;
        } catch (error) {
            throw error;
        }
    }

    protected async PostJson<ResponseType = any,RequestType = any>(path: string,body: RequestType, headers?: Record<string,string>): Promise<ResponseType>{
        try {
            const url: string = this.baseUrl_ + path;
            const response: Response = await fetch(url,{
                method: "POST",
                headers: {
                    "Accept":"application/json",
                    "Content-Type": "application/json",
                    ...headers
                },
                body: JSON.stringify(body)
            });
            if (!response.ok) {
                throw new HTTPError(response.status,await response.clone().text(),url,response);
            }
            return await response.json() as ResponseType;
        } catch (error) {
            throw error;
        }        
    }

    

}
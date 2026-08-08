export class HTTPError extends Error{
    private readonly statusCode_: number;
    private readonly statusText_: string;
    private readonly url_: string;
    private readonly response_?: Response;

    public constructor(status_code: number, status_text: string, url: string, response: Response) {
        super(`HTTP ${status_code}: ${status_text} (${url})`);
        Object.setPrototypeOf(this, HTTPError.prototype);
        this.statusCode_ = status_code;
        this.statusText_ = status_text;
        this.url_ = url;
        this.response_ = response;
    }

    
    public GetStatusCode() : number {return this.statusCode_;}
    public GetStatusText() : string {return this.statusText_;}
    public GetUrl() : string {return this.url_;}
    public GetResponse() : Response | undefined {return this.response_;}
}
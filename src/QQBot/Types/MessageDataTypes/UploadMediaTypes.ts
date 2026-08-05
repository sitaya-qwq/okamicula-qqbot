export interface UploadMediaResponse{
    file_info: string;
    ttl: number;
}

export interface UploadMediaRequest{
    file_type?: number;
    url?: string;
    srv_send_msg?: boolean;
    file_name?: string;
    upload_id?: string;
}
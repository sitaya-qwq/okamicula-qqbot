export interface User{
    id: string;
    username: string;
    bot: boolean;
    union_openid: string;
    union_user_account: string;
    user_openid: string;
    member_openid: string;
    member_role: string;
}

export interface MessageScene{
    source: string;
    ext: string[]
}

export interface ARKData{
    prompt: string;
    ark_type: string;
    ark_name: string;
    fields: object
}

export interface MessageAttachment{
    url: string;
    filename: string;
    width: number;
    height: number;
    size: number;
    content_type: string;
    voice_wav_url?: string;
    asr_refer_text?: string;
}

export interface MsgElement{
    msg_idx: string;
    author: User;
    message_type: number;
    content: string;
    attachments: MessageAttachment[];
    ark_data: ARKData;
    msg_elements: MsgElement[]
}

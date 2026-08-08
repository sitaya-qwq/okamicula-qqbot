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
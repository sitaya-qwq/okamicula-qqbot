export interface MessageMarkdown{
    template_id?: number;
    content?: string;
    custom_template_id?: string;
}

export interface MessageReference{
    message_id?: string;
}

export interface MediaInfo{
    file_info?: string;
}

export interface InputNotify{
    input_type?: number;
    input_second?: number;
}

export interface RenderData{
    label?: string;
    visited_label?: string;
    style?: number;
}

export interface Permission{
    type?: number;
    specify_user_ids?: string[];
    specify_role_ids?: string[];
}

export interface Action{
    type?: number;
    permission?: Permission;
    data?: string;
    click_limit?: number;
    unsupport_tips?: string;
    enter?: boolean;
    reply?: boolean;
    anchor?: number;
}

export interface Button{
    id?: string;
    render_data?: RenderData;
    action?: Action;
}

export interface Row{
    buttons?: Button[];
}

export interface KeyboardContent{
    rows?: Row[];
}

export interface Keyboard{
    id?: string;
    content?: KeyboardContent;
}

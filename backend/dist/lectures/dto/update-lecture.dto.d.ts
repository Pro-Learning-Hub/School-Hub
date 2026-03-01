export declare class UpdateLectureDto {
    title?: string;
    description?: string;
    tags?: string;
    videoLink?: string;
    notes?: string;
    audioLink?: string;
    slides?: string;
    subtitles?: string;
    transcript?: string;
    resources?: Array<{
        id?: string;
        title: string;
        url: string;
        type: string;
    }>;
}

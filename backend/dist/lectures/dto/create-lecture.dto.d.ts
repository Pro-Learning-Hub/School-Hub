export declare class CreateLectureDto {
    title: string;
    description: string;
    tags?: string;
    videoLink: string;
    notes: string;
    audioLink?: string;
    slides?: string;
    subtitles?: string;
    transcript?: string;
    sectionId: string;
    resources?: Array<{
        title: string;
        url: string;
        type: string;
    }>;
}

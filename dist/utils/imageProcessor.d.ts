export interface ImageProcessingParams {
    filename: string;
    width: number;
    height: number;
    format?: string | undefined;
}
export declare class ImageProcessor {
    private static fullImagesPath;
    private static thumbImagesPath;
    static processImage(params: ImageProcessingParams): Promise<string>;
    static imageExists(filename: string): Promise<boolean>;
}
//# sourceMappingURL=imageProcessor.d.ts.map
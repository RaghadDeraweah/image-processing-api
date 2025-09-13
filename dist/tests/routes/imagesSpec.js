var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import request from 'supertest';
import app from '../../app.js';
describe('Images API', () => {
    describe('GET /api/images', () => {
        it('should return 400 for missing filename', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app).get('/api/images?width=200&height=200');
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Filename parameter is required');
        }));
        it('should return 400 for missing dimensions', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app).get('/api/images?filename=test');
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('Width and height parameters are required');
        }));
        it('should return 400 for invalid dimensions', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app).get('/api/images?filename=test&width=abc&height=200');
            expect(response.status).toBe(400);
            expect(response.body.error).toContain('valid numbers');
        }));
        it('should return 404 for non-existent image', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app).get('/api/images?filename=nonexistent&width=200&height=200');
            expect(response.status).toBe(404);
        }));
        it('should return 200 and processed image for valid request', () => __awaiter(void 0, void 0, void 0, function* () {
            const response = yield request(app).get('/api/images?filename=test&width=200&height=200');
            expect(response.status).toBe(200);
            expect(response.header['content-type']).toBe('image/jpeg');
        }));
    });
});
//# sourceMappingURL=imagesSpec.js.map
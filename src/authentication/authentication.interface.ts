export interface JWTValidatePayload {
    id: string;
    email: string;
    iat: number;
    exp: number;
}
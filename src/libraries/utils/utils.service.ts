import { Injectable } from "@nestjs/common";

@Injectable()
export class UtilsService {
    public generateRandomString() {
        return (Date.now()).toString(36) + Math.random().toString(36).substring(2);
    }
}
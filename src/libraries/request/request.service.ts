import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Observable, firstValueFrom } from 'rxjs';

@Injectable()
export class RequestService {
  constructor(private readonly httpService: HttpService) { }

  public async post<T extends object>(url: string, data: T) {
    return this.handleObservable(this.httpService.post(url, data), 'post');
  }

  public async get<T extends object>(url: string, params?: T) {
    return this.handleObservable(this.httpService.get(url, { params }), 'get');
  }

  public async patch<T extends object>(url: string, data: T) {
    return this.handleObservable(this.httpService.patch(url, data), 'patch');
  }

  public async put<T extends object>(url: string, data: T) {
    return this.handleObservable(this.httpService.put(url, data), 'put');
  }

  public async delete(url: string) {
    return this.handleObservable(this.httpService.delete(url), 'delete');
  }

  private async handleObservable(observable: Observable<any>, method: string): Promise<any> {
    return firstValueFrom(observable)
      .then(({ data }) => { return data; })
      .catch(({ message, response: { data } }) => {
        console.error({ method: `RequestService.${method}`, message: message, details: data });
        return null;
      });
  }
}
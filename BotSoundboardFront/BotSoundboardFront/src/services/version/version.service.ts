import { Injectable } from '@angular/core';
import { AxiosService } from '../axios/axios.service';

export interface VersionInfo {
  frontend: string;
  backend: string;
}

@Injectable({
  providedIn: 'root'
})
export class VersionService {
  private frontendVersion = require('../../../package.json').version;

  constructor(private axios: AxiosService) { }

  async getVersions(): Promise<VersionInfo> {
    try {
      const backendData: any = await this.axios.get({ url: '/version' });
      return {
        frontend: this.frontendVersion,
        backend: backendData.backend
      };
    } catch (error) {
      console.error('Failed to fetch backend version:', error);
      return {
        frontend: this.frontendVersion,
        backend: 'unknown'
      };
    }
  }

  getFrontendVersion(): string {
    return this.frontendVersion;
  }
}

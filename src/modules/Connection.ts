import axios, { AxiosInstance } from 'axios';

class API {
  public _host: string;
  public _port: number;
  public _baseURL: string;
  public _req: AxiosInstance;

  constructor(host: string, port = 80) {
    this._host = host;
    this._port = port;
    this._baseURL = `${this._host}${(this._port === 80 ? '' : `:${this._port}`)}`;
    this._req = axios.create({
      baseURL: this._baseURL,
    });
    /** before request action */
    this._req.interceptors.request.use((config) => {
      config.headers = {
        'x-access-token': localStorage.getItem('main_accessToken'),
        'x-refresh-token': localStorage.getItem('main_refreshToken')
      }
      return config;
    });
    /** after request action */
    this._req.interceptors.response.use((response) => {
      if (response.headers['x-access-token'] && response.headers['x-refresh-token']) {
        localStorage.setItem('main_accessToken', response.headers['x-access-token']);
        localStorage.setItem('main_refreshToken', response.headers['x-refresh-token']);
      }
      return response;
    }, (error) => {
      if (error.response) {
        if (error.response.headers['x-access-token'] && error.response.headers['x-refresh-token']) {
          localStorage.setItem('main_accessToken', error.response.headers['x-access-token']);
          localStorage.setItem('main_refreshToken', error.response.headers['x-refresh-token']);
        }
        return Promise.reject(error.response);
      } else return Promise.reject(error);
    });
  }

  connect() {
    return this._req.get(`${this._baseURL}/app_meta`);
  }

  async collection(entity: string) {
    const res = await this._req.get(`${this._baseURL}/apis/${entity}`);
    return res.data.data;
  }

  async one(entity: string, id: string) {
    const res = await this._req.get(`${this._baseURL}/apis/${entity}/${id}`);
    return res.data.data;
  }

  async create(entity: string, data: string) {
    const res = await this._req.post(`${this._baseURL}/apis/${entity}`, data);
    return res.data.data;
  }

  async update(entity: string, id: string, data: string) {
    const res = await this._req.put(`${this._baseURL}/apis/${entity}/${id}`, data);
    return res.data.data;
  }

  async delete(entity: string, id: string) {
    const res = await this._req.delete(`${this._baseURL}/apis/${entity}/${id}`);
    return res.data.data;
  }

  async login(username: string, password: string) {
    const res = await this._req.post(`${this._baseURL}/apis/auth/`, { username, password });
    const { tokens, user, map_key } = res.data.data;
    localStorage.setItem('main_accessToken', tokens.token);
    localStorage.setItem('main_refreshToken', tokens.refreshToken);
    localStorage.setItem('mapKey', map_key);
    return user;
  }

  async session() {
    const res = await this._req.get(`${this._baseURL}/apis/auth`);
    return res.data.data;
  }

  async logout() {
    const res = await this._req.delete(`${this._baseURL}/apis/auth`);
    localStorage.removeItem('main_accessToken');
    localStorage.removeItem('main_refreshToken');
    return res.data.data;
  }

  async rawGet(endpoint: string, parent: string = 'apis') {
    const res = await this._req.get(`${this._baseURL}/${parent}/${endpoint}`);
    return res.data.data;
  }

  async rawPost(endpoint: string, data: string, parent: string = 'apis') {
    const res = await this._req.post(`${this._baseURL}/${parent}/${endpoint}`, data);
    return res.data.data;
  }

  async rawPut(endpoint: string, data: string, parent: string = 'apis') {
    const res = await this._req.put(`${this._baseURL}/${parent}/${endpoint}`, data);
    return res.data.data;
  }

  async rawDelete(endpoint: string, parent: string = 'apis') {
    const res = await this._req.delete(`${this._baseURL}/${parent}/${endpoint}`);
    return res.data.data;
  }

}

export default API;
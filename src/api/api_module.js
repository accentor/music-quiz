import baseURL from "./base_url";

export class ApiModule {
  constructor(apiPath) {
    this.baseURL = baseURL;
    this.apiPath = apiPath;
  }

  async resolveRequest(request) {
    let response, result;
    try {
      response = await fetch(request);
      result = response.status === 204 ? true : await response.json();
    } catch (reason) {
      throw { error: [reason] };
    }
    if (response.ok) {
      return result;
    } else {
      throw result;
    }
  }

  async *indexGenerator(auth) {
    let page = 1;
    const url = `${this.baseURL}/${this.apiPath}?`;
    while (true) {
      let response;
      try {
        response = await fetch(`${url}page=${page}`, {
          method: "GET",
          headers: {
            "x-secret": auth.secret,
            "x-device-id": auth.device_id,
          },
        });
      } catch (error) {
        const reason = {};
        reason[error.constructor.name] = [error.message];
        throw reason;
      }
      const result = await response.json();
      const loaded = new Date();
      for (let obj in result) {
        result[obj].loaded = loaded;
      }
      if (response.ok && result) {
        if (response.headers.get("x-total-pages") === String(page)) {
          return result;
        } else {
          yield result;
        }
      } else {
        throw result;
      }

      page++;
    }
  }

  async create(auth, object) {
    const request = new Request(`${this.baseURL}/${this.apiPath}`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-secret": auth?.secret,
        "x-device-id": auth?.deviceId,
      },
      body: JSON.stringify(object),
    });
    return await this.resolveRequest(request);
  }

  async read(auth, id) {
    const request = new Request(`${this.baseURL}/${this.apiPath}/${id}`, {
      method: "GET",
      headers: {
        "x-secret": auth.secret,
        "x-device-id": auth.deviceId,
      },
    });
    return await this.resolveRequest(request);
  }

  async update(auth, id, object) {
    const request = new Request(`${this.baseURL}/${this.apiPath}/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        "x-secret": auth.secret,
        "x-device-id": auth.deviceId,
      },
      body: JSON.stringify(object),
    });
    return await this.resolveRequest(request);
  }

  async destroy(auth, id) {
    const request = new Request(`${this.baseURL}/${this.apiPath}/${id}`, {
      method: "DELETE",
      headers: {
        "x-secret": auth.secret,
        "x-device-id": auth.deviceId,
      },
    });
    return await this.resolveRequest(request);
  }
}

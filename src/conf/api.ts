export const BASE_URL = "http://192.168.110.28:9000"
// export const BASE_URL = "https://api.uetab.com"


export async function requst<T>(
    method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE",
    url: string,
    requestConfig?: {
        data?: any;
        dataType?: "json" | "form";
        returnType?: "json" | "text" | "blob";
    }): Promise<T> {
    const { data, dataType = "json", returnType = "text" } = requestConfig || {};

    let config: any = {
        method,
        headers:{

        }
    }
    if (!["GET", "DELETE"].includes(method)) {
        if (dataType === "json") {
            config.body = JSON.stringify(data);
            config.headers["Content-Type"] = "application/json";
        } else {
            config.body = new FormData();
            for (let key in data) {
                config.body.append(key, data[key]);
            }
        }
    }
    return fetch(BASE_URL + url, config).then((res) => {
        if (res.status >= 200 && res.status < 400) {
            return res[returnType]();
        } else {
            return res.text().then((err) => {
                if (res.status === 401) {
                    localStorage.setItem("token", "");
                    // 刷新页面
                }
                return Promise.reject(err);
            });
        }
    }) as Promise<T>;
}
import queryString from "query-string";

export const sendRequest = async <T>(props: IRequest) => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method: method,
    headers: new Headers({ ...headers }), // ❌ Xóa content-type mặc định, chỉ thêm nếu cần
    body: body ? JSON.stringify(body) : null,
    ...nextOption,
  };

  if (body) {
    options.headers.append("Content-Type", "application/json"); // ✅ Chỉ thêm nếu có body
  }

  if (useCredentials) {
    options.credentials = "include"; // ✅ Đảm bảo có credentials
  }

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  // console.log("🚀 Fetching:", url, "Options:", options); // 🔥 Debug để kiểm tra options

  return fetch(url, options).then(async (res) => {
    if (res.ok) {
      return res.json() as T;
    } else {
      const json = await res.json();
      return {
        statusCode: res.status,
        message: json?.message ?? "",
        error: json?.error ?? "",
      } as T;
    }
  });
};

export const sendRequestFile = async <T>(props: IRequest) => {
  let {
    url,
    method,
    body,
    queryParams = {},
    useCredentials = false,
    headers = {},
    nextOption = {},
  } = props;

  const options: any = {
    method: method,
    // by default setting the content-type to be json type
    headers: new Headers({ ...headers }),
    body: body ? body : null,
    ...nextOption,
  };
  if (useCredentials) options.credentials = "include";

  if (queryParams) {
    url = `${url}?${queryString.stringify(queryParams)}`;
  }

  return fetch(url, options).then((res) => {
    if (res.ok) {
      return res.json() as T;
    } else {
      return res.json().then(function (json) {
        // to be able to access error status when you catch the error
        return {
          statusCode: res.status,
          message: json?.message ?? "",
          error: json?.error ?? "",
        } as T;
      });
    }
  });
};


const apiHelper = (() => {
  // Fungsi untuk mengambil data dari API dengan penanganan token akses
  async function fetchData(url, options) {
    const urlQuery = url.includes("?") ? url.split("?")[1] : "";
    const urlWithoutQuery = url.replace(`?${urlQuery}`, "");
    const fixUrl = urlWithoutQuery.endsWith("/")
      ? urlWithoutQuery.slice(0, -1)
      : urlWithoutQuery;
    const fullUrl = fixUrl + (urlQuery ? `?${urlQuery}` : "");

    return fetch(fullUrl, {
      ...options,
      mode: "cors",
      headers: {
        ...options.headers,
        Authorization: `Bearer ${getAccessToken()}`,
      },
    });
  }

  // Fungsi untuk menyimpan token akses ke localStorage
  function putAccessToken(token) {
    localStorage.setItem("accessToken", token);
  }

  // Fungsi untuk mengambil token akses dari localStorage
  function getAccessToken() {
    return localStorage.getItem("accessToken");
  }

  // Mengekspos fungsi-fungsi yang ada di dalam modul
  return {
    fetchData,
    putAccessToken,
    getAccessToken,
  };
})();

export default apiHelper;
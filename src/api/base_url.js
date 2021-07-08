let url;
if (import.meta.env.VITE_API_BASE_URL) {
  url = import.meta.env.VITE_API_BASE_URL;
} else {
  url = "http://localhost:3000/api";
}

export default url;

const prod = {
    API_URL: ''
};
const dev = {
    API_URL: 'http://localhost:3000/dev'
};
export const API_CONFIG = process.env.NODE_ENV === 'development' ? dev : prod;
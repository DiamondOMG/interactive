import axios from 'axios';

const targetrApi = axios.create({
  baseURL: process.env.TARGETR_BASE_URL || 'https://stacks.targetr.net',
  auth: {
    username: process.env.TARGETR_USERNAME || '',
    password: process.env.TARGETR_PASSWORD || '',
  },
});

export default targetrApi;

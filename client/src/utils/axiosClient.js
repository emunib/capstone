import axios from 'axios';

const axiosClient = axios.create();
axiosClient.defaults.baseURL = process.env.REACT_APP_API_URI || '';
axiosClient.defaults.withCredentials = true;

export function getRequest(URL) {
    return axiosClient.get(`${URL}`);
}

export function postRequest(URL, payload, config) {
    return axiosClient.post(`${URL}`, payload, config);
}

export function patchRequest(URL, payload) {
    return axiosClient.patch(`${URL}`, payload);
}

export function deleteRequest(URL) {
    return axiosClient.delete(`${URL}`);
}
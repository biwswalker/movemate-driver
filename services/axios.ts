import axios, { AxiosInstance } from 'axios'
import AxiosCaseConverter from 'axios-case-converter'

const axiosInstance: AxiosInstance = AxiosCaseConverter(axios.create())

// axiosInstance.defaults.headers.common['Accept'] = 'application/json'
axiosInstance.defaults.headers['Content-Type'] = 'application/json'

export default axiosInstance

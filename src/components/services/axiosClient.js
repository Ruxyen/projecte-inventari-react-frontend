import axios from 'axios';


const axiosClient = axios.create({
    baseURL: `http://localhost:8080/api`,
    headers: {
      'Accept': 'application/json',
     // 'Content-Type': 'application/json',     
    }
});







axiosClient.interceptors.request.use(
   
  (config) => {    
      
      
      const user =  JSON.parse(localStorage.getItem('user'));
    
       if (user && user.token) {
          config.headers["Authorization"] = 'Bearer ' + user.token;  
       }
         return config;
      },
      (error) => {        
          return Promise.reject(error); 
          
      }
);

axiosClient.interceptors.response.use(
  response => response,
  error => {
      if (error.response.status === 401) {                      
            localStorage.clear();          
            window.location.href = '/';          
            return Promise.reject('Unauthorized');
      }
      else {
          return Promise.reject(error);
      }
  });





export default axiosClient


import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const useAxiosInterceptors = () => {
  const navigate = useNavigate();

  // Defineix la URL base fixa
  const baseURL = 'http://localhost:8080/api/';

  axios.interceptors.request.use(
    config => {
      config.baseURL = baseURL;
      // Obtenir l'usuari de l'emmagatzematge
      const user =  JSON.parse(localStorage.getItem('user'));
      // Si hi ha un token, afegeix-lo com a capçalera d'autorització
      if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
      }       

      return config;
    },
    error => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    response => {
      return response;
    },
    error => {
      if (error.response && error.response.status === 401) {
        // Redirigeix a la pàgina de login quan el token no és vàlid
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
};

export default useAxiosInterceptors;
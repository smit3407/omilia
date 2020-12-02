import {
  SET_USER,
  SET_ERRORS,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_UNAUTHENTICATED,
  LOADING_USER
} from '../types';
import axios from 'axios';

export const phoneLogin = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/phoneLogin', userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('user', res.data.username);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push('/home/username=' + res.data.username);
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      })
    });
};

export const loginUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/login', userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      localStorage.setItem('email', res.data.email);
      localStorage.setItem('username', res.data.username);
      localStorage.setItem('user', res.data.username);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      history.push(`/home/${res.data.username}`);
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};

export const logoutUser = () => (dispatch) => {
  localStorage.removeItem('FBIdToken');
  delete axios.defaults.headers.common['Authorization'];
  localStorage.clear();
  dispatch({ type: SET_UNAUTHENTICATED });
};

/*export const logoutUser = (userData, history) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post('/logout', userData)
    .then((res) => {
      setAuthorizationHeader(res.data.token);
      dispatch(getUserData());
      dispatch({ type: CLEAR_ERRORS });
      localStorage.removeItem("FBIdToken", `Bearer ${res.data.token}`);
      history.push('/');
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data
      });
    });
};*/

export const getUserData = () => (dispatch) => {
  dispatch({ type: LOADING_USER });
  axios
    .get('/user')
    .then((res) => {
      dispatch({
        type: SET_USER,
        payload: res.data
      });
    })
    .catch((err) => console.log(err));
};

const setAuthorizationHeader = (token) => {
  const FBIdToken = `Bearer ${token}`;
  localStorage.setItem('FBIdToken', FBIdToken);
  axios.defaults.headers.common['Authorization'] = FBIdToken;
};
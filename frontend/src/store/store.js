import { makeAutoObservable } from "mobx";
import AuthService from "../services/AuthService";
import { API_URL } from "../http";
import axios from "axios";


export default class Store {
  user = {};
  isAuth = false;
  isLoading = false;
  selectedContact = {}

  constructor() {
    makeAutoObservable(this);
  }

  setAuth(bool) {
    this.isAuth = bool;
  }

  setUser(user) {
    this.user = user;
  }

  setIsLoading(isLoading) {
    this.isLoading = isLoading;
  }

  setSelectedContact(selectedContact) {
    this.selectedContact = selectedContact;
  }

  async login(email, password, setErrorsCallback=null) {
    try {
      this.setIsLoading(true);
      const response = await AuthService.login(email, password);
      this.setIsLoading(false);
      localStorage.setItem('token', response.data.access);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      if (setErrorsCallback && e.response?.data){
        setErrorsCallback(e.response?.data);
      }
      this.setIsLoading(false);
    }
  }

  async register(email, password, setErrorsCallback=null) {
    try {
      const response = await AuthService.register(
        email, password);
      localStorage.setItem('token', response.data.access);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      if (setErrorsCallback && e.response?.data){
        setErrorsCallback(e.response?.data);
      }
    }
  }

  async editCurrentUser(name, status, setErrorsCallback=null) {
    try {
      const response = await AuthService.editCurrentUser(
        name, status);
      this.setUser(response.data);
    } catch (e) {
      if (setErrorsCallback && e.response?.data){
        setErrorsCallback(e.response?.data);
      }
    }
  }

  logout() {
    localStorage.removeItem('token');
    this.setAuth(false);
    this.setUser({});
  }

  async checkAuth() {
    try {
      const response = await axios.get(
        `${API_URL}/token/refresh/`, 
        { withCredentials: true }
      );
      localStorage.setItem('token', response.data.access);
      this.setAuth(true);
      this.setUser(response.data.user);
    } catch (e) {
      console.log(e.response?.data?.message);
    }
  }
}
import $api from "../http";


export default class AuthService {
    static async getContacts() {
        return $api.get('/user/')
    }

    static async getContact(id) {
        return $api.get(`/user/${id}/`)
    }
}
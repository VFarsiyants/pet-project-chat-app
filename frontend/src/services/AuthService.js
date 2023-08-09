import $api from "../http"

export default class AuthService {
    static async login(email, password) {
        return $api.post('/token/', {email, password})
    }

    static async register(email, password) {
        return $api.post('/register/', {email, password})
    }
}

import $api from "../http"

export default class AuthService {
    static async login(email, password) {
        return $api.post('/token/', {email, password})
    }

    static async register(email, password, confirm_password) {
        return $api.post('/register/', {email, password, confirm_password})
    }

    static async editCurrentUser(name, status) {
        return $api.put('/current_user/', {name, status})
    }
}

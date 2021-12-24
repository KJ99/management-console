import User from "../profile/User";
import AccessTokenResult from "./AccessTokenResult";

export default class AuthResult {
    user?: User;
    token?: AccessTokenResult;
}
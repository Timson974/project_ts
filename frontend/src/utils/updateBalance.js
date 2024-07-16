import {CustomHttp} from "../services/custom-http";
import config from "../../config/config";

export class UpdateBalance {
    static async getBalance() {
        try {
            const result = await CustomHttp.request(config.host + '/balance');
            if (result) {
                if (result.error) {
                    throw new Error(result.error);
                }
                return result.balance
            }
        } catch (e) {
            return console.log(e)
        }
    }
}
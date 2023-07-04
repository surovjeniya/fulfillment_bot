import axios from 'axios';

export class SellersHubApi {
  private readonly _sellersHubApi = axios.create({
    baseURL: 'https://sellershub.ru/api/v1',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getUserByPhoneNumber(phone_number: string) {
    try {
      const { data } = await this._sellersHubApi.get(
        `/user-phones/${phone_number}`,
      );
      return data;
    } catch (error) {
      console.log(
        `Error from ${this.getUserByPhoneNumber.name}`,
        error.message,
      );
    }
  }

  async registrationByPhoneHumber(registerData: {
    phone_number: string;
    password: string;
    email?: string;
    username?: string;
    registered_from_bot?: boolean;
    telegram_id?: number;
  }) {
    try {
      const candidate = await this.getUserByPhoneNumber(
        registerData.phone_number,
      );
      if (candidate) {
        return 'used';
      } else {
        const { data } = await this._sellersHubApi.post<{
          jwt: string;
        }>(`/telegram-users/registration`, {
          data: {
            ...registerData,
          },
        });
        return data;
      }
    } catch (error) {
      console.log(
        `Error from ${this.registrationByPhoneHumber.name}`,
        error.message,
      );
    }
  }
}

export const sellersHubApi = new SellersHubApi();

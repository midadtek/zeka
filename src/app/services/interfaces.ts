export interface Country  {
    id: string;
    country_name: string;
    country_code: string;
    fitir_value: number;
    created_at: Date;
    updated_at: Date;
  }
export interface Operation {
    id: number;
    category_id: number;
    category_name: string;
    country_id: number;
    currency_type: string;
    d_val_1: number;
    d_val_2: number;
    d_val_3: number;
    name: string;
    user_id: number;
    created_at: Date;
}
export interface Charity {
    id: number;
    charity_name: string;
    charity_description: string;
    payment_link: string;
    charity_website: string;
    charity_phone: string;
    charity_address: string;
    charity_country: string;
    facebook_link: string;
    youtube_link: string;
    twitter_link: string;
    instagram_link: string;
    is_default: boolean;
    charity_logo: string;
  }
export interface CharityBankInfo {
    id: number;
    charity_id: number;
    bank_name: string;
    branch_name: string;
    account_name: string;
    account_number: number;
    swift_code: string;
    USD_IBAN: string;
    EUR_IBAN: string;
    LOCAL_IBAN: string;
  }

export interface SSLCommerzePaymentNotification {
    amount: string;
    bank_tran_id: string;
    base_fair: string;
    card_brand: string;
    card_issuer: string;
    card_issuer_country: string;
    card_issuer_country_code: string;
    card_no: string;
    card_sub_brand: string;
    card_type: string;
    currency: string;
    currency_amount: string;
    currency_rate: string;
    currency_type: string;
    error: string;
    risk_level: string;
    risk_title: string;
    status: 'VALID' | 'FAILED' | 'CANCELLED' | 'UNATTEMPTED' | 'EXPIRED' | string; // Made status more descriptive based on typical gateway responses
    store_amount: string;
    store_id: string;
    tran_date: string; // Format: YYYY-MM-DD HH:mm:ss
    tran_id: string;
    val_id: string;
    value_a: string;
    value_b: string;
    value_c: string;
    value_d: string;
    verify_sign: string;
    verify_sign_sha2: string;
    verify_key: string;
}




export interface SSLCommerzValidationResponse {
    status: 'VALID' | 'VALIDATED' | 'INVALID_TRANSACTION' | string;
    tran_date: string; // Format: YYYY-MM-DD HH:mm:ss
    tran_id: string;
    val_id: string;
    amount: string;
    store_amount: string;
    currency: string;
    bank_tran_id: string;
    card_type: string;
    card_no: string;
    card_issuer: string;
    card_brand: string;
    card_category: string;
    card_sub_brand: string;
    card_issuer_country: string;
    card_issuer_country_code: string;
    currency_type: string;
    currency_amount: string;
    currency_rate: string;
    base_fair: string;
    value_a: string;
    value_b: string;
    value_c: string;
    value_d: string;
    emi_instalment: string;
    emi_amount: string;
    emi_description: string;
    emi_issuer: string;
    account_details: string;
    risk_title: string;
    risk_level: string;
    discount_percentage: string;
    discount_amount: string;
    discount_remarks: string;
    APIConnect: 'DONE' | string;
    validated_on: string; // Format: YYYY-MM-DD HH:mm:ss
    gw_version: string;
    offer_avail: number; // Note: Gateway returns this as a number
    card_ref_id: string;
    isTokeizeSuccess: number; // Note: Gateway returns this as a number
    campaign_code: string;
}
export interface CreatePaymentIntentPayload {
  savePaymentMethod?: boolean;

  // billing (optional)
  billingName?: string;
  billingLine1?: string;
  billingCity?: string;
  billingPostal?: string;
  billingCountry?: string;
}

export interface PaymentMethod {
  id: string;
  brand: string;
  last4: string;
  expMonth: number;
  expYear: number;
  isDefault?: boolean;
  billingName?: string;
  billingCountry?: string;
}

export interface UpdatePaymentMethodPayload {
  makeDefault?: boolean;
  delete?: boolean;

  billingName?: string;
  billingLine1?: string;
  billingCity?: string;
  billingPostal?: string;
  billingCountry?: string;
}

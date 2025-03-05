export const cbe_url = '/api/checkout/session';
export const mpesa_url = '/api/checkout/mpesa/transfer/direct';
export const telebirr_url = '/api/checkout/telebirr-ussd/transfer/direct';
export const awash_url = '/api/checkout/session';
export const amole_url = '/api/checkout/session';
export const hellocash_url = '/api/checkout/session';

export const  newPassanger={
  registrationDate: new Date(),
  updatedAt: new Date(),
  scheduleId: "",
  accountId: "1963145d-c0b4-4cb0-62fc-08dc46bf0a7f",
  //"3fa85f64-5717-4562-b3fc-2c963f66afa6",
  paymentMethodCode: "",
  paymentProviderCode: "",
  debitAccount: "",
  passengers: [],
  bookedById:"a4853181-acaa-4238-2dca-08dc46be1bd8",
  // "DE937EB1-F20A-44E5-451C-08D8A705F255",
  statusCode: 'Reserved',
  paymentTypeCode: 'Electronic',
  PaymentOption: '',
  totalPrice:0
}


export const PAYMENT_OPTIONS = [
    { name: 'CBE', img: '../../../assets/img/paymentoption/cbe.png' },
    { name: 'TELEBIRR', img: '../../../assets/img/paymentoption/telebirr.png' },
    { name: 'MPESSA', img: '../../../assets/img/paymentoption/mpesa.png' },
    { name: 'AWASH', img: '../../../assets/img/paymentoption/awash.png' },
    { name: 'AMOLE', img: '../../../assets/img/paymentoption/amole.png' },
    { name: 'HELLOCASH', img: '../../../assets/img/paymentoption/hello-cash.png' },
  ];
  

  export const ArifPaycreateSessionData = {
    cancelUrl: "https://ezibus.leapfrogtechafrica.com/book-bus-tickets-in-ethiopia",
    phone: "",
    email: "telebirrTest@gmail.com",
    nonce:'' ,
    errorUrl: "https://leapfrogtechafrica.com/about-us.html",
    notifyUrl: "https://leapfrogtechafrica.com/",
    successUrl: "https://www.ezipublic.ezi-tech.com/book-bus-tickets-in-ethiopia",
    paymentMethods: [],
    expireDate: "",
    items: [
      {
        name: "EZI BUS",
        quantity: 1,
        price: 2,
        description: "EZI BUS SYSTEM",
        image: "https://ezibus.leapfrogtechafrica.com/assets/img/ezi-icon.png"
      }
    ],
    beneficiaries: [
      {
        accountNumber: "01320811436100",
        bank: "AWINETAA",
        amount: 0.0
      }
    ],
    lang: "EN"
  };


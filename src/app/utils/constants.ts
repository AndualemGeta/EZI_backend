export const getSeatConfig = (price: number) => [
  {
    seat_price: price,
    seat_map: [
      { seat_label: "1", layout: "gg_gg" },
      { seat_label: "2", layout: "gg_gg" },
      { seat_label: "3", layout: "gg_gg" },
      { seat_label: "4", layout: "gg_gg" },
      { seat_label: "5", layout: "gg_gg" },
      { seat_label: "6", layout: "gg_gg" },
      { seat_label: "7", layout: "gg_" },
      { seat_label: "8", layout: "gg_gg" },
      { seat_label: "9", layout: "gg_gg" },
      { seat_label: "10", layout: "gg_gg" },
      { seat_label: "11", layout: "gg_gg" },
      { seat_label: "12", layout: "gg_gg" },
      { seat_label: "13", layout: "ggggg" }
    ]
  }
];

export const ArifPaymentUrls: Record<string, string> = {
  CBE: '/api/checkout/session',
  MPESSA: '/api/checkout/mpesa/transfer/direct',
  TELEBIRR_USSD: '/api/checkout/telebirr-ussd/transfer/direct',
  AWASH: '/api/checkout/session',
  AMOLE: '/api/checkout/session',
  HELLOCASH: '/api/checkout/session',
};

export const ReservationBody={
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
    { name: 'TELEBIRR_USSD', img: '../../../assets/img/paymentoption/telebirr.png' },
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



  export const setPaymentDetails = (paymentMethod: string) => {
    const paymentDetails = {
      paymentMethodCode: '',
      paymentProviderCode: '',
      accountId: '',
      debitAccount: ''
    };
  
    switch (paymentMethod) {
      case 'BankTransfer':
        paymentDetails.paymentMethodCode = 'BankTransfer';
        break;
      case 'TeleBirr':
        paymentDetails.paymentMethodCode = 'Electronic';
        paymentDetails.paymentProviderCode = 'TeleBirr';
        break;
  
      case 'AwashOtp':
        paymentDetails.paymentMethodCode = 'Electronic';
        paymentDetails.paymentProviderCode = 'AwashOtp';
        break;
      default:
        paymentDetails.paymentMethodCode = 'BankTransfer';
    }
  
    return paymentDetails;
  };
  

  export const arifPayCheckoutBbody = (paymentMethod: string,data: any,phoneNumber) => {
    const CheckoutBbody = 
      {
        "sessionId": data.sessionId,
        "phoneNumber": phoneNumber,
        "password":""
    }
    switch (paymentMethod) {
      case 'CBE':
          CheckoutBbody.password = 'cbe123';
          break;
      case 'AWASH':
          CheckoutBbody.password = '1234';
          break;
  
      case 'AMOLE':
          CheckoutBbody.password = 'amole123';
          break;
      case 'HELLOCASH':
          CheckoutBbody.password = '1234';
            break;
      default:
        CheckoutBbody.password = '1234';
    }
    return CheckoutBbody;
  };
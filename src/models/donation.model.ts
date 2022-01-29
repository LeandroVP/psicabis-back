export interface Donation extends NewDonation {
  date: Date
}

export interface NewDonation {
  id: string;
  amount: number;
  documentNuber: string;
  email: string;
  lastName: string;
  firstName: string;
}

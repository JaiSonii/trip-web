// interfaces/Driver.ts

import { Document } from 'mongoose';


// Define the interface for the driver account schema
export interface IDriverAccount {
  account_id: string
  date: Date;
  reason: string;
  gave: number;
  got: number;
}

// Define the interface for the driver schema
export interface IDriver extends Document {
  driver_id: string;
  name: string;
  contactNumber: string;
  status: 'Available' | 'On Trip';
  balance?: number;
  accounts: IDriverAccount[];
}
// interfaces/Trip.ts

export interface PaymentBook extends Document{
  paymentBook_id: string
  accountType: string
  amount: number;
  paymentType: 'Cash' | 'Cheque' | 'Online Transfer';
  receivedByDriver: boolean;
  paymentDate: Date;
  notes?: string;
}

interface Route {
  origin: string;
  destination: string;
}

export interface TripExpense extends Document{
  trip_id: string;
  partyBill: boolean;
  amount: number;
  date: Date;
  expenseType: string;
  notes?: string;
}

export interface ITrip extends Document {
  expenses: TripExpense[];
  tripId: string;
  party: string;
  truck: string;
  driver: string;
  route: Route;
  billingType: 'Fixed' | 'Per Tonne' | 'Per Kg' | 'Per Trip' | 'Per Day' | 'Per Hour' | 'Per Litre' | 'Per Bag';
  amount: number;
  balance : number;
  startDate: Date;
  truckHireCost?: number;
  LR: string;
  status?: 0 | 1 | 2 | 3 | 4;
  POD?: string;
  dates: Date[];
  material?: string;
  notes?: string;
  accounts : PaymentBook[]
}


// interfaces/Party.ts


export interface IParty extends Document {
  party_id: string;
  name: string;
  contactPerson: string;
  contactNumber: string;
  address: string;
  gstNumber: string;
  balance: number;
  createdAt: Date;
  updatedAt: Date;
}


// interfaces/Truck.ts

export interface TruckModel extends Document {
  truckNo: string;
  truckType: string;
  model: any;
  capacity: string;
  bodyLength: string | null;
  ownership: string;
  supplier: string;
  status: 'Available' | 'On Trip'
  trip_id : string
  documents : []
  createdAt: Date;
  updatedAt: Date;
}

export interface ISupplier extends Document{
  supplier_id: string;
  name: string;
  contactNumber: string,
  tripCount : number
  balance : number
}

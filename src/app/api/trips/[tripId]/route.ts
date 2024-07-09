import { ITrip, PaymentBook } from "@/utils/interface";
import { connectToDatabase, partySchema } from "@/utils/schema";
import { tripSchema } from "@/utils/schema";
import {models, model} from 'mongoose'
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";


const Trip = models.Trip || model('Trip', tripSchema)

export async function GET(req: Request, { params }: { params: { tripId: string } }) {
    const { tripId } = params;
  
    try {
      await connectToDatabase();
  
      const trip = await Trip.findOne({ tripId }).exec();
  
      if (!trip) {
        return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
      }
  
      return NextResponse.json({ trip }, { status: 200 });
    } catch (err: any) {
      console.error(err);
      return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
  }

  export async function PATCH(req: Request, { params }: { params: { tripId: string } }) {
    try {
      const { tripId } = params;
      const { data } = await req.json();
      const { amount, POD, status, dates, account, notes } = data;
      console.log(data);
  
      await connectToDatabase();
  
      const trip = await Trip.findOne({ tripId: tripId });
      
      if (!trip) {
        return NextResponse.json({ message: 'No Trip Found' }, { status: 404 });
      }

      if(notes){
        trip.notes = notes
      }
  
      if (account) {
        if (account.paymentBook_id){
          trip.accounts = trip.accounts.filter((acc: PaymentBook) => acc.paymentBook_id = account.paymentBook_id)
          trip.accounts.push(account)
        }
        else{
          account.paymentBook_id = 'payment' + uuidv4()
          trip.accounts.push(account);
        }
        const Party = models.Party || model('Party', partySchema)
        
        if(trip.balance - account.amount >= 0){
          trip.balance = parseFloat(trip.balance) - parseFloat(account.amount)
          const party = await Party.findOne({party_id : trip.party})
          party.balance = parseFloat(party.balance) - parseFloat(account.amount)
          await party.save()
        } 
        else NextResponse.json({error : 'Failed to update'})
        
      }
  
      if (status && dates) {
        trip.status = status;
        trip.dates = dates;
      }
  
  
      trip.POD = POD || "";
  
      await trip.save();
      return NextResponse.json({ trip: trip }, { status: 200 });
    } catch (err: any) {
      console.log(err);
      return NextResponse.json({ message: err.message }, { status: 500 });
    }
  }
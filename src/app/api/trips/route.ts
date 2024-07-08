import { NextResponse } from 'next/server';
import mongoose, { model, models } from 'mongoose';
import { tripSchema } from '@/utils/schema';
import { connectToDatabase } from '@/utils/schema';
import { ITrip } from '@/utils/interface';
import {v4 as uuidv4} from 'uuid'
import { partySchema } from '@/utils/schema';

const Trip = models.Trip || model('Trip', tripSchema);
const Party = models.Party || model('Party', partySchema)


export async function GET() {
  try {
    await connectToDatabase();

    const trips = await Trip.find().sort({ 'dates.0': -1 }).exec();
    return NextResponse.json({ trips });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}



export async function POST(this: any, req: Request) {
  try {
    await connectToDatabase(); // Establish database connection

    const data = await req.json(); // Parse JSON data from request body

    // Basic validation (you can implement your own validation logic here if needed)
    const datearr = [new Date(data.startDate), null, null, null, null]

    // Create a new Trip instance based on ITrip interface
    const newTrip: ITrip = new Trip({
      tripId: 'trip' + uuidv4(),
      party: data.party,
      truck: data.truck,
      driver: data.driver,
      route: {
        origin: data.route.origin,
        destination: data.route.destination
      },
      billingType: data.billingType,
      amount: data.amount,
      balance: data.amount,
      dates: datearr, // Assuming startDate is passed as string and needs conversion
      truckHireCost: data.truckHireCost || 0,
      LR: data.LR,
      status : 0,
      material: data.material || '',
      notes: data.notes || '',
      accounts : []
    });

    // Save the new trip document
    const savedTrip = await newTrip.save();

    const party = await Party.findOne({party_id : data.party})
    party.balance = parseFloat(party.balance) + newTrip.amount
    await party.save()

    // Return success response
    return NextResponse.json({ message: 'Saved Successfully', data: savedTrip }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving trip:', error);

    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', details: error.message }, { status: 400 });
    } else if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json({ message: 'Duplicate Key Error', details: error.message }, { status: 409 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  }
}

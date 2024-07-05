import { NextResponse } from 'next/server';
import mongoose, { model, models } from 'mongoose';
import { connectToDatabase, driverSchema } from '@/utils/schema';
import { IDriver } from '@/utils/interface';


const Driver = models.Driver || model('Driver', driverSchema);



export async function GET() {
  try {
    await connectToDatabase()

    const drivers = await Driver.find().exec();
    return NextResponse.json({ drivers });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await connectToDatabase()

    const data = await req.json();



    // Phone number validation (10 digits starting with 7, 8, or 9)
    const phoneRegex = /^[6789]\d{9}$/;
    if (!phoneRegex.test(data.contactNumber)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }


    const newDriver: IDriver = new Driver({
      driver_id : data.driver_id,
      name: data.name,
      contactNumber : data.contactNumber,
      balance : data.balance,
      status : data.status
    });

    const savedDriver = await newDriver.save();
    return NextResponse.json({ message: 'Saved Successfully', data: savedDriver }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving Driver:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', details: error.message }, { status: 400 });
    } else if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json({ message: 'Duplicate Key Error', details: error.message }, { status: 409 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  }
}

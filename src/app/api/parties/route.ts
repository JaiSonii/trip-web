import { NextResponse, NextRequest } from 'next/server';
import  { model, models } from 'mongoose';
import { connectToDatabase, partySchema } from '@/utils/schema';
import { IParty } from '@/utils/interface';

import { auth } from '@/firebase/firebaseAdmin';
import { fetchCookie, verifyToken } from '@/utils/auth';

const Party = models.Party || model('Party', partySchema);

export async function GET(req : Request) {
  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
  

  try {
    await connectToDatabase()

    const parties = await Party.find({user_id : user}).exec();
    return NextResponse.json({ parties });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}


export async function POST(req: Request) {

  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
  

  try {
    await connectToDatabase()

    const data = await req.json();

    // Basic validation
    

    // GST number validation
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (data.gstNumber && !gstRegex.test(data.gstNumber)) {
      return NextResponse.json({ message: 'Invalid GST number' }, { status: 400 });
    }

    // Phone number validation (10 digits starting with 7, 8, or 9)
    const phoneRegex = /^[789]\d{9}$/;
    if (!phoneRegex.test(data.contactNumber)) {
      return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
    }


    const newParty: IParty = new Party({
      user_id : user,
      party_id: data.party_id,
      name: data.name,
      contactPerson: data.contactPerson,
      contactNumber: data.contactNumber,
      address: data.address,
      gstNumber: data.gstNumber,
      balance: data.balance,
      createdAt: data.createdAt || new Date(),
      updatedAt: data.updatedAt || new Date(),
    });

    const savedParty = await newParty.save();
    return NextResponse.json({ message: 'Saved Successfully', data: savedParty }, { status: 200 });

  } catch (error: any) {
    console.error('Error saving party:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json({ message: 'Validation Error', details: error.message }, { status: 400 });
    } else if (error.name === 'MongoError' && error.code === 11000) {
      return NextResponse.json({ message: 'Duplicate Key Error', details: error.message }, { status: 409 });
    } else {
      return NextResponse.json({ message: 'Internal Server Error', details: error.message }, { status: 500 });
    }
  }
}

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { connectToDatabase, tripSchema } from '@/utils/schema';
import { partySchema } from '@/utils/schema'; // Assuming you have a Party model
import { verifyToken } from '@/utils/auth';

const Trip = mongoose.models.Trip || mongoose.model('Trip', tripSchema);
const Party = mongoose.models.Party || mongoose.model('Party', partySchema)

export async function GET(request: Request, { params }: { params: { partyId: string } }) {
  const { user, error } = await verifyToken(request);
  if (error) {
    return NextResponse.json({ error });
  }
  try {
   await connectToDatabase()

    const { partyId } = params;
    const trips = await Trip.find({user_id: user, party_id: partyId }).exec();
    console.log(trips)

    return NextResponse.json({ trips });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

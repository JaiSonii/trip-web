import { ITrip } from "@/utils/interface";
import { connectToDatabase, tripSchema } from "@/utils/schema";
import { model, models } from "mongoose";
import { NextResponse } from "next/server";

const Trip = models.Trip || model('Trip', tripSchema);

export async function DELETE(req: Request, { params }: { params: { tripId: string, accountId: string } }) {
  const { tripId, accountId } = params;
  const {amount} = await req.json()
  await connectToDatabase();

  try {
    // Fetch the trip
    const trip: ITrip | null = await Trip.findOne({ tripId });

    // Check if trip exists
    if (!trip) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 });
    }

    // Filter out the account to be deleted
    trip.accounts = trip.accounts.filter(acc => acc._id.toString() !== accountId);
    trip.balance = parseFloat(trip.balance as any) + parseFloat(amount)

    // Save the updated trip
    await trip.save();

    // Return success response
    return NextResponse.json({ trip : trip }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ message: 'Failed to delete account', error: error.message }, { status: 500 });
  }
}

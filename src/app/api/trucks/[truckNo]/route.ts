import { NextResponse } from 'next/server';// Ensure to import Request from 'express' or another appropriate package
import { connectToDatabase, truckSchema } from '@/utils/schema';
import { TruckModel } from '@/utils/interface';
import mongoose, { Model } from 'mongoose';
import { verifyToken } from '@/utils/auth';

const Truck = mongoose.models.Truck || mongoose.model<TruckModel>('Truck', truckSchema);

export async function PATCH(req: Request, { params }: { params: { truckNo: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
  try {
    const { truckNo } = params;
    const { status } = await req.json(); // Assuming 'status' is in the body of the PATCH request

    await connectToDatabase(); // Ensure this function is properly defined and imported

    const truck = await Truck.findOne({user_id : user, truckNo: truckNo });

    if (!truck) {
      return NextResponse.json({ message: 'No Truck Found' }, { status: 404 });
    }

    if (status) truck.status = status;

    await truck.save();

    return NextResponse.json({ truck: truck }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

import { connectToDatabase, driverSchema } from "@/utils/schema";
import  {model, models } from "mongoose";

const Driver = models.Driver || model('Driver', driverSchema)

import { NextResponse } from 'next/server';
import { IDriver } from '@/utils/interface';
import { verifyToken } from "@/utils/auth";





export async function DELETE(req: Request,{ params }: { params: { driverId: string; accountId: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
    // const { driverId, accountId } = params;
    const url = req.url
    const url_arr = url?.split('/')
    const accountId = url_arr[7]
    const driverId = url_arr[5]

  
    try {
      await connectToDatabase();
  
      // Find the driver document by driverId
      const driver = await Driver.findOne({ user_id: user, driver_id: driverId });
  
      if (!driver) {
        return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
      }
  
      // Filter out the account with the specified accountId from the accounts array
      driver.accounts = driver.accounts.filter((account : any)  => account.account_id.toString() !== accountId);
  
      // Save the updated driver document
      await driver.save();
  
      return NextResponse.json({ driver }, { status: 200 });
    } catch (error) {
      console.error('Failed to delete account detail:', error);
      return NextResponse.json({ error: 'Failed to delete account detail' }, { status: 500 });
    }
  }
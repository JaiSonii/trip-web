import { connectToDatabase, driverSchema } from "@/utils/schema";
import  {model, models } from "mongoose";
import {v4 as uuidv4} from 'uuid'

const Driver = models.Driver || model('Driver', driverSchema)

import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import { IDriver } from '@/utils/interface';


export async function GET(req: Request, { params }: { params: { driverId: string } }) {
  const { driverId } = params;

  try {
    await connectToDatabase();

    const driver = await Driver.findOne({driver_id : driverId}).exec();

    if (!driver) {
      return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
    }

    return NextResponse.json(driver, { status: 200 });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
  }
}

export async function PUT(req: Request, {params}: {params : {driverId: string}}){
  const {driverId} = params
  const data = await req.json()
  try{
    await connectToDatabase();
    const driver: IDriver = await Driver.findOne({driver_id : driverId}).exec();
    driver.balance = driver.balance + data.got - data.gave
    driver.accounts.push({
      account_id : 'account' + uuidv4(),
      date : data.date,
      reason : data.reason,
      gave : data.gave,
      got : data.got
    })

    driver.save()
    return NextResponse.json({driver : driver}, {status : 200})
  }catch(err){
    console.log(err)
  }
}

export async function DELETE(req: Request, { params }: { params: { driverId: string } }) {
  const { driverId } = params;
  try {
    await connectToDatabase();
    const foundDriver = await Driver.findOne({ driver_id: driverId });
    if (foundDriver.status == 'On Trip') {
      return NextResponse.json({ message: 'Driver On Trip Cannot Delete' }, { status: 400 });
    }
    const driver = await Driver.findOneAndDelete({ driver_id: driverId });

    if (!driver) {
      return NextResponse.json({ message: 'Driver not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Driver Deleted' }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { driverId: string } }) {
  try {
    const { driverId } = params;
    const { name, contactNumber, status } = await req.json();
    console.log(`${status}`)

    await connectToDatabase(); // Ensure this function is properly defined and imported

    const driver = await Driver.findOne({ driver_id: driverId });

    if (!driver) {
      return NextResponse.json({ message: 'No Driver Found' }, { status: 404 });
    }

    if (name) driver.name = name;
    if (contactNumber) driver.contactNumber = contactNumber;
    if (status) driver.status = status;

    await driver.save();

    return NextResponse.json({ driver: driver }, { status: 200 });
  } catch (err: any) {
    console.log(err)
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}


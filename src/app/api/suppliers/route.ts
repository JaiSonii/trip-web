import { NextResponse, NextRequest } from 'next/server';
import mongoose, { model, models } from 'mongoose';
import { connectToDatabase, supplierSchema } from '@/utils/schema';
import { ISupplier } from '@/utils/interface';
import { v4 as uuidv4 }from 'uuid';

const Supplier = models.Supplier || model('Supplier', supplierSchema);

export async function GET() {
  try {
    await connectToDatabase()

    const suppliers = await Supplier.find().exec();
    return NextResponse.json({ suppliers }, {status : 200});
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function POST(req: Request) {
    try {
      await connectToDatabase
  
      const data = await req.json();
  
      // Basic validation
      if (!data.name || !data.contactNumber) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
      }
  
      
      const phoneRegex = /^[789]\d{9}$/;
      if (!phoneRegex.test(data.contactNumber)) {
        return NextResponse.json({ message: 'Invalid phone number' }, { status: 400 });
      }
  
  
      const newSupplier: ISupplier = new Supplier({
        supplier_id : 'suppllier' + uuidv4(),
        name: data.name,
        contactNumber: data.contactNumber,
        tripCount: 0,
        balance: 0,
      });
  
      const savedSupplier = await newSupplier.save();
      return NextResponse.json({ message: 'Saved Successfully', data: newSupplier }, { status: 200 });
  
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
  
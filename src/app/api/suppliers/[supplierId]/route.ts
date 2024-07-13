// Import necessary modules and schemas
import { connectToDatabase } from "@/utils/schema";
import { models, model } from 'mongoose';
import { supplierSchema } from "@/utils/schema";
import { NextResponse } from "next/server";
import { verifyToken } from "@/utils/auth";

// Retrieve or define Mongoose model for Supplier
const Supplier = models.Supplier || model('Supplier', supplierSchema);

// GET request handler function
export async function GET(req: Request, params: { params: { supplierId: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
  const { supplierId } = params.params;

  try {
    // Connect to the MongoDB database
    await connectToDatabase();

    // Find the supplier based on supplierId
    const supplier = await Supplier.findOne({ user_id: user, supplier_id: supplierId });

    // Handle case where supplier is not found
    if (!supplier) {
      return NextResponse.json({ message: "No supplier found" }, { status: 404 });
    }

    // Return the supplier details
    return NextResponse.json({ supplier: supplier }, { status: 200 });

  } catch (error) {
    console.error('Error fetching supplier:', error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, params: { params: { supplierId: String } }) {
  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
  const { supplierId } = params.params;
  const data = await req.json()
  const newBalance = data.truckHireCost

  try {
    await connectToDatabase()
    const supplier = await Supplier.findOne({ user_id: user, supplier_id: supplierId })
    supplier.balance = parseFloat(supplier.balance) + parseFloat(newBalance)
    await supplier.save()
    return NextResponse.json({ message: 'Balance updated successfully', balance: supplier.balance }, { status: 200 })
  } catch (error) {
    console.log(error)
    return NextResponse.json({ message: "error" }, { status: 500 })
  }
}



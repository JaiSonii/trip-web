import { verifyToken } from "@/utils/auth";
import { connectToDatabase, tripExpenseSchema } from "@/utils/schema";
import { model, models } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

// Initialize the TripExpense model
const TripExpense = models.TripExpense || model('TripExpense', tripExpenseSchema);

export async function GET(req: Request, { params }: { params: { tripId: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
    // Connect to the database
    await connectToDatabase();

    // Extract the tripId from the request params
    const { tripId } = params;

    try {
        // Fetch the trip expenses from the database
        const charges = await TripExpense.find({user_id : user,  trip_id: tripId });

        // Return a success response with the charges
        return NextResponse.json({ status: 200, charges});
    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error fetching trip expenses:", error);
        return NextResponse.json({ status: 500, error: "Failed to fetch trip expenses" });
    }
}


// Define the POST handler
export async function POST(req: Request, { params }: { params: { tripId: string } }) {
    // Connect to the database
    await connectToDatabase();
    
    // Extract the tripId from the request params
    const { tripId } = params;

    try {
        // Parse the request body as JSON
        const data = await req.json();

        // Create a new instance of TripExpense with the parsed data and tripId
        const newCharge = new TripExpense({
            ...data,
            trip_id: tripId
        });

        // Save the new charge to the database
        await newCharge.save();

        // Return a success response with the new charge
        return NextResponse.json({ status: 200, newCharge });

    } catch (error) {
        // Handle any errors that occur during the process
        console.error("Error creating new trip expense:", error);
        return NextResponse.json({ status: 500, error: "Failed to create new trip expense" });
    }
}

export async function PATCH(req: Request, { params }: { params: { tripId: string } }) {
    await connectToDatabase();
    const edited = await req.json();
  
    try {
      const expense = await TripExpense.findByIdAndUpdate(edited._id, edited, { new: true });
      if (!expense) {
        return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
      }
      return NextResponse.json({ status: 200, charge: expense });
    } catch (error) {
      return NextResponse.json({ message: 'An error occurred while updating the expense' }, { status: 500 });
    }
  }
  
  export async function DELETE(req: Request, { params }: { params: { tripId: string } }) {
    await connectToDatabase();
    const {id} = await req.json()
  
    try {
      const expense = await TripExpense.findByIdAndDelete(id);
      if (!expense) {
        return NextResponse.json({ message: 'Expense not found' }, { status: 404 });
      }
      return NextResponse.json({ status: 200, charge: expense });
    } catch (error) {
      return NextResponse.json({ message: 'An error occurred while deleting the expense' }, { status: 500 });
    }
  }

import { verifyToken } from "@/utils/auth";
import { connectToDatabase } from "@/utils/schema";
import { partySchema } from "@/utils/schema";
import {models, model} from 'mongoose'
import { NextResponse } from "next/server";


const Party = models.Party || model('Party', partySchema)

export async function GET(req: Request, { params }: { params: { partyId: string } }) {
  const { user, error } = await verifyToken(req);
  if (error) {
    return NextResponse.json({ error });
  }
    const { partyId } = params;
  
    try {
      await connectToDatabase();
  
      const party = await Party.findOne({ party_id : partyId, user_id : user }).exec();
  
      if (!party) {
        return NextResponse.json({ message: 'Party not found' }, { status: 404 });
      }
  
      return NextResponse.json({ party: party }, { status: 200 });
    } catch (err: any) {
      console.error(err);
      return NextResponse.json({ message: 'Internal Server Error', error: err.message }, { status: 500 });
    }
  }
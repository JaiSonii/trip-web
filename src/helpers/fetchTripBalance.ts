import { ITrip, TripExpense } from "@/utils/interface";

export const fetchBalance = async(trip : ITrip)=>{
    const charges: TripExpense[] = await fetchCharges(trip.trip_id)
    const accountBalance = trip.accounts.reduce((total, account) => total + account.amount, 0);
      let chargeToBill = 0
      let chargeNotToBill = 0
      if (charges){
        chargeToBill = charges.filter(charge => charge.partyBill).reduce((total, charge) => total + charge.amount, 0);
        chargeNotToBill = charges.filter(charge =>!charge.partyBill).reduce((total, charge) => total + charge.amount, 0);
      }
      const pending = trip.amount - accountBalance - chargeNotToBill + chargeToBill
      return pending
}

export const fetchCharges  = async (tripId: String) =>{
    const response = await fetch(`/api/trips/${tripId}/expenses`);
    const data = await response.json();
    return data.charges
  }

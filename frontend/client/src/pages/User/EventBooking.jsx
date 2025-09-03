import React, { useState } from "react";
import SeatSelection from "../../components/SeatSelection";
import Payment from "./Payment";

function EventBooking({ eventId }) {
  const [selectedSeat, setSelectedSeat] = useState(null);

  return (
    <div>
      {!selectedSeat ? (
        <>
          <h2 className="text-center text-2xl font-bold text-purple-600 mb-4">Select Your Seat</h2>
          <SeatSelection eventId={eventId} onSeatSelected={setSelectedSeat} />
        </>
      ) : (
        <Payment eventId={eventId} seatNumber={selectedSeat} />
      )}
    </div>
  );
}

export default EventBooking;

import React from "react";
import { useParams } from "react-router-dom";
import EventBooking from "./EventBooking";

function EventBookingWrapper() {
  const { id } = useParams();
  return <EventBooking eventId={id} />;
}

export default EventBookingWrapper;

import MyBookings from '../components/MyBookings';

import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../utils/queries';

const BookingList = (props) => {
  const { loading, data, error } = useQuery(QUERY_ME);
  const bookings = data?.me?.bookings || {};

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;

    return (
      <div>
        {bookings.map(booking => (
          <MyBookings 
            key={booking.id}
            BookedDate={booking.bookedDate} 
            id={booking.id} 
            price={booking.price} 
            BookedBy={{ 
              id: booking.bookedBy.id, 
              firstName: booking.bookedBy.firstName, 
              lastName: booking.bookedBy.lastName, 
              email: booking.bookedBy.email 
            }} 
          />
        ))}
      </div>
    )
  }

  export default BookingList;
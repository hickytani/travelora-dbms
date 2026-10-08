import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../services/api';
import { Booking } from '../types';
import { Empty, ErrorMessage, Loading, Notice, Page, statusClass } from './shared';

export default function MyBookings() {
  const [items, setItems] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    setLoading(true);
    try {
      const response = await bookingApi.getAll();
      setItems(response.data.data || []);
      setError('');
    } catch (requestError) {
      setError(ErrorMessage(requestError));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadBookings();
  }, []);

  const cancel = async (id: number) => {
    try {
      await bookingApi.cancel(id);
      await loadBookings();
    } catch (requestError) {
      setError(ErrorMessage(requestError));
    }
  };

  return (
    <Page title="My bookings">
      {error && <Notice>{error}</Notice>}
      {loading ? <Loading /> : items.length === 0 ? <Empty>You have no bookings yet.</Empty> : (
        <div className="space-y-4">
          {items.map((booking) => (
            <div className="flex flex-wrap justify-between gap-4 rounded-lg border bg-white p-5" key={booking.booking_id}>
              <div>
                <h2 className="font-bold">{booking.package_title}</h2>
                <p className="text-gray-600">{booking.destination_city} · {booking.hotel_name} · {booking.airline}</p>
                <p className="mt-2 text-sm">Booked {booking.booking_date}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className={statusClass(booking.status)}>{booking.status}</span>
                <Link className="btn-secondary" to={`/my-bookings/${booking.booking_id}`}>Details</Link>
                {booking.status !== 'CANCELLED' && <button className="btn-danger" onClick={() => cancel(booking.booking_id)}>Cancel</button>}
              </div>
            </div>
          ))}
        </div>
      )}
    </Page>
  );
}

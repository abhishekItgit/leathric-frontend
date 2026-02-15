import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { useCart } from '../hooks/useCart';
import { getApiErrorMessage } from '../utils/apiError';

const initialForm = {
  fullName: '',
  address: '',
  city: '',
  postalCode: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
};

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal, placeOrder, placingOrder } = useCart();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState('');

  const onChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const onPlaceOrder = async () => {
    if (!cartItems.length) {
      setError('Your cart is empty. Add products before placing an order.');
      return;
    }

    setError('');

    try {
      await placeOrder({
        shippingAddress: {
          fullName: form.fullName,
          address: form.address,
          city: form.city,
          postalCode: form.postalCode,
        },
        payment: {
          cardNumber: form.cardNumber,
          expiry: form.expiry,
          cvv: form.cvv,
        },
      });

      navigate('/dashboard');
    } catch (err) {
      setError(getApiErrorMessage(err, 'Order placement failed. Please retry.'));
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="panel p-4 text-sm text-stone-300">Items: {cartItems.length} · Total: ${cartTotal.toFixed(2)}</div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="panel space-y-4 p-6">
          <h2 className="text-xl font-semibold">Shipping details</h2>
          <Input label="Full Name" value={form.fullName} onChange={onChange('fullName')} />
          <Input label="Address" value={form.address} onChange={onChange('address')} />
          <Input label="City" value={form.city} onChange={onChange('city')} />
          <Input label="Postal Code" value={form.postalCode} onChange={onChange('postalCode')} />
        </div>
        <div className="panel space-y-4 p-6">
          <h2 className="text-xl font-semibold">Payment</h2>
          <Input label="Card Number" placeholder="**** **** **** 1299" value={form.cardNumber} onChange={onChange('cardNumber')} />
          <div className="grid grid-cols-2 gap-3">
            <Input label="MM/YY" value={form.expiry} onChange={onChange('expiry')} />
            <Input label="CVV" value={form.cvv} onChange={onChange('cvv')} />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <Button className="w-full" onClick={onPlaceOrder} disabled={placingOrder}>
            {placingOrder ? 'Placing order...' : 'Place Order'}
          </Button>
        </div>
      </div>
    </section>
  );
}

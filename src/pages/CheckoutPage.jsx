import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function CheckoutPage() {
  return (
    <section className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-3xl font-bold">Checkout</h1>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="panel space-y-4 p-6">
          <h2 className="text-xl font-semibold">Shipping details</h2>
          <Input label="Full Name" />
          <Input label="Address" />
          <Input label="City" />
          <Input label="Postal Code" />
        </div>
        <div className="panel space-y-4 p-6">
          <h2 className="text-xl font-semibold">Payment (UI Demo)</h2>
          <Input label="Card Number" placeholder="**** **** **** 1299" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="MM/YY" />
            <Input label="CVV" />
          </div>
          <Button className="w-full">Place Order</Button>
        </div>
      </div>
    </section>
  );
}

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { Stepper } from '../components/ui/Stepper';
import { Modal } from '../components/ui/Modal';
import UpiInput from '../components/ui/UpiInput';
import { useCart } from '../features/cart/hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ui/Toast';
import { addressApi, orderApi } from '../services/apiServices';
import { LoadingSkeleton } from '../components/LoadingSkeleton';

const steps = [
  { label: 'Shipping', description: 'Address' },
  { label: 'Payment', description: 'Details' },
  { label: 'Review', description: 'Order' },
  { label: 'Confirmation', description: 'Success' },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartTotal } = useCart();
  const { user } = useAuth();
  const { addToast } = useToast();

  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  // form data for address modal is handled inside AddressModal component

  const [paymentData, setPaymentData] = useState({
    cardName: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [upiId, setUpiId] = useState('');

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v || 0);
  console.debug('[CheckoutPage] render', { paymentMethod, upiId });

  // Stable callback so UpiInput doesn't remount when parent re-renders
  const handleUpiChange = useCallback((val) => {
    setUpiId(val);
  }, []);

  // Load addresses
  useEffect(() => {
    const loadAddresses = async () => {
      try {
        setLoadingAddresses(true);
        const data = await addressApi.getAddresses();
        setAddresses(data.data || []);
        if (data.data?.length > 0) {
          setSelectedAddress(data.data[0].id);
        }
      } catch (err) {
        addToast('Failed to load addresses', 'error');
      } finally {
        setLoadingAddresses(false);
      }
    };

    loadAddresses();
  }, []);

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Address modal component isolated to avoid parent re-renders interfering with input focus
  function AddressModal({ isOpen, onClose, onAdded }) {
    const [localLoading, setLocalLoading] = useState(false);
    const [name, setName] = useState(user?.fullName || '');
    const [phone, setPhone] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [stateVal, setStateVal] = useState('');
    const [zipCode, setZipCode] = useState('');
    const [country, setCountry] = useState('');

    useEffect(() => {
      if (isOpen) {
        setName(user?.fullName || '');
      }
    }, [isOpen, user]);

    const submit = async (e) => {
      e.preventDefault();
      setLocalLoading(true);
      try {
        const res = await addressApi.createAddress({
          name,
          phone,
          addressLine1,
          addressLine2,
          city,
          state: stateVal,
          zipCode,
          country,
        });
        onAdded(res.data);
        addToast('Address added successfully', 'success');
        onClose();
      } catch (err) {
        addToast('Failed to add address', 'error');
      } finally {
        setLocalLoading(false);
      }
    };

    if (!isOpen) return null;

    return (
      <Modal isOpen={isOpen} title="Add New Address" onClose={onClose} size="lg">
        <form onSubmit={submit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" required autoFocus value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Phone</label>
              <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" required inputMode="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address Line 1</label>
            <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" required value={addressLine1} onChange={(e) => setAddressLine1(e.target.value)} />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address Line 2</label>
            <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" value={addressLine2} onChange={(e) => setAddressLine2(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" required value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" required value={stateVal} onChange={(e) => setStateVal(e.target.value)} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ZIP Code</label>
              <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white" required value={country} onChange={(e) => setCountry(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={onClose} className="flex-1">Cancel</Button>
            <Button type="submit" disabled={localLoading} className="flex-1">{localLoading ? 'Adding...' : 'Add Address'}</Button>
          </div>
        </form>
      </Modal>
    );
  }

  const handlePlaceOrder = async () => {
    if (!selectedAddress) {
      addToast('Please select or add a shipping address', 'warning');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        items: cartItems.map((item) => ({
          productId: item.id || item.productId,
          quantity: item.quantity,
          price: item.price,
          cartItemId: item.cartItemId || item.id,
        })),
        addressId: selectedAddress,
        paymentMethod,
        totalAmount: cartTotal,
      };

      if (paymentMethod === 'card') payload.cardDetails = paymentData;
      if (paymentMethod === 'upi') payload.upiId = upiId;

      const order = await orderApi.createOrder(payload);

      addToast('Order placed successfully!', 'success');
      setCurrentStep(3);

      // Redirect after 2 seconds
      setTimeout(() => {
        navigate(`/dashboard`);
      }, 2000);
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  const canProceedToStep = (stepIndex) => {
    if (stepIndex === 0) return true;
    if (stepIndex === 1) return currentStep >= 0 && selectedAddress;
    if (stepIndex === 2) return currentStep >= 1;
    return false;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Stepper */}
      <Stepper
        steps={steps}
        currentStep={currentStep}
        onStepClick={(step) => canProceedToStep(step) && setCurrentStep(step)}
      />

      {/* Step 0: Shipping Address */}
      {currentStep === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Shipping Address</h2>

          {loadingAddresses ? (
            <LoadingSkeleton className="h-40" />
          ) : (
            <>
              {/* Saved Addresses */}
              {addresses.length > 0 && (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-stone-400">Your Addresses</p>
                  <div className="space-y-3">
                    {addresses.map((addr) => (
                      <motion.button
                        key={addr.id}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedAddress(addr.id)}
                        className={`w-full text-left p-4 rounded-lg border-2 transition ${
                          selectedAddress === addr.id
                            ? 'border-leather-accent bg-leather-accent/10'
                            : 'border-white/20 hover:border-white/40'
                        }`}
                      >
                        <p className="font-semibold">{addr.name}</p>
                        <p className="text-sm text-stone-300 mt-1">
                          {addr.addressLine1}, {addr.city}, {addr.state} {addr.zipCode}
                        </p>
                        <p className="text-xs text-stone-400 mt-1">📱 {addr.phone}</p>
                      </motion.button>
                    ))}
                  </div>
                </div>
              )}

              {/* Add New Address Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAddressModal(true)}
                className="w-full p-4 rounded-lg border-2 border-dashed border-white/20 hover:border-leather-accent text-leather-accent transition"
              >
                + Add New Address
              </motion.button>
            </>
          )}

          {/* Proceed Button */}
          <Button
            onClick={() => setCurrentStep(1)}
            disabled={!selectedAddress}
            className="w-full"
          >
            Continue to Payment
          </Button>
        </motion.div>
      )}

      {/* Step 1: Payment */}
      {currentStep === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Payment Details</h2>

          <form onSubmit={(e) => { e.preventDefault(); setCurrentStep(2); }} className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Payment Method</p>
              <div className="flex gap-3">
                <label className={`px-3 py-2 rounded-lg border ${paymentMethod === 'card' ? 'border-leather-accent bg-leather-accent/10' : 'border-white/20'}`}>
                  <input type="radio" name="paymentMethod" value="card" checked={paymentMethod === 'card'} onChange={() => setPaymentMethod('card')} className="mr-2" /> Card
                </label>
                <label className={`px-3 py-2 rounded-lg border ${paymentMethod === 'upi' ? 'border-leather-accent bg-leather-accent/10' : 'border-white/20'}`}>
                  <input type="radio" name="paymentMethod" value="upi" checked={paymentMethod === 'upi'} onChange={() => setPaymentMethod('upi')} className="mr-2" /> UPI
                </label>
                <label className={`px-3 py-2 rounded-lg border ${paymentMethod === 'cod' ? 'border-leather-accent bg-leather-accent/10' : 'border-white/20'}`}>
                  <input type="radio" name="paymentMethod" value="cod" checked={paymentMethod === 'cod'} onChange={() => setPaymentMethod('cod')} className="mr-2" /> Cash on Delivery
                </label>
              </div>
            </div>

            {paymentMethod === 'card' && (
              <>
                <div>
                  <label className="block text-sm font-medium mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={paymentData.cardName}
                    onChange={(e) => setPaymentData({ ...paymentData, cardName: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500"
                    required={paymentMethod === 'card'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      value={paymentData.cardNumber}
                      onChange={(e) => { console.debug('Card onChange', e.target.value); const val = e.target.value.replace(/\s/g, '').slice(0, 16); setPaymentData((s) => ({ ...s, cardNumber: val.replace(/(\d{4})/g, '$1 ').trim() })); }}
                      onFocus={() => console.debug('Card onFocus')}
                      onBlur={() => console.debug('Card onBlur')}
                    placeholder="4242 4242 4242 4242"
                    maxLength="19"
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500 font-mono"
                    required={paymentMethod === 'card'}
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">MM</label>
                    <input
                      type="text"
                      value={paymentData.expiryMonth}
                      onChange={(e) => setPaymentData({ ...paymentData, expiryMonth: e.target.value.slice(0, 2) })}
                      placeholder="12"
                      maxLength="2"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500"
                      required={paymentMethod === 'card'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">YY</label>
                    <input
                      type="text"
                      value={paymentData.expiryYear}
                      onChange={(e) => setPaymentData({ ...paymentData, expiryYear: e.target.value.slice(0, 2) })}
                      placeholder="26"
                      maxLength="2"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500"
                      required={paymentMethod === 'card'}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">CVV</label>
                    <input
                      type="text"
                      value={paymentData.cvv}
                      onChange={(e) => setPaymentData({ ...paymentData, cvv: e.target.value.slice(0, 3) })}
                      placeholder="123"
                      maxLength="3"
                      className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500"
                      required={paymentMethod === 'card'}
                    />
                  </div>
                </div>
              </>
            )}

            {paymentMethod === 'upi' && (
              <div>
                <label className="block text-sm font-medium mb-2">UPI ID</label>
                <UpiInput value={upiId} onChange={handleUpiChange} placeholder="yourname@bank" />
                <p className="text-sm text-stone-400 mt-2">You will be prompted to complete payment using your UPI app after placing the order.</p>
              </div>
            )}

            {paymentMethod === 'cod' && (
              <div className="p-4 rounded-lg bg-white/5 text-stone-300">
                <p>Cash on Delivery selected. Please have the exact amount ready when the delivery arrives.</p>
              </div>
            )}

            <div className="flex gap-3 pt-4">
              <Button variant="secondary" onClick={() => setCurrentStep(0)} className="flex-1">
                Back
              </Button>
              <Button type="submit" className="flex-1">
                Review Order
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 2: Review Order */}
      {currentStep === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <h2 className="text-2xl font-bold">Review Your Order</h2>

          {/* Order Items */}
            <div className="panel p-6 space-y-4">
            <h3 className="font-semibold">Items</h3>
            {cartItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between border-b border-white/10 pb-4 last:border-0">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-stone-400">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">{fmt((item.price || 0) * item.quantity)}</p>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="panel p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-stone-300">Subtotal</span>
              <span>{fmt(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-300">Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-stone-300">Tax</span>
              <span>{fmt((cartTotal * 0.1))}</span>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-leather-accent">{fmt((cartTotal * 1.1))}</span>
            </div>
          </div>

          {/* Shipping Address */}
          {selectedAddress && (
            <div className="panel p-6">
              <h3 className="font-semibold mb-3">Shipping To</h3>
              {addresses.find((a) => a.id === selectedAddress) && (
                <p className="text-stone-300">
                  {addresses.find((a) => a.id === selectedAddress)?.name}<br />
                  {addresses.find((a) => a.id === selectedAddress)?.addressLine1}<br />
                  {addresses.find((a) => a.id === selectedAddress)?.city}, {addresses.find((a) => a.id === selectedAddress)?.state} {addresses.find((a) => a.id === selectedAddress)?.zipCode}
                </p>
              )}
            </div>
          )}

          {/* Payment Summary */}
          <div className="panel p-6">
            <h3 className="font-semibold mb-3">Payment</h3>
            <p className="text-stone-300">Method: {paymentMethod === 'card' ? 'Card' : paymentMethod === 'upi' ? 'UPI' : 'Cash on Delivery'}</p>
            {paymentMethod === 'card' && (
              <p className="text-stone-400 text-sm mt-2">Card: **** **** **** {paymentData.cardNumber?.replace(/\s/g, '').slice(-4)}</p>
            )}
            {paymentMethod === 'upi' && (
              <p className="text-stone-400 text-sm mt-2">UPI ID: {upiId}</p>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={() => setCurrentStep(1)} className="flex-1">
              Back
            </Button>
            <Button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="flex-1"
            >
              {loading ? 'Placing Order...' : 'Place Order'}
            </Button>
          </div>
        </motion.div>
      )}

      {/* Step 3: Confirmation */}
      {currentStep === 3 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center space-y-6 py-12"
        >
          <div className="text-6xl">✓</div>
          <h2 className="text-3xl font-bold">Order Confirmed!</h2>
          <p className="text-stone-300">
            Thank you for your order. You will receive a confirmation email shortly.
          </p>
          <p className="text-sm text-stone-400">Redirecting to dashboard...</p>
        </motion.div>
      )}

      {/* Address Modal (isolated component) */}
      <AddressModal
        isOpen={showAddressModal}
        onClose={() => setShowAddressModal(false)}
        onAdded={(addr) => { setAddresses((s) => [...s, addr]); setSelectedAddress(addr.id); }}
      />
    </div>
  );
}
    // end of CheckoutPage component

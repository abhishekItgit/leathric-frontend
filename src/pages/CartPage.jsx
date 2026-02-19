import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { useCart } from '../features/cart/hooks/useCart';
import { useToast } from '../components/ui/Toast';
import { orderApi } from '../services/apiServices';
import { Modal } from '../components/ui/Modal';

export function CartPage() {
  const { cartItems, cartTotal, updateQuantity, removeItem, loading, error } = useCart();
  const { addToast } = useToast();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [loadingCoupon, setLoadingCoupon] = useState(false);
  const [showApplyCoupon, setShowApplyCoupon] = useState(false);

  const calculateDiscount = () => {
    if (!appliedCoupon) return 0;
    const discountAmount = (cartTotal * (appliedCoupon.discountPercent || 0)) / 100;
    return Math.min(discountAmount, appliedCoupon.maxDiscount || Infinity);
  };

  const discount = calculateDiscount();
  const tax = (cartTotal * 0.1); // 10% tax
  const finalTotal = Math.max(0, cartTotal - discount + tax);

  const fmt = (v) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(v || 0);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      addToast('Please enter a coupon code', 'warning');
      return;
    }

    setLoadingCoupon(true);
    try {
      const result = await orderApi.applyPromoCode(couponCode, cartTotal);
      setAppliedCoupon(result);
      setCouponCode('');
      addToast('Coupon applied successfully!', 'success');
      setShowApplyCoupon(false);
    } catch (err) {
      addToast(err.response?.data?.message || 'Invalid coupon code', 'error');
    } finally {
      setLoadingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    addToast('Coupon removed', 'info');
  };

  if (loading) {
    return (
      <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, idx) => (
            <LoadingSkeleton key={idx} className="h-24" />
          ))}
        </div>
        <LoadingSkeleton className="h-96" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="panel p-10 text-center text-red-300">
        <p className="text-lg font-semibold mb-2">Error loading cart</p>
        <p className="text-sm">{error}</p>
      </div>
    );
  }

  if (!cartItems.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="panel p-10 text-center space-y-6"
      >
        <div className="text-6xl">🛒</div>
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="text-stone-400">Browse our collection and add some beautiful leather products!</p>
        <Link to="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
      {/* Cart Items */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Your Cart ({cartItems.length})</h2>

        <div className="space-y-3">
          {cartItems.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="panel flex items-center gap-4 p-4 hover:bg-white/5 transition"
            >
              {/* Image */}
              <img
                src={item.imageUrl}
                alt={item.name}
                className="h-24 w-24 rounded-xl object-cover"
              />

              {/* Product Info */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold truncate">{item.name}</h3>
                <p className="text-sm text-stone-300 mt-1">
                  {fmt(item.price)} each
                </p>
                {item.variant && (
                  <p className="text-xs text-stone-400 mt-1">Variant: {item.variant}</p>
                )}
              </div>

              {/* Quantity Control */}
              <div className="flex items-center gap-2 border border-white/20 rounded-lg p-1">
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                  className="h-8 w-8 flex items-center justify-center hover:bg-white/10 rounded"
                >
                  −
                </motion.button>
                <span className="w-8 text-center text-sm font-semibold">
                  {item.quantity}
                </span>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="h-8 w-8 flex items-center justify-center hover:bg-white/10 rounded"
                >
                  +
                </motion.button>
              </div>

              {/* Item Total */}
              <div className="text-right min-w-20">
                <p className="font-bold text-lg">
                  {fmt((item.price || 0) * item.quantity)}
                </p>
              </div>

              {/* Remove Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => removeItem(item.id)}
                className="text-red-400 hover:text-red-300 transition p-2"
              >
                ✕
              </motion.button>
            </motion.div>
          ))}
        </div>

        {/* Continue Shopping Link */}
        <Link
          to="/products"
          className="inline-flex items-center text-leather-accent hover:text-leather-accent/80 transition"
        >
          ← Continue Shopping
        </Link>
      </div>

      {/* Order Summary Sidebar */}
      <aside className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="panel p-5 space-y-4 h-fit sticky top-24"
        >
          <h3 className="text-lg font-semibold">Order Summary</h3>

          {/* Price Breakdown */}
          <div className="space-y-2 text-sm border-b border-white/10 pb-4">
            <div className="flex justify-between text-stone-300">
              <span>Subtotal</span>
              <span>{fmt(cartTotal)}</span>
            </div>

            {appliedCoupon && (
              <div className="flex justify-between text-green-400">
                <span>Discount ({appliedCoupon.discountPercent}%)</span>
                <span>-{fmt(discount)}</span>
              </div>
            )}

            <div className="flex justify-between text-stone-300">
              <span>Tax (10%)</span>
              <span>{fmt(tax)}</span>
            </div>

            {/* Shipping */}
            <div className="flex justify-between text-stone-300">
              <span>Shipping</span>
              <span className="text-green-400">Free</span>
            </div>
          </div>

          {/* Final Total */}
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total</span>
              <span className="text-leather-accent">{fmt(finalTotal)}</span>
            </div>

          {/* Coupon Section */}
          <div className="border-t border-white/10 pt-4 space-y-2">
            {appliedCoupon ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-green-500/20 border border-green-500/50 rounded-lg p-3 text-sm space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-green-300 font-semibold">
                    ✓ {appliedCoupon.code || couponCode}
                  </span>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-green-400 hover:text-green-300 text-xs"
                  >
                    Remove
                  </button>
                </div>
              </motion.div>
            ) : (
              <>
                <button
                  onClick={() => setShowApplyCoupon(!showApplyCoupon)}
                  className="w-full text-left text-sm text-leather-accent hover:text-leather-accent/80 transition"
                >
                  Have a coupon code? →
                </button>

                {showApplyCoupon && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <input
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                      placeholder="Enter code"
                      className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500 text-sm"
                    />
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleApplyCoupon}
                      disabled={loadingCoupon}
                      className="w-full px-3 py-2 rounded-lg bg-leather-accent/20 border border-leather-accent/50 text-leather-accent text-sm font-medium hover:bg-leather-accent/30 disabled:opacity-50 transition"
                    >
                      {loadingCoupon ? 'Applying...' : 'Apply'}
                    </motion.button>
                  </motion.div>
                )}
              </>
            )}
          </div>

          {/* Checkout Button */}
          <Link to="/checkout" className="block">
            <Button className="w-full">Proceed to Checkout</Button>
          </Link>

          {/* Security Badge */}
          <div className="text-center text-xs text-stone-400 pt-2 border-t border-white/10">
            🔒 Secure checkout powered by Stripe
          </div>
        </motion.div>
      </aside>

      {/* Coupon Modal */}
      <Modal
        isOpen={showApplyCoupon}
        title="Apply Coupon"
        onClose={() => setShowApplyCoupon(false)}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-stone-300">Enter your coupon code to get a discount</p>
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="SUMMER20"
            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white placeholder-stone-500"
          />
        </div>
      </Modal>
    </div>
  );
}

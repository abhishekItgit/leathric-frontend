import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '../components/Button';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../hooks/useAuth';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../components/ui/Toast';
import { userApi, addressApi, orderApi } from '../services/apiServices';
import { Rating } from '../components/ui/Rating';

export function DashboardPage() {
  const { user, logout } = useAuth();
  const { wishlistItems } = useWishlist();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(user);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showOrderDetail, setShowOrderDetail] = useState(null);

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    phone: '',
  });

  const [addressForm, setAddressForm] = useState({
    name: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });

  // Load data
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [ordersData, addressesData] = await Promise.all([
          orderApi.getOrders(),
          addressApi.getAddresses(),
        ]);
        // Normalize orders: handle paginated response and various shapes
        const ordersArray = Array.isArray(ordersData?.data?.content)
          ? ordersData.data.content
          : Array.isArray(ordersData?.data)
            ? ordersData.data
            : Array.isArray(ordersData?.orders)
              ? ordersData.orders
              : Array.isArray(ordersData)
                ? ordersData
                : [];
        setOrders(ordersArray);
        
        // Normalize addresses: handle paginated response
        const addressesArray = Array.isArray(addressesData?.data?.content)
          ? addressesData.data.content
          : Array.isArray(addressesData?.data)
            ? addressesData.data
            : Array.isArray(addressesData)
              ? addressesData
              : [];
        setAddresses(addressesArray);
      } catch (err) {
        addToast('Failed to load dashboard data', 'error');
        setOrders([]);
        setAddresses([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await userApi.updateProfile({
        fullName: formData.fullName,
        phone: formData.phone,
      });
      setProfile({ ...profile, ...formData });
      addToast('Profile updated successfully', 'success');
    } catch (err) {
      addToast('Failed to update profile', 'error');
    }
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    try {
      const newAddress = await addressApi.createAddress(addressForm);
      setAddresses([...addresses, newAddress.data]);
      setAddressForm({
        name: '',
        phone: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
      });
      setShowAddressModal(false);
      addToast('Address added successfully', 'success');
    } catch (err) {
      addToast('Failed to add address', 'error');
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await addressApi.deleteAddress(id);
      setAddresses(addresses.filter((a) => a.id !== id));
      addToast('Address deleted successfully', 'success');
    } catch (err) {
      addToast('Failed to delete address', 'error');
    }
  };

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'success');
  };

  const tabs = [
    { id: 'profile', label: 'Profile' },
    { id: 'orders', label: 'Orders' },
    { id: 'addresses', label: 'Addresses' },
    { id: 'wishlist', label: `Wishlist (${wishlistItems.length})` },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Account</h1>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 overflow-x-auto">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 border-b-2 transition text-sm font-medium ${
              activeTab === tab.id
                ? 'border-leather-accent text-leather-accent'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            {tab.label}
          </motion.button>
        ))}
      </div>

      {/* Tab Content */}
      {loading ? (
        <LoadingSkeleton className="h-96" />
      ) : (
        <>
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="panel p-6 space-y-6 max-w-2xl"
            >
              <h2 className="text-xl font-bold">Personal Information</h2>

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email (Read-only)</label>
                  <input
                    type="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-stone-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit">Save Changes</Button>
                </div>
              </form>

              {/* Logout */}
              <div className="border-t border-white/10 pt-6">
                <Button variant="danger" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </motion.div>
          )}

          {/* Orders Tab */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {orders.length === 0 ? (
                <div className="panel p-10 text-center text-stone-300">
                  <p className="text-lg font-medium mb-2">No orders yet</p>
                  <p className="text-sm">Start shopping to place your first order!</p>
                </div>
              ) : (
                orders.map((order) => (
                  <motion.div
                    key={order.orderId || order.id}
                    whileHover={{ y: -2 }}
                    className="panel p-6 space-y-3 cursor-pointer hover:bg-white/5 transition"
                    onClick={() => setShowOrderDetail(order)}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-semibold">Order #{order.orderId || order.id}</p>
                        <p className="text-sm text-stone-400">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.status === 'delivered'
                          ? 'bg-green-500/20 text-green-300'
                          : order.status === 'shipped'
                            ? 'bg-blue-500/20 text-blue-300'
                            : order.status === 'processing'
                              ? 'bg-amber-500/20 text-amber-300'
                              : 'bg-stone-600/20 text-stone-300'
                      }`}>
                        {order.status?.toUpperCase()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-stone-300">
                        {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                      </p>
                      <p className="font-bold text-leather-accent">
                        ₹{(order.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </p>
                    </div>
                  </motion.div>
                ))
              )}
            </motion.div>
          )}

          {/* Addresses Tab */}
          {activeTab === 'addresses' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Button onClick={() => setShowAddressModal(true)} className="w-full sm:w-auto">
                + Add New Address
              </Button>

              {addresses.length === 0 ? (
                <div className="panel p-10 text-center text-stone-300">
                  <p className="text-lg font-medium mb-2">No addresses saved</p>
                  <p className="text-sm">Add your first address to get started</p>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {addresses.map((address) => (
                    <motion.div
                      key={address.id}
                      whileHover={{ scale: 1.02 }}
                      className="panel p-4 space-y-3"
                    >
                      <p className="font-semibold">{address.name}</p>
                      <p className="text-sm text-stone-300">
                        {address.addressLine1}<br />
                        {address.addressLine2 && <>{address.addressLine2}<br /></>}
                        {address.city}, {address.state} {address.zipCode}<br />
                        {address.country}
                      </p>
                      <p className="text-xs text-stone-400">📱 {address.phone}</p>

                      <div className="flex gap-2 pt-3 border-t border-white/10">
                        <Button
                          variant="secondary"
                          onClick={() => handleDeleteAddress(address.id)}
                          className="flex-1"
                        >
                          Delete
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Wishlist Tab */}
          {activeTab === 'wishlist' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {wishlistItems.length === 0 ? (
                <div className="panel p-10 text-center text-stone-300">
                  <p className="text-lg font-medium mb-2">Your wishlist is empty</p>
                  <p className="text-sm">Start adding your favorite items!</p>
                </div>
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {wishlistItems.map((item) => (
                    <motion.div
                      key={item.id}
                      whileHover={{ y: -6 }}
                      className="panel p-4 space-y-3 group"
                    >
                      {item.imageUrl && (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="h-40 w-full rounded-lg object-cover group-hover:scale-105 transition"
                        />
                      )}
                      <div>
                        <p className="font-semibold line-clamp-2">{item.name}</p>
                        {item.rating && (
                          <Rating value={item.rating} readOnly size="sm" className="mt-2" />
                        )}
                        <p className="text-leather-accent font-bold mt-2">
                          ₹{(item.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </>
      )}

      {/* Address Modal */}
      <Modal
        isOpen={showAddressModal}
        title="Add New Address"
        onClose={() => setShowAddressModal(false)}
        size="lg"
      >
        <form onSubmit={handleAddAddress} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Full Name</label>
            <input
              type="text"
              value={addressForm.name}
              onChange={(e) => setAddressForm({ ...addressForm, name: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phone</label>
            <input
              type="tel"
              value={addressForm.phone}
              onChange={(e) => setAddressForm({ ...addressForm, phone: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address Line 1</label>
            <input
              type="text"
              value={addressForm.addressLine1}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine1: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Address Line 2</label>
            <input
              type="text"
              value={addressForm.addressLine2}
              onChange={(e) => setAddressForm({ ...addressForm, addressLine2: e.target.value })}
              className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">City</label>
              <input
                type="text"
                value={addressForm.city}
                onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">State</label>
              <input
                type="text"
                value={addressForm.state}
                onChange={(e) => setAddressForm({ ...addressForm, state: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">ZIP Code</label>
              <input
                type="text"
                value={addressForm.zipCode}
                onChange={(e) => setAddressForm({ ...addressForm, zipCode: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Country</label>
              <input
                type="text"
                value={addressForm.country}
                onChange={(e) => setAddressForm({ ...addressForm, country: e.target.value })}
                className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/20 text-white"
                required
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="secondary" onClick={() => setShowAddressModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Add Address
            </Button>
          </div>
        </form>
      </Modal>

      {/* Order Detail Modal */}
      {showOrderDetail && (
        <Modal
          isOpen={!!showOrderDetail}
          title={`Order #${showOrderDetail.orderId || showOrderDetail.id}`}
          onClose={() => setShowOrderDetail(null)}
          size="lg"
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-white/5 rounded-lg">
              <div>
                <p className="text-xs text-stone-400 uppercase">Status</p>
                <p className="font-semibold text-lg">{showOrderDetail.status?.toUpperCase()}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase">Total</p>
                <p className="font-semibold text-leather-accent text-lg">
                  ₹{(showOrderDetail.totalAmount || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase">Order Date</p>
                <p className="font-semibold text-sm">{new Date(showOrderDetail.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-xs text-stone-400 uppercase">Payment Status</p>
                <p className="font-semibold text-sm">{showOrderDetail.paymentStatus || 'PENDING'}</p>
              </div>
            </div>

            <div>
              <p className="text-sm font-semibold text-stone-400 uppercase mb-3">Items</p>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {showOrderDetail.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-sm p-3 bg-white/5 rounded">
                    <div className="flex-1">
                      <p className="text-stone-200 font-medium">{item.productName || item.name || 'Product'}</p>
                      <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-leather-accent font-semibold">
                      ₹{((item.price || 0) * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {showOrderDetail.notes && (
              <div className="p-3 bg-stone-900/50 rounded-lg">
                <p className="text-xs text-stone-400 uppercase mb-1">Notes</p>
                <p className="text-sm text-stone-300">{showOrderDetail.notes}</p>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

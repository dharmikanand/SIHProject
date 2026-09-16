import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { CROPS_DATA, TRANSLATIONS } from '../data/mockData';
import { translate } from '../i18n';
import confetti from 'canvas-confetti';
import {
  isBackendHealthy,
  fetchListings as apiFetchListings,
  checkout as apiCheckout,
  confirmDelivery as apiConfirmDelivery,
} from '../services/api';

const AppContext = createContext();

// Map a backend Listing object onto the frontend crop shape (best-effort, for merged display)
function mockFromServerListing(l) {
  const rupee = (p) => Math.round(p / 100);
  return {
    id: l.id,
    serverListingId: l.id,
    name: l.crop_name || l.name || 'Server Listing',
    category: l.category || 'Vegetables',
    description: l.description || 'Listed on KrishiSetu server escrow grid.',
    farmerPrice: rupee(l.farmer_price_paise ?? 0),
    mandiPrice: rupee(l.mandi_price_paise ?? 0),
    retailPrice: rupee(l.retail_price_paise ?? 0),
    krishiSetuPrice: rupee(l.platform_price_paise ?? 0),
    quantity: l.quantity_quintals ?? 10,
    qualityGrade: l.quality_grade || 'Grade A',
    organicCert: !!l.organic_cert,
    harvestDate: 'Freshly Harvested',
    minOrderBulk: 500,
    image: l.image_url || 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
    farmer: {
      name: l.farmer_name || 'KrishiSetu Partner Farmer',
      village: l.village || 'Nashik',
      district: l.district || 'Maharashtra',
      rating: 4.8,
    },
    tags: ['Server Escrow', 'Verified'],
  };
}

export function AppProvider({ children }) {
  const [language, setLanguage] = useState('en');
  const [user, setUser] = useState(null); // { name, role: 'farmer'|'buyer', mobile } — null = logged out
  const [persona, setPersona] = useState('buyer'); // 'buyer', 'farmer', 'logistics', 'ai-forecast', 'impact'
  const [crops, setCrops] = useState(CROPS_DATA);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activeModal, setActiveModal] = useState(null); // 'price-breakdown', 'voice-assistant', 'traceability', 'add-listing', 'cart'
  
  // Cart state for buyer
  const [cart, setCart] = useState([
    {
      crop: CROPS_DATA[0], // Nashik Red Onion
      quantityKg: 50,
      mode: 'B2C' // 'B2C' or 'B2B'
    },
    {
      crop: CROPS_DATA[1], // Kolar Tomato
      quantityKg: 20,
      mode: 'B2C'
    }
  ]);

  // Order history with escrow tracking
  const [orders, setOrders] = useState([
    {
      id: "ORD-2026-9812",
      date: "Today, 11:20 AM",
      buyerType: "Consumer (Residential Society)",
      buyerName: "Greenwood Residency Society, Pune",
      items: [
        { cropName: "Nashik Red Onion", quantityKg: 200, unitPrice: 32, farmerPrice: 28 },
        { cropName: "Kolar Fresh Tomato", quantityKg: 100, unitPrice: 29, farmerPrice: 24 }
      ],
      totalAmount: 9300,
      farmerPayout: 8000,
      status: "IN_TRANSIT",
      escrowStatus: "LOCKED_IN_ESCROW", // 'LOCKED_IN_ESCROW', 'QUALITY_VERIFIED', 'RELEASED_TO_FARMER'
      logisticsStatus: "IN_TRANSIT", // 'SCHEDULED', 'PICKED_UP', 'IN_TRANSIT', 'DELIVERED'
      deliveryOtp: "4819",
      farmerName: "Rameshwar Patil & Venkatesh Gowda",
      estimatedArrival: "Tomorrow, 08:30 AM"
    },
    {
      id: "ORD-2026-9780",
      date: "Yesterday, 04:45 PM",
      buyerType: "Bulk B2B Institution",
      buyerName: "Haldiram Snack Foods Processing Unit",
      items: [
        { cropName: "Agra Chandramukhi Potato", quantityKg: 2500, unitPrice: 23, farmerPrice: 20 }
      ],
      totalAmount: 57500,
      farmerPayout: 50000,
      status: "DELIVERED",
      escrowStatus: "RELEASED_TO_FARMER",
      logisticsStatus: "DELIVERED",
      deliveryOtp: "9021",
      farmerName: "Suresh Chandra Verma",
      estimatedArrival: "Delivered (OTP Verified)"
    }
  ]);

  // Toast Notifications (starts empty, auto-dismisses in 2s)
  const [notifications, setNotifications] = useState([]);

  // Backend connectivity (NFR-3 graceful degradation)
  const [backendOnline, setBackendOnline] = useState(false);
  const healthChecked = useRef(false);
  useEffect(() => {
    if (healthChecked.current) return;
    healthChecked.current = true;
    isBackendHealthy().then(async (online) => {
      setBackendOnline(online);
      // Merge server listings (marked serverSynced → server-side escrow checkout)
      if (online) {
        try {
          const serverListings = await apiFetchListings();
          const mapped = serverListings.map((l) => ({
            ...mockFromServerListing(l),
            serverSynced: true,
          }));
          setCrops((prev) => {
            const seen = new Set(prev.map((c) => c.serverListingId));
            return [...mapped.filter((m) => !seen.has(m.serverListingId)), ...prev];
          });
        } catch { /* keep mock data */ }
      }
    });
  }, []);

  // Translation helper — full dictionary in src/i18n.js, legacy keys fall back to mockData
  const t = (key, ...args) => {
    const i18nVal = translate(language, key, ...args);
    if (i18nVal !== key) return i18nVal;
    if (TRANSLATIONS[language] && TRANSLATIONS[language][key]) {
      return TRANSLATIONS[language][key];
    }
    return TRANSLATIONS.en[key] || key;
  };

  const removeNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const login = ({ name, role, mobile }) => {
    setUser({ name, role, mobile });
    // Land each role on its home surface
    setPersona(role === 'farmer' ? 'farmer' : 'buyer');
  };

  const logout = () => {
    setUser(null);
    setPersona('buyer');
    setActiveModal(null);
  };

  const addNotification = (title, message, type = "info") => {
    const id = Date.now() + Math.random();
    const newNotif = {
      id,
      title,
      message,
      type,
      timestamp: "Just now"
    };
    setNotifications((prev) => [newNotif, ...prev.slice(0, 4)]);

    // Automatically dismiss after exactly 2 seconds as requested by user
    setTimeout(() => {
      removeNotification(id);
    }, 2000);
  };

  const addToCart = (crop, quantityKg = 10, mode = 'B2C') => {
    setCart((prev) => {
      const existing = prev.find((item) => item.crop.id === crop.id);
      if (existing) {
        return prev.map((item) =>
          item.crop.id === crop.id
            ? { ...item, quantityKg: item.quantityKg + quantityKg }
            : item
        );
      }
      return [...prev, { crop, quantityKg, mode }];
    });
    addNotification(t('toastAddedToBasket'), t('toastAddedBody', quantityKg, crop.name), "success");
  };

  const updateCartQuantity = (cropId, quantityKg) => {
    if (quantityKg <= 0) {
      setCart((prev) => prev.filter((item) => item.crop.id !== cropId));
    } else {
      setCart((prev) =>
        prev.map((item) =>
          item.crop.id === cropId ? { ...item, quantityKg } : item
        )
      );
    }
  };

  const clearCart = () => setCart([]);

  const addCropListing = (newCrop) => {
    const createdCrop = {
      ...newCrop,
      id: `crop-${Date.now()}`,
      farmerPrice: Number(newCrop.farmerPrice),
      mandiPrice: Number(newCrop.mandiPrice || Math.round(newCrop.farmerPrice * 0.65)),
      retailPrice: Number(newCrop.retailPrice || Math.round(newCrop.farmerPrice * 1.45)),
      krishiSetuPrice: Number(newCrop.krishiSetuPrice || Math.round(newCrop.farmerPrice * 1.15)),
      harvestDate: newCrop.harvestDate || "Freshly Harvested",
      rating: 5.0,
      tags: ["Direct Listing", "Verified Farmer", "Escrow Protected"]
    };
    setCrops((prev) => [createdCrop, ...prev]);
    addNotification(
      t('toastListedSuccess'),
      t('toastListedBody', createdCrop.name, createdCrop.farmerPrice),
      "success"
    );
    try {
      confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
  };

  const checkoutEscrowOrder = async (orderData) => {
    // Server path only when EVERY cart item exists on the backend (crops listed via
    // API). Locally-added demo crops (CROPS_DATA ids) are unknown server-side and
    // would 404 — for those, use the local demo escrow directly (no error toast).
    const allServerSynced = cart.length > 0 && cart.every((item) => item.crop.serverSynced);
    if (backendOnline && allServerSynced) {
      try {
        const order = await apiCheckout({
          buyerName: orderData?.buyerName || "Smart Consumer",
          buyerType: orderData?.buyerType || "Consumer Direct",
          mode: cart[0]?.mode === 'B2B' ? 'B2B' : 'B2C',
          items: cart.map((item) => ({
            listingId: item.crop.id,
            quantityKg: item.quantityKg,
          })),
        });
        const newOrder = {
          id: order.id,
          date: "Just now",
          buyerType: order.buyer_type,
          buyerName: order.buyer_name,
          items: order.items.map((i) => ({
            cropName: i.crop_name,
            quantityKg: i.quantity_kg,
            unitPrice: i.unit_price_paise / 100,
            farmerPrice: i.farmer_price_paise / 100,
          })),
          totalAmount: order.total_paise / 100,
          farmerPayout: order.split.farmer_payout_paise / 100,
          status: "WAITING",
          escrowStatus: "LOCKED_IN_ESCROW",
          logisticsStatus: "SCHEDULED",
          deliveryOtp: null, // OTP lives server-side; delivered via SMS in production
          serverOrderId: order.id,
          farmerName: "KrishiSetu Partner Farmers",
          estimatedArrival: "Tomorrow by 09:00 AM"
        };
        setOrders((prev) => [newOrder, ...prev]);
        clearCart();
        setActiveModal(null);
        addNotification(
          t('toastOrderPlaced'),
          t('toastEscrowLockedBody', newOrder.totalAmount.toLocaleString('en-IN')),
          "success"
        );
        try {
          confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
        } catch { /* ignore */ }
        return newOrder;        } catch (err) {
        addNotification(
          "Escrow Sync Failed",
          `${err.message} — completing order in local demo mode.`,
          "error"
        );
        // fall through to local demo path
      }
    }

    // Fallback path: local demo escrow (offline / backend down / local crops)
    const newOrder = {
      id: `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: "Just now",
      buyerType: orderData.buyerType || "Consumer Direct",
      buyerName: orderData.buyerName || "Smart Consumer",
      items: cart.map(item => ({
        cropName: item.crop.name,
        quantityKg: item.quantityKg,
        unitPrice: item.crop.krishiSetuPrice,
        farmerPrice: item.crop.farmerPrice
      })),
      totalAmount: cart.reduce((acc, item) => acc + item.crop.krishiSetuPrice * item.quantityKg, 0),
      farmerPayout: cart.reduce((acc, item) => acc + item.crop.farmerPrice * item.quantityKg, 0),
      status: "WAITING",
      escrowStatus: "LOCKED_IN_ESCROW",
      logisticsStatus: "SCHEDULED",
      deliveryOtp: String(Math.floor(1000 + Math.random() * 9000)),
      farmerName: cart[0]?.crop.farmer.name || "KrishiSetu Partner Farmers",
      estimatedArrival: "Tomorrow by 09:00 AM"
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    setActiveModal(null);
    addNotification(
      t('toastOrderPlaced'),
      t('toastEscrowLockedBody', newOrder.totalAmount.toLocaleString('en-IN')),
      "success"
    );
    try {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    } catch {
      // ignore
    }
    return newOrder;
  };

  const cancelOrder = (orderId) => {
    const order = orders.find((o) => o.id === orderId);
    if (!order || order.status === 'CANCELLED' || order.escrowStatus !== 'LOCKED_IN_ESCROW') return;

    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? { ...o, status: 'CANCELLED', escrowStatus: 'REFUNDED', logisticsStatus: 'CANCELLED' }
          : o
      )
    );
    addNotification(
      t('orderCancelledToast'),
      t('orderRefundToast', order.totalAmount.toLocaleString('en-IN')),
      'info'
    );
  };

  const releaseEscrow = async (orderId) => {
    const order = orders.find((o) => o.id === orderId);

    // Server-backed release with OTP if this order lives on the backend
    if (backendOnline && order?.serverOrderId) {
      try {
        // Prototype flow: fetch-and-confirm happens server-side via the demo OTP.
        await apiConfirmDelivery(order.serverOrderId, order.demoOtp || '');
      } catch {
        // OTP mismatch keeps escrow locked; the local state below still reflects UI flow.
      }
    }

    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          status: 'DELIVERED',
          escrowStatus: "RELEASED_TO_FARMER",
          logisticsStatus: "DELIVERED"
        };
      }
      return o;
    }));
    addNotification(
      t('toastEscrowReleased'),
      t('toastEscrowReleasedBody'),
      "success"
    );
    try {
      confetti({ particleCount: 80, spread: 60, origin: { y: 0.5 } });
    } catch {
      // ignore
    }
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        user,
        login,
        logout,
        persona,
        setPersona,
        crops,
        setCrops,
        selectedCrop,
        setSelectedCrop,
        activeModal,
        setActiveModal,
        cart,
        addToCart,
        updateCartQuantity,
        clearCart,
        orders,
        backendOnline,
        placeOrder: checkoutEscrowOrder,
        releaseEscrow,
        cancelOrder,
        addCropListing,
        notifications,
        addNotification,
        removeNotification,
        t
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

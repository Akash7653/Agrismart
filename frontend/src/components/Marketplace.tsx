import React, { useState } from 'react';
import { useTranslation } from '../utils/translations';
import { ShoppingCart, Filter, Star, Truck, Shield, Package, Search, X, Plus, Minus, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  description: string;
  inStock: boolean;
  fastDelivery: boolean;
  organic: boolean;
  brand: string;
  usage: string;
}

interface MarketplaceProps {
  currentLanguage: string;
}

const Marketplace: React.FC<MarketplaceProps> = ({ currentLanguage }) => {
  const { t } = useTranslation(currentLanguage);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [cartOpen, setCartOpen] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [checkoutMessage, setCheckoutMessage] = useState('');

  const categories = [
    'All', 'Fertilizers', 'Pesticides', 'Seeds', 'Tools', 'Organic'
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'NPK Complex Fertilizer 16-16-16',
      category: 'Fertilizers',
      price: 850,
      originalPrice: 950,
      rating: 4.5,
      reviews: 127,
      image: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Balanced NPK fertilizer ideal for all crops. Promotes healthy growth and high yield.',
      inStock: true,
      fastDelivery: true,
      organic: false,
      brand: 'FarmCorp',
      usage: 'Apply 25kg per hectare during sowing'
    },
    {
      id: '2',
      name: 'Organic Neem Pesticide',
      category: 'Pesticides',
      price: 320,
      rating: 4.8,
      reviews: 89,
      image: 'https://images.pexels.com/photos/4503729/pexels-photo-4503729.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Natural neem-based pesticide for eco-friendly pest control. Safe for beneficial insects.',
      inStock: true,
      fastDelivery: false,
      organic: true,
      brand: 'EcoFarm',
      usage: 'Dilute 5ml per liter of water'
    },
    {
      id: '3',
      name: 'Hybrid Tomato Seeds - Roma',
      category: 'Seeds',
      price: 450,
      rating: 4.6,
      reviews: 203,
      image: 'https://images.pexels.com/photos/1656663/pexels-photo-1656663.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'High-yield hybrid tomato seeds with disease resistance. Perfect for commercial cultivation.',
      inStock: true,
      fastDelivery: true,
      organic: false,
      brand: 'SeedMaster',
      usage: 'Sow in nursery, transplant after 30 days'
    },
    {
      id: '4',
      name: 'Professional Pruning Shears',
      category: 'Tools',
      price: 1200,
      originalPrice: 1500,
      rating: 4.7,
      reviews: 156,
      image: 'https://images.pexels.com/photos/4503729/pexels-photo-4503729.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Durable steel pruning shears with ergonomic grip. Ideal for precision cutting.',
      inStock: true,
      fastDelivery: true,
      organic: false,
      brand: 'ToolPro',
      usage: 'Perfect for pruning branches up to 2cm diameter'
    },
    {
      id: '5',
      name: 'Organic Compost Fertilizer',
      category: 'Organic',
      price: 180,
      rating: 4.4,
      reviews: 92,
      image: 'https://images.pexels.com/photos/4503751/pexels-photo-4503751.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Premium organic compost made from cow dung and agricultural waste. Enriches soil naturally.',
      inStock: true,
      fastDelivery: false,
      organic: true,
      brand: 'GreenGold',
      usage: 'Apply 2-3 kg per square meter'
    },
    {
      id: '6',
      name: 'Fungicide Spray - Copper Based',
      category: 'Pesticides',
      price: 675,
      rating: 4.3,
      reviews: 74,
      image: 'https://images.pexels.com/photos/4503729/pexels-photo-4503729.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Effective copper-based fungicide for controlling late blight, downy mildew, and other diseases.',
      inStock: false,
      fastDelivery: false,
      organic: false,
      brand: 'CropShield',
      usage: 'Spray during early morning or evening'
    }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const addToCart = (productId: string) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const getTotalCartItems = () => {
    return Object.values(cart).reduce((sum, count) => sum + count, 0);
  };

  const getCartTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const product = products.find(p => p.id === id);
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const simulateCheckout = async (cartItems: {id: string, qty: number}[]) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Use cartItems to calculate total for more realistic simulation
    const totalAmount = cartItems.reduce((sum, item) => {
      const product = products.find(p => p.id === item.id);
      return sum + (product ? product.price * item.qty : 0);
    }, 0);
    
    // Simulate random success/failure for demo purposes
    const isSuccess = Math.random() > 0.3; // 70% success rate
    
    if (isSuccess) {
      return { 
        success: true, 
        message: `Order placed successfully! Total: ₹${totalAmount}. You will receive a confirmation email shortly.` 
      };
    } else {
      return { 
        success: false, 
        message: `Payment processing failed for ₹${totalAmount}. Please try again or use a different payment method.` 
      };
    }
  };

  const handleCheckout = async () => {
    if (getTotalCartItems() === 0) return;
    
    setCheckingOut(true);
    setCheckoutStatus('idle');
    setCheckoutMessage('');

    try {
      const items = Object.entries(cart).map(([id, qty]) => ({ id, qty }));
      
      // First try the actual payment gateway API
      let checkoutResult;
      
      try {
        const res = await fetch('https://agrismart-7zyv.onrender.com/api/create-checkout-session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ items })
        });
        
        if (res.ok) {
          const data = await res.json();
          if (data.url) {
            window.location.href = data.url;
            return;
          }
          checkoutResult = { success: false, message: data.message || 'Unable to start checkout.' };
        } else {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
      } catch (error) {
        console.warn('Payment gateway API failed, falling back to demo mode:', error);
        
        // Fallback to simulated checkout
        checkoutResult = await simulateCheckout(items);
      }

      if (checkoutResult.success) {
        setCheckoutStatus('success');
        setCheckoutMessage(checkoutResult.message);
        // Clear cart on successful checkout
        setCart({});
        // Close cart after 3 seconds
        setTimeout(() => {
          setCartOpen(false);
          setCheckoutStatus('idle');
        }, 3000);
      } else {
        setCheckoutStatus('error');
        setCheckoutMessage(checkoutResult.message);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      setCheckoutStatus('error');
      setCheckoutMessage('An unexpected error occurred. Please try again.');
    } finally {
      setCheckingOut(false);
    }
  };

  const clearCart = () => {
    setCart({});
    setCheckoutStatus('idle');
    setCheckoutMessage('');
  };

  return (
    <div id="marketplace" className="py-20 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {t('marketplaceTitle')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('analyticsSubtitle')}
          </p>
        </div>

        {/* Header with Search and Cart */}
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder={t('searchProducts')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCartOpen(true)}
                aria-label="Open cart"
                className="relative bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center"
              >
                <ShoppingCart className="w-5 h-5 mr-2" />
                {t('cart')}
                {getTotalCartItems() > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {getTotalCartItems()}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Cart Drawer */}
        <div
          className={`fixed inset-y-0 right-0 w-80 bg-white shadow-2xl transform transition-transform z-50 ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-bold">{t('cart')}</h3>
            <button onClick={() => setCartOpen(false)} aria-label="Close cart" className="p-2 rounded-md hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-4 overflow-y-auto max-h-[calc(100vh-200px)]">
            {getTotalCartItems() === 0 ? (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <div className="text-sm text-gray-600">{t('emptyCart') || 'Your cart is empty'}</div>
              </div>
            ) : (
              Object.entries(cart).map(([productId, qty]) => {
                const product = products.find(p => p.id === productId);
                if (!product) return null;
                return (
                  <div key={product.id} className="flex items-center space-x-3 mb-4">
                    <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded" />
                    <div className="flex-1">
                      <div className="font-medium text-sm text-gray-900">{product.name}</div>
                      <div className="text-xs text-gray-500">₹{product.price} x {qty} = <span className="font-semibold">₹{product.price * qty}</span></div>
                      <div className="mt-2 flex items-center space-x-2">
                        <button aria-label={`Decrease quantity of ${product.name}`} onClick={() => setCart(prev => ({ ...prev, [product.id]: Math.max(1, (prev[product.id] || 1) - 1) }))} className="p-1 rounded-md hover:bg-gray-100">
                          <Minus className="w-4 h-4" />
                        </button>
                        <div className="px-3 py-1 border rounded">{qty}</div>
                        <button aria-label={`Increase quantity of ${product.name}`} onClick={() => setCart(prev => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }))} className="p-1 rounded-md hover:bg-gray-100">
                          <Plus className="w-4 h-4" />
                        </button>
                        <button aria-label={`Remove ${product.name} from cart`} onClick={() => { const copy = { ...cart }; delete copy[product.id]; setCart(copy); }} className="ml-2 p-1 rounded-md hover:bg-gray-100 text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Checkout Status Messages */}
          {checkoutStatus !== 'idle' && (
            <div className={`p-4 border-t ${
              checkoutStatus === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
            }`}>
              <div className={`flex items-center space-x-2 ${
                checkoutStatus === 'success' ? 'text-green-800' : 'text-red-800'
              }`}>
                {checkoutStatus === 'success' ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <div className="text-sm font-medium">{checkoutMessage}</div>
              </div>
            </div>
          )}

          <div className="p-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-gray-600">{t('subtotal') || 'Subtotal'}</div>
              <div className="text-lg font-bold">₹{getCartTotal()}</div>
            </div>
            
            {getTotalCartItems() > 0 && (
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={clearCart}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm"
                >
                  Clear Cart
                </button>
              </div>
            )}
            
            <button
              onClick={handleCheckout}
              className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              disabled={checkingOut || getTotalCartItems() === 0}
            >
              {checkingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('CheckoutProcessing') || 'Processing...'}
                </>
              ) : (
                t('ProceedToCheckout') || 'Proceed to Checkout'
              )}
            </button>
            
            <div className="mt-2 text-xs text-gray-500 text-center">
              Demo mode: Simulated checkout process
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                {t('categoriesLabel')}
              </h3>
              <div className="space-y-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                      selectedCategory === category
                        ? 'bg-orange-500 text-white'
                        : 'text-gray-600 hover:bg-orange-50 hover:text-orange-600'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Features */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h4 className="text-lg font-bold text-gray-900 mb-4">{t('whyChooseUs')}</h4>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-2 rounded-full">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('fastDelivery')}</div>
                    <div className="text-sm text-gray-600">{t('fastDelivery')}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <Shield className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('qualityAssured')}</div>
                    <div className="text-sm text-gray-600">100% genuine products</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-full">
                    <Package className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{t('easyReturns')}</div>
                    <div className="text-sm text-gray-600">30-day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <div className="text-gray-600">
                {t('showingProducts').replace('{count}', String(filteredProducts.length))}
              </div>
              <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500" aria-label="Sort products" title="Sort products">
                <option>{t('sortByPopularity')}</option>
                <option>{t('sortPriceLowHigh')}</option>
                <option>{t('sortPriceHighLow')}</option>
                <option>{t('sortNewest')}</option>
                <option>{t('sortRating')}</option>
              </select>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="relative">
                    <img
                      src={product.image || '/assets/placeholder-product.svg'}
                      alt={product.name}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-3 left-3 flex flex-col space-y-2">
                      {product.fastDelivery && (
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {t('fastDeliveryBadge')}
                        </span>
                      )}
                      {product.organic && (
                        <span className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {t('organicBadge')}
                        </span>
                      )}
                      {product.originalPrice && (
                        <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          {t('saleBadge')}
                        </span>
                      )}
                    </div>
                    {!product.inStock && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{t('outOfStock')}</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="mb-2">
                      <span className="text-xs text-orange-600 bg-orange-100 px-2 py-1 rounded-full">
                        {product.category}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="flex items-center space-x-2 mb-3">
                      <div className="flex items-center">
                        <Star className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium ml-1">{product.rating}</span>
                      </div>
                      <span className="text-sm text-gray-500">({product.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ₹{product.originalPrice}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-500">
                        {t('brand')}: {product.brand}
                      </div>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <div className="text-xs font-medium text-gray-700 mb-1">{t('usage')}</div>
                      <div className="text-xs text-gray-600">{product.usage}</div>
                    </div>

                    <button
                      onClick={() => addToCart(product.id)}
                      disabled={!product.inStock}
                      className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors font-semibold flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      {cart[product.id] ? t('addedCount').replace('{count}', String(cart[product.id])) : t('addToCartBtn')}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">{t('noProductsFound')}</h3>
                <p className="text-gray-600">{t('tryAdjustingSearch')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;
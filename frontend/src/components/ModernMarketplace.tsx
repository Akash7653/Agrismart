import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Filter, Star, Heart, Truck, Shield,
  TrendingUp, Package, DollarSign, Clock, ChevronRight, Grid,
  List, ArrowUpDown, X, Plus, Minus, CheckCircle, AlertCircle,
  CreditCard
} from 'lucide-react';
import { useTranslation } from '../utils/translations';

// Razorpay script loader
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => {
      resolve((window as any).Razorpay);
    };
    document.body.appendChild(script);
  });
};

interface MarketplaceProps {
  currentLanguage: string;
}

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
  discount?: number;
  seller: string;
  delivery: string;
  features: string[];
  certification?: string;
  origin?: string;
}

const ModernMarketplace: React.FC<MarketplaceProps> = ({ currentLanguage }) => {
  const { t } = useTranslation(currentLanguage);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Load Razorpay on component mount
  useEffect(() => {
    loadRazorpay();
  }, []);

  // Process payment with Razorpay
  const processPayment = async () => {
    if (getTotalCartItems() === 0) return;
    
    setIsProcessingPayment(true);
    
    try {
      // Create order on backend
      const response = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getTotalCartPrice(),
          type: 'marketplace',
          reference_id: 'cart_' + Date.now(),
          user_id: '1' // Replace with actual user ID
        }),
      });
      
      const orderData = await response.json();
      
      if (orderData.success) {
        const Razorpay = (window as any).Razorpay;
        const razorpay = new Razorpay({
          key_id: orderData.data.key_id,
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          name: 'AgriSmart',
          description: 'Purchase of natural farming products',
          order_id: orderData.data.order_id,
          handler: async function (response: any) {
            // Verify payment on backend
            const verifyResponse = await fetch('/api/payments/verify', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                type: 'marketplace',
                reference_id: 'cart_' + Date.now()
              }),
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              // Clear cart and show success message
              setCartItems({});
              alert('Payment successful! Your order has been placed.');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
            
            setIsProcessingPayment(false);
          },
          prefill: {
            name: 'Farmer User', // Replace with actual user name
            email: 'farmer@agrismart.com', // Replace with actual user email
            contact: '+919876543210' // Replace with actual user phone
          },
          theme: {
            color: '#10b981' // Green color matching AgriSmart theme
          }
        });
        
        razorpay.open();
      } else {
        alert('Failed to create payment order. Please try again.');
        setIsProcessingPayment(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment processing failed. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  const categories = [
    { id: 'all', name: 'All Products', icon: Package },
    { id: 'seeds', name: 'Seeds', icon: Package },
    { id: 'fertilizers', name: 'Natural Fertilizers', icon: Package },
    { id: 'pesticides', name: 'Bio-Pesticides', icon: Shield },
    { id: 'tools', name: 'Tools', icon: Package },
    { id: 'irrigation', name: 'Irrigation', icon: Package }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Organic Wheat Seeds - Heritage Variety',
      category: 'seeds',
      price: 450,
      originalPrice: 550,
      rating: 4.8,
      reviews: 127,
      image: '/images/products/organic-wheat-seeds.jpg',
      description: 'Premium heritage wheat seeds with 95% germination rate and disease resistance. Perfect for organic farming.',
      inStock: true,
      discount: 18,
      seller: 'AgriSeeds Pro',
      delivery: '2-3 days',
      features: ['95% Germination', 'Disease Resistant', 'High Yield', 'Certified Organic'],
      certification: 'INDIA ORGANIC',
      origin: 'Madhya Pradesh, India'
    },
    {
      id: '2',
      name: 'Vermicompost - Premium Grade',
      category: 'fertilizers',
      price: 12,
      rating: 4.7,
      reviews: 89,
      image: '/images/products/vermicompost.jpg',
      description: '100% organic vermicompost produced from cow dung and agricultural waste. Rich in essential nutrients.',
      inStock: true,
      seller: 'NutriGrow',
      delivery: '1-2 days',
      features: ['100% Organic', 'Balanced NPK', 'Water Soluble', 'All Crops'],
      certification: 'ORGANIC INDIA',
      origin: 'Punjab, India'
    },
    {
      id: '3',
      name: 'Neem Oil Bio-Pesticide - 500ml',
      category: 'pesticides',
      price: 180,
      rating: 4.7,
      reviews: 156,
      image: '/images/products/neem-oil.jpg',
      description: '100% organic neem oil pesticide for safe and effective pest control. Harmless to beneficial insects.',
      inStock: true,
      discount: 10,
      seller: 'BioProtect',
      delivery: '2-3 days',
      features: ['100% Organic', 'Broad Spectrum', 'Safe for Edibles', 'Eco-Friendly'],
      certification: 'NPOP CERTIFIED',
      origin: 'Rajasthan, India'
    },
    {
      id: '4',
      name: 'Organic Farm Tools Kit',
      category: 'tools',
      price: 320,
      rating: 4.9,
      reviews: 203,
      image: '/images/products/organic-tools.jpg',
      description: 'Complete set of organic farming tools including hand tools, soil testers, and measuring equipment.',
      inStock: true,
      seller: 'EcoFarm Tools',
      delivery: '1-2 days',
      features: ['Sustainable Materials', 'Ergonomic Design', 'Lifetime Warranty', 'Organic Certified'],
      certification: 'ECO-FRIENDLY',
      origin: 'Maharashtra, India'
    },
    {
      id: '5',
      name: 'Drip Irrigation System - Organic Kit',
      category: 'irrigation',
      price: 1200,
      originalPrice: 1500,
      rating: 4.5,
      reviews: 67,
      image: '/images/products/drip-irrigation.jpg',
      description: 'Water-efficient drip irrigation system designed for organic farming with biodegradable components.',
      inStock: true,
      discount: 20,
      seller: 'EcoIrrigation Pro',
      delivery: '3-5 days',
      features: ['Water Efficient', 'Biodegradable', 'Easy Install', 'Durable Materials'],
      certification: 'WATER CONSERVATION',
      origin: 'Karnataka, India'
    },
    {
      id: '6',
      name: 'Cow Dung Manure - Aged Organic',
      category: 'fertilizers',
      price: 8,
      rating: 4.6,
      reviews: 145,
      image: '/images/products/cow-dung-manure.jpg',
      description: 'Aged cow dung manure rich in nitrogen, phosphorus, and potassium. Essential for organic farming.',
      inStock: true,
      seller: 'Organic Farms',
      delivery: '2-3 days',
      features: ['Balanced NPK', 'Improves Soil Fertility', 'Natural Microbes', 'Chemical Free'],
      certification: 'INDIA ORGANIC',
      origin: 'Gujarat, India'
    },
    {
      id: '7',
      name: 'Beneficial Insects - Ladybugs Pack',
      category: 'pesticides',
      price: 250,
      rating: 4.8,
      reviews: 92,
      image: '/images/products/ladybugs.jpg',
      description: 'Live beneficial insects for natural pest control. Each pack contains 100 adult ladybugs.',
      inStock: true,
      seller: 'BioControl Plus',
      delivery: '1-2 days',
      features: ['Natural Pest Control', 'Safe for Crops', 'Self-Sustaining', 'No Chemicals'],
      certification: 'BIOLOGICAL CONTROL',
      origin: 'Tamil Nadu, India'
    },
    {
      id: '8',
      name: 'Organic Compost Starter Kit',
      category: 'fertilizers',
      price: 180,
      originalPrice: 220,
      rating: 4.7,
      reviews: 118,
      image: '/images/products/compost-kit.jpg',
      description: 'Complete organic composting kit with beneficial microbes and accelerator for fast composting.',
      inStock: true,
      discount: 18,
      seller: 'Compost Masters',
      delivery: '2-3 days',
      features: ['Fast Composting', 'Odorless', 'Rich Microbes', 'Easy to Use'],
      certification: 'COMPOST CERTIFIED',
      origin: 'Kerala, India'
    }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Most Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Highest Rated' },
    { id: 'newest', name: 'Newest Arrivals' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  }).sort((a, b) => {
    switch (sortBy) {
      case 'price-low': return a.price - b.price;
      case 'price-high': return b.price - a.price;
      case 'rating': return b.rating - a.rating;
      case 'newest': return b.id.localeCompare(a.id);
      default: return b.reviews - a.reviews;
    }
  });

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < Math.floor(rating)
            ? 'text-yellow-500 fill-current'
            : i < rating
            ? 'text-yellow-500'
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const addToCart = (productId: string) => {
    setCartItems(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity === 0) {
      const newCart = { ...cartItems };
      delete newCart[productId];
      setCartItems(newCart);
    } else {
      setCartItems(prev => ({
        ...prev,
        [productId]: quantity
      }));
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalCartPrice = () => {
    return Object.entries(cartItems).reduce((sum, [productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
          <Package className="w-16 h-16 text-green-600" />
        </div>
        
        {product.discount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold">
            -{product.discount}%
          </div>
        )}
        
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-2 right-2 w-8 h-8 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
        </button>
        
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">Out of Stock</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
          <h3 className="font-semibold text-gray-900 line-clamp-2">{product.name}</h3>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
          </div>
          <span className="text-sm text-gray-600">({product.reviews})</span>
        </div>
        
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-green-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Truck className="w-3 h-3" />
              <span>{product.delivery}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          {cartItems[product.id] ? (
            <div className="flex items-center space-x-2 flex-1">
              <button
                onClick={() => updateCartQuantity(product.id, cartItems[product.id] - 1)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-semibold text-gray-900 w-8 text-center">{cartItems[product.id]}</span>
              <button
                onClick={() => updateCartQuantity(product.id, cartItems[product.id] + 1)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => addToCart(product.id)}
              disabled={!product.inStock}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <ShoppingCart className="w-4 h-4" />
              <span>Add to Cart</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderProductList = (product: Product) => (
    <div key={product.id} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-4">
      <div className="flex space-x-4">
        <div className="w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Package className="w-12 h-12 text-green-600" />
        </div>
        
        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">{product.category}</span>
              <h3 className="font-semibold text-gray-900">{product.name}</h3>
            </div>
            <button
              onClick={() => toggleWishlist(product.id)}
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
            >
              <Heart className={`w-4 h-4 ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-600'}`} />
            </button>
          </div>
          
          <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center space-x-4 mb-3">
            <div className="flex items-center space-x-1">
              {renderStars(product.rating)}
              <span className="text-sm text-gray-600">({product.reviews})</span>
            </div>
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <Truck className="w-3 h-3" />
              <span>{product.delivery}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-bold text-green-600">₹{product.price}</span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">₹{product.originalPrice}</span>
              )}
            </div>
            
            {cartItems[product.id] ? (
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => updateCartQuantity(product.id, cartItems[product.id] - 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-semibold text-gray-900 w-8 text-center">{cartItems[product.id]}</span>
                <button
                  onClick={() => updateCartQuantity(product.id, cartItems[product.id] + 1)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center hover:bg-gray-200 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product.id)}
                disabled={!product.inStock}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <Package className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Agricultural Marketplace</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <button 
                  onClick={getTotalCartItems() > 0 ? processPayment : undefined}
                  disabled={getTotalCartItems() === 0 || isProcessingPayment}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    getTotalCartItems() === 0 
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                      : isProcessingPayment 
                      ? 'bg-yellow-500 text-white animate-pulse' 
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>{isProcessingPayment ? 'Processing...' : `Cart (${getTotalCartItems()})`}</span>
                  {!isProcessingPayment && <span className="text-sm">₹{getTotalCartPrice()}</span>}
                </button>
                {getTotalCartItems() > 0 && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">{getTotalCartItems()}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Categories */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-100 text-green-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{category.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">₹{priceRange[0]}</span>
                  <span className="text-sm text-gray-600">₹{priceRange[1]}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="2000"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Search and Filters */}
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                
                <div className="flex items-center space-x-2">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {sortOptions.map(option => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                  
                  <div className="flex bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <Grid className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : ''}`}
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="mb-4 flex items-center justify-between">
              <p className="text-gray-600">
                Showing {filteredProducts.length} of {products.length} products
              </p>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(renderProductCard)}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(renderProductList)}
              </div>
            )}

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernMarketplace;

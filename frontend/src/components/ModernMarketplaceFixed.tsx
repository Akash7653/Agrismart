import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, Search, Filter, Star, Heart, Truck, Shield,
  TrendingUp, Package, DollarSign, Clock, ChevronRight, Grid,
  List, ArrowUpDown, X, Plus, Minus, CheckCircle, AlertCircle,
  CreditCard, Eye
} from 'lucide-react';
import { useTranslation } from '../utils/translations';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';

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

const ModernMarketplaceFixed: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation(currentLanguage);
  const { isDark } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sortBy, setSortBy] = useState('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [cartItems, setCartItems] = useState<{[key: string]: number}>({});
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from API
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://agrismart-7zyv.onrender.com/api/marketplace/products?limit=50');
      const data = await response.json();
      
      if (data.success) {
        const formattedProducts = data.data.map((product: any) => ({
          id: product._id,
          name: product.name,
          category: product.category,
          price: product.price,
          rating: product.rating || 4.5,
          reviews: product.reviews || 50,
          image: product.image,
          description: product.description,
          inStock: product.inStock,
          seller: 'AgriSmart Farmers',
          delivery: '2-3 days',
          features: ['Quality', 'Fresh', 'Certified'],
          certification: 'Organic Certified'
        }));
        setProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      // Fallback to dummy products
      const dummyProducts: Product[] = [
        {
          id: '1',
          name: 'Organic Wheat Seeds',
          category: 'seeds',
          price: 299,
          rating: 4.5,
          reviews: 128,
          image: '/images/products/organic-wheat-seeds.svg',
          description: 'High-quality organic wheat seeds perfect for sustainable farming',
          inStock: true,
          discount: 10,
          seller: 'AgriSmart Seeds',
          delivery: '2-3 days',
          features: ['Non-GMO', 'High Yield', 'Disease Resistant', 'Organic Certified'],
          certification: 'USDA Organic',
          origin: 'India'
        },
        {
          id: '2',
          name: 'Premium Vermicompost',
          category: 'fertilizers',
          price: 450,
          rating: 4.8,
          reviews: 256,
          image: '/images/products/vermicompost.svg',
          description: 'Nutrient-rich vermicompost for healthy soil and plants',
          inStock: true,
          seller: 'Green Earth Organics',
          delivery: '1-2 days',
          features: ['100% Organic', 'Nutrient Rich', 'Improves Soil Health', 'Fast Acting'],
          certification: 'Organic Certified'
        },
        {
          id: '3',
          name: 'Natural Neem Oil',
          category: 'pesticides',
          price: 189,
          rating: 4.3,
          reviews: 89,
          image: '/images/products/neem-oil.svg',
          description: 'Natural neem oil pesticide for organic pest control',
          inStock: true,
          discount: 15,
          seller: 'BioCare Solutions',
          delivery: '3-4 days',
          features: ['100% Natural', 'Broad Spectrum', 'Safe for Beneficial Insects', 'Eco-Friendly'],
          certification: 'OMRI Listed'
        },
        {
          id: '4',
          name: 'Drip Irrigation Kit',
          category: 'tools',
          price: 1299,
          rating: 4.7,
          reviews: 342,
          image: '/images/products/drip-irrigation.svg',
          description: 'Complete drip irrigation system for water-efficient farming',
          inStock: true,
          seller: 'Irrigation Pro',
          delivery: '4-5 days',
          features: ['Water Efficient', 'Easy Installation', 'Durable Materials', 'Complete Kit'],
          certification: 'ISO Certified'
        },
        {
          id: '5',
          name: 'Tomato Hybrid Seeds',
          category: 'seeds',
          price: 159,
          rating: 4.6,
          reviews: 178,
          image: '/images/products/tomato-seeds.svg',
          description: 'High-yield hybrid tomato seeds for commercial cultivation',
          inStock: true,
          discount: 5,
          seller: 'Hybrid Seeds Co.',
          delivery: '2-3 days',
          features: ['High Yield', 'Disease Resistant', 'Long Shelf Life', 'Hybrid Variety'],
          certification: 'Quality Tested'
        },
        {
          id: '6',
          name: 'Bio Fungicide',
          category: 'pesticides',
          price: 275,
          rating: 4.4,
          reviews: 145,
          image: '/images/products/bio-fungicide.svg',
          description: 'Biological fungicide for effective disease control',
          inStock: true,
          seller: 'BioProtect',
          delivery: '2-3 days',
          features: ['Biological Control', 'Safe for Environment', 'Broad Spectrum', 'Non-Toxic'],
          certification: 'Eco Certified'
        },
        {
          id: '7',
          name: 'Organic Fertilizer Mix',
          category: 'fertilizers',
          price: 389,
          rating: 4.5,
          reviews: 201,
          image: '/images/products/fertilizer-bag.svg',
          description: 'Balanced NPK organic fertilizer mix for all crops',
          inStock: true,
          seller: 'NutriGrow Organics',
          delivery: '2-3 days',
          features: ['Balanced NPK', 'Slow Release', 'Soil Builder', 'All-Purpose'],
          certification: 'Organic Certified'
        },
        {
          id: '8',
          name: 'Garden Tool Set',
          category: 'tools',
          price: 899,
          rating: 4.6,
          reviews: 167,
          image: '/images/products/farm-tools.svg',
          description: 'Professional garden tool set for modern farming',
          inStock: true,
          discount: 20,
          seller: 'FarmTools Pro',
          delivery: '3-4 days',
          features: ['Ergonomic Design', 'Rust Resistant', 'Complete Set', 'Professional Grade'],
          certification: 'Quality Assured'
        },
        {
          id: '9',
          name: 'Organic Vegetable Seeds Pack',
          category: 'seeds',
          price: 199,
          rating: 4.7,
          reviews: 289,
          image: '/images/products/seeds-pack.svg',
          description: 'Assorted organic vegetable seeds for home gardening',
          inStock: true,
          discount: 25,
          seller: 'Organic Seeds Co.',
          delivery: '2-3 days',
          features: ['Heirloom Varieties', 'High Germination', 'Non-GMO', 'Organic Certified'],
          certification: 'USDA Organic'
        },
        {
          id: '10',
          name: 'Natural Pesticide Spray',
          category: 'pesticides',
          price: 159,
          rating: 4.4,
          reviews: 156,
          image: '/images/products/pesticide-spray.svg',
          description: 'Natural pesticide spray for home garden use',
          inStock: true,
          seller: 'EcoGarden Solutions',
          delivery: '3-4 days',
          features: ['Ready to Use', 'Child Safe', 'Pet Safe', 'Eco-Friendly'],
          certification: 'EPA Registered'
        },
        {
          id: '11',
          name: 'Smart Watering System',
          category: 'tools',
          price: 2499,
          rating: 4.8,
          reviews: 342,
          image: '/images/products/watering-system.svg',
          description: 'Automated smart watering system with app control',
          inStock: true,
          discount: 15,
          seller: 'SmartFarm Tech',
          delivery: '5-7 days',
          features: ['App Controlled', 'Weather Adaptive', 'Water Saving', 'Easy Installation'],
          certification: 'IoT Certified'
        },
        {
          id: '12',
          name: 'Premium Farm Equipment Set',
          category: 'tools',
          price: 3499,
          rating: 4.9,
          reviews: 189,
          image: '/images/products/farming-equipment.svg',
          description: 'Complete farm equipment set for modern agriculture',
          inStock: true,
          seller: 'ProFarm Equipment',
          delivery: '7-10 days',
          features: ['Heavy Duty', 'Rust Proof', 'Multi-Purpose', 'Warranty Included'],
          certification: 'ISO 9001'
        },
        {
          id: '13',
          name: 'Plant Growth Booster',
          category: 'fertilizers',
          price: 299,
          rating: 4.6,
          reviews: 267,
          image: '/images/products/growth-boost.svg',
          description: 'Advanced plant growth booster for faster development',
          inStock: true,
          discount: 10,
          seller: 'BioGrow Solutions',
          delivery: '2-3 days',
          features: ['Fast Acting', 'Organic Formula', 'Safe for All Plants', 'High Yield'],
          certification: 'Organic Certified'
        },
        {
          id: '14',
          name: 'Hybrid Corn Seeds',
          category: 'seeds',
          price: 249,
          rating: 4.7,
          reviews: 198,
          image: '/images/products/seeds-pack.svg',
          description: 'High-yield hybrid corn seeds for commercial farming',
          inStock: true,
          seller: 'Hybrid Seeds Pro',
          delivery: '2-3 days',
          features: ['High Yield', 'Disease Resistant', 'Drought Tolerant', 'Premium Quality'],
          certification: 'Quality Tested'
        },
        {
          id: '15',
          name: 'Organic Compost Mix',
          category: 'fertilizers',
          price: 179,
          rating: 4.5,
          reviews: 145,
          image: '/images/products/vermicompost.svg',
          description: 'Premium organic compost mix enriched with nutrients',
          inStock: true,
          seller: 'Nature\'s Best',
          delivery: '1-2 days',
          features: ['Nutrient Rich', 'Improves Soil', '100% Organic', 'Fast Acting'],
          certification: 'USDA Organic'
        }
      ];
      setProducts(dummyProducts);
    } finally {
      setLoading(false);
    }
  };

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
      const response = await fetch('https://agrismart-7zyv.onrender.com/api/payments/create-order', {
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
        // Always use Razorpay for real payment orders
        const Razorpay = (window as any).Razorpay;
        if (!Razorpay) {
          alert('Payment system is unavailable. Please try again later.');
          setIsProcessingPayment(false);
          return;
        }
        
        const razorpay = new Razorpay({
          key: orderData.data.key,
          amount: orderData.data.amount,
          currency: orderData.data.currency,
          name: 'AgriSmart',
          description: 'Purchase of natural farming products',
          order_id: orderData.data.order_id,
          handler: async function (response: any) {
            // Verify payment on backend
            const verifyResponse = await fetch('https://agrismart-7zyv.onrender.com/api/payments/verify', {
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
              setIsCartOpen(false);
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
        
        try {
          razorpay.open();
        } catch (razorpayError) {
          console.error('Razorpay error:', razorpayError);
          alert('Payment system error. Please try again.');
          setIsProcessingPayment(false);
        }
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
    { id: 'Grains', name: 'Grains', icon: Package },
    { id: 'Spices', name: 'Spices', icon: Package },
    { id: 'Natural Products', name: 'Natural Products', icon: Shield },
    { id: 'Organic Inputs', name: 'Organic Inputs', icon: Package },
    { id: 'Textiles', name: 'Textiles', icon: Package }
  ];

  const sortOptions = [
    { id: 'popular', name: 'Popular' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' },
    { id: 'rating', name: 'Top Rated' },
    { id: 'newest', name: 'Newest' }
  ];

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
    return matchesCategory && matchesSearch && matchesPrice;
  });

  const addToCart = (productId: string) => {
    setCartItems(prev => {
      // Prevent double additions  
      const currentQty = prev[productId] || 0;
      return {
        ...prev,
        [productId]: currentQty + 1
      };
    });
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

  const getTotalCartItems = () => {
    return Object.values(cartItems).reduce((sum, qty) => sum + qty, 0);
  };

  const getTotalCartPrice = () => {
    return Object.entries(cartItems).reduce((sum, [productId, qty]) => {
      const product = products.find(p => p.id === productId);
      return sum + (product ? product.price * qty : 0);
    }, 0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

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

  const renderProductCard = (product: Product) => (
    <div key={product.id} className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-2xl dark:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden group border border-gray-100 dark:border-gray-800 hover:border-green-300 dark:hover:border-green-700 transform hover:scale-105 hover:-translate-y-2 animate-fadeInScale">
      <div className="relative bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 h-48 overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300 brightness-100 group-hover:brightness-110"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2216%22 fill=%22%23999%22%3EProduct Image%3C/text%3E%3C/svg%3E';
          }}
        />
        {product.discount && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-orange-500 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}
        <button
          onClick={() => toggleWishlist(product.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all duration-300 shadow-lg hover:scale-110 transform"
        >
          <Heart className={`w-5 h-5 transition-colors ${wishlist.includes(product.id) ? 'text-red-500 fill-current' : 'text-gray-400 dark:text-gray-500'}`} />
        </button>
      </div>
      
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-1 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">{product.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
          </div>
          <div className="text-right whitespace-nowrap ml-2">
            {product.originalPrice && (
              <span className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{product.originalPrice}</span>
            )}
            <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">₹{product.price}</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-1">
            {renderStars(product.rating)}
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">({product.reviews})</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-1 rounded-full">
            <Truck className="w-3 h-3" />
            <span>{product.delivery}</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {product.features.slice(0, 3).map((feature, index) => (
            <span key={index} className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/40 dark:to-emerald-900/40 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold shadow-sm">
              {feature}
            </span>
          ))}
        </div>
        
        <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
            <Shield className="w-4 h-4" />
            <span className="font-medium">{product.seller}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {cartItems[product.id] ? (
              <div className="flex items-center space-x-2 bg-green-50 dark:bg-green-900/20 rounded-lg p-1">
                <button
                  onClick={() => updateCartQuantity(product.id, cartItems[product.id] - 1)}
                  className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-900/60 transition-all duration-200 text-green-700 dark:text-green-400 hover:scale-110 transform"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="font-bold text-green-700 dark:text-green-400 w-6 text-center">{cartItems[product.id]}</span>
                <button
                  onClick={() => updateCartQuantity(product.id, cartItems[product.id] + 1)}
                  className="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-full flex items-center justify-center hover:bg-green-200 dark:hover:bg-green-900/60 transition-all duration-200 text-green-700 dark:text-green-400 hover:scale-110 transform"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => addToCart(product.id)}
                disabled={!product.inStock}
                className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 dark:from-green-600 dark:to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95 font-semibold"
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

  const renderProductList = (product: Product) => (
    <div key={product.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl dark:shadow-xl dark:hover:shadow-2xl transition-all duration-300 p-4">
      <div className="flex space-x-4">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            img.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Crect fill=%22%23f0f0f0%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22Arial%22 font-size=%2212%22 fill=%22%23999%22%3EImage%3C/text%3E%3C/svg%3E';
          }}
        />
        
        <div className="flex-1 space-y-3">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
            </div>
            <div className="text-right">
              {product.originalPrice && (
                <span className="text-sm text-gray-500 dark:text-gray-400 line-through">₹{product.originalPrice}</span>
              )}
              <div className="text-lg font-bold text-green-600 dark:text-green-400">₹{product.price}</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                {renderStars(product.rating)}
                <span className="ml-1">({product.reviews})</span>
              </div>
              <div className="flex items-center space-x-1">
                <Truck className="w-4 h-4" />
                <span>{product.delivery}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {cartItems[product.id] ? (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateCartQuantity(product.id, cartItems[product.id] - 1)}
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors dark:text-gray-300"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="font-semibold text-gray-900 dark:text-white w-8 text-center">{cartItems[product.id]}</span>
                  <button
                    onClick={() => updateCartQuantity(product.id, cartItems[product.id] + 1)}
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors dark:text-gray-300"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => addToCart(product.id)}
                  disabled={!product.inStock}
                  className="px-4 py-2 bg-green-600 dark:bg-green-700 text-white rounded-lg hover:bg-green-700 dark:hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCartModal = () => {
    const cartProducts = products.filter(product => cartItems[product.id] > 0);
    
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="flex min-h-screen items-end justify-center sm:items-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsCartOpen(false)} />
          
          <div className="relative w-full max-w-md bg-white dark:bg-gray-900 rounded-t-2xl sm:rounded-2xl shadow-2xl max-h-[80vh] overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b dark:border-gray-700">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Shopping Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartProducts.length === 0 ? (
                <div className="text-center py-8">
                  <ShoppingCart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {cartProducts.map(product => {
                    const quantity = cartItems[product.id];
                    return (
                      <div key={product.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{product.name}</h4>
                              <button
                                onClick={() => updateCartQuantity(product.id, 0)}
                                className="p-1 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => updateCartQuantity(product.id, quantity - 1)}
                                  className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors dark:text-gray-300"
                                >
                                  <Minus className="w-3 h-3" />
                                </button>
                                <span className="font-semibold text-gray-900 dark:text-white w-6 text-center text-sm">{quantity}</span>
                                <button
                                  onClick={() => updateCartQuantity(product.id, quantity + 1)}
                                  className="w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors dark:text-gray-300"
                                >
                                  <Plus className="w-3 h-3" />
                                </button>
                              </div>
                              
                              <span className="font-bold text-green-600 text-sm">₹{product.price * quantity}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cartProducts.length > 0 && (
              <div className="border-t p-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-lg font-semibold text-gray-900">Total:</span>
                  <span className="text-2xl font-bold text-green-600">₹{getTotalCartPrice()}</span>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Continue Shopping
                  </button>
                  <button
                    onClick={processPayment}
                    disabled={isProcessingPayment}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isProcessingPayment ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin rounded-full" />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <CreditCard className="w-4 h-4" />
                        <span>Proceed to Payment</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderProductQuickView = () => {
    if (!selectedProduct) return null;
    
    return (
      <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-bold text-gray-900">{selectedProduct.name}</h2>
              <button
                onClick={() => setSelectedProduct(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            {/* Product Details */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img 
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    className="w-full rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                    <p className="text-gray-600">{selectedProduct.description}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.features.map((feature, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {renderStars(selectedProduct.rating)}
                      <span className="text-sm text-gray-600 ml-1">({selectedProduct.reviews} reviews)</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <Shield className="w-4 h-4" />
                      <span>{selectedProduct.seller}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Truck className="w-4 h-4" />
                      <span>{selectedProduct.delivery}</span>
                    </div>
                  </div>
                  
                  {selectedProduct.certification && (
                    <div className="mt-4 p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-semibold text-green-700">{selectedProduct.certification}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="border-t p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  {selectedProduct.originalPrice && (
                    <span className="text-sm text-gray-500 line-through">₹{selectedProduct.originalPrice}</span>
                  )}
                  <div className="text-2xl font-bold text-green-600">₹{selectedProduct.price}</div>
                </div>
                
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => {
                      addToCart(selectedProduct.id);
                      setSelectedProduct(null);
                    }}
                    disabled={!selectedProduct.inStock}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-white dark:bg-gray-950 text-gray-900 dark:text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-gray-900 dark:to-gray-800 border-b border-green-100 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <ShoppingCart className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Natural Marketplace</h1>
            </div>
            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">Premium organic and natural farming products</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64 space-y-6">
            {/* Categories */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map(category => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                        selectedCategory === category.id
                          ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Price Range</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">₹{priceRange[0]}</span>
                  <span className="text-sm text-gray-600 dark:text-gray-400">₹{priceRange[1]}</span>
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
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                    {renderProductCard(product)}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredProducts.map(product => (
                  <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                    {renderProductList(product)}
                  </div>
                ))}
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

      {/* Floating Cart Button */}
      <button
        onClick={() => setIsCartOpen(true)}
        className="fixed bottom-6 right-6 bg-green-600 text-white p-4 rounded-full shadow-lg hover:bg-green-700 transition-colors z-40"
      >
        <ShoppingCart className="w-6 h-6" />
        {getTotalCartItems() > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
            {getTotalCartItems()}
          </span>
        )}
      </button>

      {/* Cart Modal */}
      {isCartOpen && renderCartModal()}
      
      {/* Product Quick View Modal */}
      {selectedProduct && renderProductQuickView()}
    </div>
  );
};

export default ModernMarketplaceFixed;

const animationStyles = `
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeInScale {
    from { opacity: 0; transform: scale(0.95); }
    to { opacity: 1; transform: scale(1); }
  }
  .animate-slideUp { animation: slideUp 0.6s ease-out forwards; }
  .animate-fadeInScale { animation: fadeInScale 0.5s ease-out forwards; }
`;

import React, { useState, useEffect } from 'react';
import { 
  BookOpen, FileText, Download, Video, ExternalLink, 
  Calendar, Users, Award, TrendingUp, Clock,
  MapPin, Phone, Mail, ChevronRight, Search,
  Filter, Grid, List
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useThemeColors } from '../hooks/useThemeColors';

interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'guide' | 'video' | 'tool' | 'event' | 'service';
  category: string;
  imageUrl?: string;
  downloadUrl?: string;
  externalUrl?: string;
  date?: string;
  duration?: string;
  attendees?: number;
  rating?: number;
  tags: string[];
  featured?: boolean;
}

const FarmResources: React.FC = () => {
  const { currentLanguage } = useLanguage();
  const { t } = useTranslation();
  const { isDark } = useTheme();
  const colors = useThemeColors();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const categories = [
    { id: 'all', name: 'All Resources', icon: BookOpen },
    { id: 'guides', name: 'Farming Guides', icon: FileText },
    { id: 'videos', name: 'Video Tutorials', icon: Video },
    { id: 'tools', name: 'Farming Tools', icon: Download },
    { id: 'events', name: 'Workshops & Events', icon: Calendar },
    { id: 'services', name: 'Support Services', icon: Users }
  ];

  const resources: Resource[] = [
    {
      id: '1',
      title: 'Complete Guide to Organic Farming',
      description: 'Comprehensive guide covering all aspects of organic farming from soil preparation to harvest.',
      type: 'guide',
      category: 'guides',
      imageUrl: '/images/resources/organic-farming-guide.jpg',
      downloadUrl: '/downloads/organic-farming-guide.pdf',
      tags: ['organic', 'beginner', 'comprehensive'],
      featured: true,
      rating: 4.8
    },
    {
      id: '2',
      title: 'Natural Pest Control Methods',
      description: 'Learn effective natural pest control techniques without using harmful chemicals.',
      type: 'guide',
      category: 'guides',
      imageUrl: '/images/resources/pest-control-guide.jpg',
      downloadUrl: '/downloads/natural-pest-control.pdf',
      tags: ['pest-control', 'natural', 'chemical-free'],
      rating: 4.6
    },
    {
      id: '3',
      title: 'Composting for Beginners',
      description: 'Step-by-step video tutorial on how to start composting at your farm.',
      type: 'video',
      category: 'videos',
      imageUrl: '/images/resources/composting-video.jpg',
      externalUrl: 'https://youtube.com/watch?v=example',
      duration: '25:30',
      tags: ['composting', 'video', 'beginner'],
      featured: true,
      rating: 4.9
    },
    {
      id: '4',
      title: 'Soil Health Testing Tool',
      description: 'Free online tool to analyze your soil health and get recommendations.',
      type: 'tool',
      category: 'tools',
      imageUrl: '/images/resources/soil-testing-tool.jpg',
      externalUrl: '/tools/soil-tester',
      tags: ['soil', 'testing', 'free', 'tool'],
      rating: 4.7
    },
    {
      id: '5',
      title: 'Organic Farming Workshop',
      description: 'Join our upcoming workshop on advanced organic farming techniques.',
      type: 'event',
      category: 'events',
      date: '2024-03-15',
      imageUrl: '/images/resources/workshop.jpg',
      attendees: 45,
      tags: ['workshop', 'in-person', 'advanced'],
      featured: true,
      rating: 5.0
    },
    {
      id: '6',
      title: 'Crop Rotation Planning Template',
      description: 'Downloadable Excel template for planning your crop rotation schedule.',
      type: 'tool',
      category: 'tools',
      imageUrl: '/images/resources/crop-rotation-template.jpg',
      downloadUrl: '/downloads/crop-rotation-template.xlsx',
      tags: ['crop-rotation', 'planning', 'template', 'excel'],
      rating: 4.5
    },
    {
      id: '7',
      title: 'Natural Fertilizer Calculator',
      description: 'Calculate the right amount of natural fertilizers for your crops.',
      type: 'tool',
      category: 'tools',
      imageUrl: '/images/resources/fertilizer-calculator.jpg',
      externalUrl: '/tools/fertilizer-calculator',
      tags: ['fertilizer', 'calculator', 'natural'],
      rating: 4.8
    },
    {
      id: '8',
      title: 'Drip Irrigation Installation Guide',
      description: 'Complete guide to installing and maintaining drip irrigation systems.',
      type: 'guide',
      category: 'guides',
      imageUrl: '/images/resources/drip-irrigation-guide.jpg',
      downloadUrl: '/downloads/drip-irrigation-guide.pdf',
      tags: ['irrigation', 'installation', 'water-saving'],
      rating: 4.6
    }
  ];

  const filteredResources = resources.filter(resource => {
    const matchesCategory = selectedCategory === 'all' || resource.category === selectedCategory;
    const matchesSearch = resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         resource.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'guide': return FileText;
      case 'video': return Video;
      case 'tool': return Download;
      case 'event': return Calendar;
      case 'service': return Users;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'guide': return 'blue';
      case 'video': return 'red';
      case 'tool': return 'green';
      case 'event': return 'purple';
      case 'service': return 'orange';
      default: return 'gray';
    }
  };

  const renderResourceCard = (resource: Resource) => {
    const Icon = getTypeIcon(resource.type);
    const color = getTypeColor(resource.type);

    return (
      <div key={resource.id} className={`rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group ${colors.bg.card} border ${colors.border.primary}`}>
        <div className={`relative h-48 bg-gradient-to-br flex items-center justify-center overflow-hidden ${
          isDark
            ? 'from-gray-700 to-gray-600'
            : 'from-green-100 to-emerald-100'
        }`}>
          <Icon className={`w-12 h-12 text-${color}-600 group-hover:scale-125 transition-transform duration-300`} />
          {resource.featured && (
            <div className="absolute top-4 left-4 bg-yellow-400 text-white text-xs px-3 py-1 rounded-full font-bold shadow-md">
              ⭐ Featured
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className={`text-lg font-bold line-clamp-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h3>
            <div className="flex items-center space-x-2">
              {resource.rating && (
                <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded-lg">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className={`text-xs font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>{resource.rating}</span>
                </div>
              )}
            </div>
          </div>
          
          <p className={`mb-4 line-clamp-2 text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{resource.description}</p>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {resource.tags.slice(0, 2).map((tag, index) => (
              <span key={index} className={`px-2 py-1 text-xs rounded-full font-medium ${
                isDark
                  ? 'bg-gray-700 text-gray-300'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
              {resource.date && (
                <span>{new Date(resource.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              )}
              {resource.duration && (
                <span className="ml-2">⏱️ {resource.duration}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {resource.downloadUrl && (
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-sm shadow-md">
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
            {resource.externalUrl && (
              <button className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-sm shadow-md">
                <ExternalLink className="w-4 h-4" />
                Access
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${colors.bg.primary}`}>
      {/* Header */}
      <div className={`backdrop-blur-sm border-b transition-colors ${colors.bg.secondary} border-${colors.border.primary}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <h1 className={`text-3xl font-bold ${colors.text.primary}`}>{t('farmResources')}</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
                <input
                  type="text"
                  placeholder="Search resources..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent w-64 ${
                    isDark
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400'
                      : 'border-gray-300 text-gray-900'
                  }`}
                />
              </div>
              
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-white shadow-sm' : 'text-gray-600 hover:text-gray-900'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map(category => {
            const Icon = category.icon;
            return (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full font-semibold transition-all duration-200 transform hover:scale-105 ${
                  selectedCategory === category.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : isDark
                    ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100 shadow-md'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{category.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Resources Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="mb-6">
          <p className={`text-sm font-medium ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Showing {filteredResources.length} of {resources.length} resources
          </p>
        </div>
        
        {viewMode === 'grid' ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map(resource => renderResourceCard(resource))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredResources.map(resource => {
              const Icon = getTypeIcon(resource.type);
              const color = getTypeColor(resource.type);
              return (
                <div key={resource.id} className={`rounded-2xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 p-6 ${
                  isDark ? 'bg-gray-800 border border-gray-700' : 'bg-white'
                }`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-16 h-16 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                      isDark
                        ? 'bg-gradient-to-br from-gray-700 to-gray-600'
                        : 'bg-gradient-to-br from-green-100 to-emerald-100'
                    }`}>
                      <Icon className={`w-8 h-8 text-${color}-600`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>{resource.title}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            {resource.rating && (
                              <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-lg">
                                <span className="text-yellow-500">★</span>
                                <span className={`text-xs font-semibold ${isDark ? 'text-yellow-400' : 'text-yellow-700'}`}>{resource.rating}</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {resource.downloadUrl && (
                            <button className="flex items-center gap-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-xs shadow-md">
                              <Download className="w-4 h-4" />
                              Download
                            </button>
                          )}
                          {resource.externalUrl && (
                            <button className="flex items-center gap-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all duration-200 transform hover:scale-105 font-semibold text-xs shadow-md">
                              <ExternalLink className="w-4 h-4" />
                              Access
                            </button>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm mb-3 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{resource.description}</p>
                      <div className="flex items-center gap-4 text-xs">
                        {resource.date && (
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>📅 {new Date(resource.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                        )}
                        {resource.duration && (
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>⏱️ {resource.duration}</span>
                        )}
                        {resource.attendees && (
                          <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>👥 {resource.attendees} attending</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        
        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
              isDark ? 'bg-gray-700' : 'bg-gray-100'
            }`}>
              <Search className={`w-10 h-10 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>No resources found</h3>
            <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FarmResources;

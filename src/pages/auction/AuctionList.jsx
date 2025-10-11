import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auctionService } from '../../api/auctionService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';
import { FaPlus, FaGavel, FaClock, FaUser, FaFire, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadAuctions();
  }, [filter]);

  const loadAuctions = async () => {
    setIsLoading(true);
    try {
      const params = {};
      
      if (filter === 'my') {
        params.is_me = 1;
      } else if (filter === 'open') {
        params.is_closed = 1;
      } else if (filter === 'closed') {
        params.is_closed = 0;
      }

      const response = await auctionService.getAll(params);
      setAuctions(response.data.aucations);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Gagal memuat data lelang');
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return format(new Date(dateString), 'dd MMM yyyy, HH:mm', {
      locale: idLocale,
    });
  };

  const isAuctionClosed = (closedAt) => {
    return new Date(closedAt) < new Date();
  };

  const getHighestBid = (auction) => {
    if (!auction.bids || auction.bids.length === 0) return 0;
    return Math.max(...auction.bids.map((b) => b.bid));
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[60vh]">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600 font-medium">Memuat data lelang...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-600 to-accent-600 rounded-2xl p-8 mb-8 text-white shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <FaGavel className="text-5xl" />
              Lelang Online
            </h1>
            <p className="text-primary-100 text-lg">
              Temukan barang impian Anda dengan harga terbaik
            </p>
          </div>
          <Link
            to="/auction/create"
            className="bg-white text-primary-600 px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
          >
            <FaPlus />
            Buat Lelang Baru
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-8">
        <div className="bg-white rounded-xl shadow-md p-2 inline-flex gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'all'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Semua Lelang
          </button>
          <button
            onClick={() => setFilter('my')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'my'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Lelang Saya
          </button>
          <button
            onClick={() => setFilter('open')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'open'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Dibuka
          </button>
          <button
            onClick={() => setFilter('closed')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              filter === 'closed'
                ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-md'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Ditutup
          </button>
        </div>
      </div>

      {/* Auction Grid */}
      {auctions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction) => {
            const highestBid = getHighestBid(auction);
            const isClosed = isAuctionClosed(auction.closed_at);
            
            return (
              <Link
                key={auction.id}
                to={`/auction/${auction.id}`}
                className="group"
              >
                <div className="bg-white rounded-2xl shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden card-hover">
                  {/* Image */}
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={auction.cover}
                      alt={auction.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    
                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      {isClosed ? (
                        <span className="bg-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                          <FaTimesCircle />
                          Ditutup
                        </span>
                      ) : (
                        <span className="bg-green-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg animate-pulse">
                          <FaCheckCircle />
                          Dibuka
                        </span>
                      )}
                    </div>

                    {/* Hot Badge if has bids */}
                    {auction.bids && auction.bids.length > 0 && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1.5 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg">
                          <FaFire className="animate-bounce" />
                          Hot
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <h3 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {auction.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2 text-sm">
                      {auction.description}
                    </p>

                    {/* Price Info */}
                    <div className="space-y-3 mb-4">
                      <div className="bg-gradient-to-r from-primary-50 to-accent-50 p-3 rounded-xl">
                        <p className="text-xs text-gray-600 mb-1">Harga Awal</p>
                        <p className="text-lg font-bold text-primary-600">
                          {formatCurrency(auction.start_bid)}
                        </p>
                      </div>

                      {highestBid > 0 && (
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-3 rounded-xl">
                          <p className="text-xs text-gray-600 mb-1 flex items-center gap-1">
                            <FaGavel className="text-green-600" />
                            Penawaran Tertinggi
                          </p>
                          <p className="text-lg font-bold text-green-600">
                            {formatCurrency(highestBid)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {auction.bids.length} penawaran
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Author & Time */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={auction.author.photo}
                          alt={auction.author.name}
                          className="w-8 h-8 rounded-full ring-2 ring-primary-100"
                        />
                        <div>
                          <p className="text-sm font-semibold text-gray-800">
                            {auction.author.name}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
                      <FaClock />
                      <span>{formatDate(auction.closed_at)}</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="bg-white rounded-2xl p-12 max-w-md mx-auto shadow-lg">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaGavel className="text-5xl text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              Tidak Ada Lelang
            </h3>
            <p className="text-gray-600 mb-6">
              Belum ada lelang yang tersedia saat ini
            </p>
            <Link
              to="/auction/create"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-primary-500 to-accent-500 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
            >
              <FaPlus />
              Buat Lelang Pertama
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionList;
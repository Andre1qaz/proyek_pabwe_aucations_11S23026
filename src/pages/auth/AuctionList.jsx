import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auctionService } from '../../api/auctionService';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, my, open, closed

  useEffect(() => {
    loadAuctions();
  // eslint-disable-next-line react-hooks/exhaustive-deps
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
    return format(new Date(dateString), 'dd MMMM yyyy HH:mm', {
      locale: idLocale,
    });
  };

  const isAuctionClosed = (closedAt) => {
    return new Date(closedAt) < new Date();
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Daftar Lelang</h1>
        <Link
          to="/auction/create"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Buat Lelang
        </Link>
      </div>

      {/* Filter */}
      <div className="mb-6 flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter('my')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'my' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Lelang Saya
        </button>
        <button
          onClick={() => setFilter('open')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'open' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Dibuka
        </button>
        <button
          onClick={() => setFilter('closed')}
          className={`px-4 py-2 rounded-lg ${
            filter === 'closed' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          Ditutup
        </button>
      </div>

      {/* Auction Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {auctions.map((auction) => (
          <Link
            key={auction.id}
            to={`/auction/${auction.id}`}
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
          >
            <img
              src={auction.cover}
              alt={auction.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-xl font-semibold mb-2">{auction.title}</h3>
              <p className="text-gray-600 mb-2 line-clamp-2">
                {auction.description}
              </p>
              
              <div className="mb-2">
                <p className="text-sm text-gray-500">Harga Awal</p>
                <p className="text-lg font-bold text-blue-600">
                  {formatCurrency(auction.start_bid)}
                </p>
              </div>

              {auction.bids && auction.bids.length > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-gray-500">Penawaran Tertinggi</p>
                  <p className="text-lg font-bold text-green-600">
                    {formatCurrency(
                      Math.max(...auction.bids.map((b) => b.bid))
                    )}
                  </p>
                </div>
              )}

              <div className="flex items-center gap-2 mb-2">
                <img
                  src={auction.author.photo}
                  alt={auction.author.name}
                  className="w-6 h-6 rounded-full"
                />
                <p className="text-sm text-gray-600">{auction.author.name}</p>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-500">
                  {formatDate(auction.closed_at)}
                </p>
                <span
                  className={`px-2 py-1 rounded text-xs ${
                    isAuctionClosed(auction.closed_at)
                      ? 'bg-red-100 text-red-600'
                      : 'bg-green-100 text-green-600'
                  }`}
                >
                  {isAuctionClosed(auction.closed_at) ? 'Ditutup' : 'Dibuka'}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {auctions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Tidak ada lelang ditemukan</p>
        </div>
      )}
    </div>
  );
};

export default AuctionList;
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { auctionService } from '../../api/auctionService';
import { useAuthStore } from '../../store/authStore';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

const AuctionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  
  const [auction, setAuction] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAuction();
  }, [id]);

  const loadAuction = async () => {
    setIsLoading(true);
    try {
      const response = await auctionService.getDetail(id);
      setAuction(response.data.aucation);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Gagal memuat detail lelang');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddBid = async (e) => {
    e.preventDefault();
    
    if (!bidAmount || bidAmount <= 0) {
      toast.error('Masukkan jumlah penawaran yang valid');
      return;
    }

    const highestBid = getHighestBid();
    const minBid = highestBid > 0 ? highestBid : auction.start_bid;

    if (parseInt(bidAmount) <= minBid) {
      toast.error(`Penawaran harus lebih dari ${formatCurrency(minBid)}`);
      return;
    }

    setIsSubmitting(true);
    try {
      await auctionService.addBid(id, bidAmount);
      toast.success('Penawaran berhasil ditambahkan');
      setBidAmount('');
      loadAuction();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambahkan penawaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteBid = async () => {
    if (!window.confirm('Yakin ingin menghapus penawaran?')) return;

    try {
      await auctionService.deleteBid(id);
      toast.success('Penawaran berhasil dihapus');
      loadAuction();
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Gagal menghapus penawaran');
    }
  };

  const handleDeleteAuction = async () => {
    if (!window.confirm('Yakin ingin menghapus lelang ini?')) return;

    try {
      await auctionService.delete(id);
      toast.success('Lelang berhasil dihapus');
      navigate('/');
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Gagal menghapus lelang');
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

  const isAuctionClosed = () => {
    return new Date(auction.closed_at) < new Date();
  };

  const isOwner = () => {
    return user?.id === auction?.user_id;
  };

  const getHighestBid = () => {
    if (!auction?.bids || auction.bids.length === 0) return 0;
    return Math.max(...auction.bids.map((b) => b.bid));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!auction) return null;

  const highestBid = getHighestBid();

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Kembali
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Section */}
        <div>
          <img
            src={auction.cover}
            alt={auction.title}
            className="w-full rounded-lg shadow-lg"
          />
        </div>

        {/* Detail Section */}
        <div>
          <div className="flex justify-between items-start mb-4">
            <h1 className="text-3xl font-bold">{auction.title}</h1>
            {isOwner() && (
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/auction/edit/${id}`)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={handleDeleteAuction}
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                  Hapus
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 mb-4">
            <img
              src={auction.author.photo}
              alt={auction.author.name}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-semibold">{auction.author.name}</p>
              <p className="text-sm text-gray-500">Penjual</p>
            </div>
          </div>

          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600 mb-1">Harga Awal</p>
            <p className="text-2xl font-bold text-blue-600">
              {formatCurrency(auction.start_bid)}
            </p>
          </div>

          {highestBid > 0 && (
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <p className="text-sm text-gray-600 mb-1">Penawaran Tertinggi</p>
              <p className="text-2xl font-bold text-green-600">
                {formatCurrency(highestBid)}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                {auction.bids.length} penawaran
              </p>
            </div>
          )}

          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-1">Ditutup pada</p>
            <p className="text-lg font-semibold">{formatDate(auction.closed_at)}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded ${
                isAuctionClosed()
                  ? 'bg-red-100 text-red-600'
                  : 'bg-green-100 text-green-600'
              }`}
            >
              {isAuctionClosed() ? 'Lelang Ditutup' : 'Lelang Dibuka'}
            </span>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {auction.description}
            </p>
          </div>

          {/* Bid Form */}
          {!isOwner() && !isAuctionClosed() && (
            <div className="bg-white border-2 border-blue-500 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-3">Buat Penawaran</h3>
              
              {auction.my_bid ? (
                <div>
                  <div className="bg-blue-50 p-3 rounded mb-3">
                    <p className="text-sm text-gray-600">Penawaran Anda</p>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(auction.my_bid.bid)}
                    </p>
                  </div>
                  <button
                    onClick={handleDeleteBid}
                    className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
                  >
                    Hapus Penawaran
                  </button>
                </div>
              ) : (
                <form onSubmit={handleAddBid}>
                  <input
                    type="number"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                    placeholder={`Min. ${formatCurrency(
                      highestBid > 0 ? highestBid + 1 : auction.start_bid + 1
                    )}`}
                    className="w-full px-4 py-2 border rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={isSubmitting}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
                  >
                    {isSubmitting ? 'Mengirim...' : 'Kirim Penawaran'}
                  </button>
                </form>
              )}
            </div>
          )}

          {isAuctionClosed() && !isOwner() && (
            <div className="bg-gray-100 p-4 rounded-lg text-center">
              <p className="text-gray-600">Lelang telah ditutup</p>
            </div>
          )}
        </div>
      </div>

      {/* Bid History */}
      {auction.bids && auction.bids.length > 0 && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Riwayat Penawaran</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left">Penawaran</th>
                  <th className="px-4 py-3 text-left">Waktu</th>
                </tr>
              </thead>
              <tbody>
                {auction.bids
                  .sort((a, b) => b.bid - a.bid)
                  .map((bid) => (
                    <tr key={bid.id} className="border-t">
                      <td className="px-4 py-3 font-semibold">
                        {formatCurrency(bid.bid)}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {formatDate(bid.created_at)}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuctionDetail;
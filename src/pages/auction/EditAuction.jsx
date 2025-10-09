import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { auctionService } from '../../api/auctionService';
import { toast } from 'react-toastify';

const EditAuction = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_bid: '',
    closed_at: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentCover, setCurrentCover] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadAuction();
  }, [id]);

  const loadAuction = async () => {
    try {
      const response = await auctionService.getDetail(id);
      const auction = response.data.aucation;
      
      // Format datetime untuk input datetime-local
      const closedAt = auction.closed_at.replace(' ', 'T').substring(0, 16);
      
      setFormData({
        title: auction.title,
        description: auction.description,
        start_bid: auction.start_bid,
        closed_at: closedAt,
      });
      setCurrentCover(auction.cover);
    // eslint-disable-next-line no-unused-vars
    } catch (error) {
      toast.error('Gagal memuat data lelang');
      navigate('/');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      // Format tanggal
      const formattedDate = formData.closed_at.replace('T', ' ') + ':00';
      
      // Update data lelang
      await auctionService.update(id, {
        ...formData,
        closed_at: formattedDate,
      });

      // Update cover jika ada file baru
      if (coverFile) {
        await auctionService.changeCover(id, coverFile);
      }

      toast.success('Lelang berhasil diupdate');
      navigate(`/auction/${id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal mengupdate lelang');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={() => navigate(`/auction/${id}`)}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Kembali
      </button>

      <h1 className="text-3xl font-bold mb-6">Edit Lelang</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {/* Cover Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Gambar Cover
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 w-full h-64 object-cover rounded-lg"
            />
          ) : (
            <img
              src={currentCover}
              alt="Current cover"
              className="mt-3 w-full h-64 object-cover rounded-lg"
            />
          )}
          <p className="text-sm text-gray-500 mt-1">
            Biarkan kosong jika tidak ingin mengubah cover
          </p>
        </div>

        {/* Title */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Judul Lelang *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Deskripsi *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Start Bid */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Harga Awal (IDR) *
          </label>
          <input
            type="number"
            name="start_bid"
            value={formData.start_bid}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            required
          />
        </div>

        {/* Closed At */}
        <div className="mb-6">
          <label className="block text-gray-700 font-semibold mb-2">
            Tanggal & Waktu Penutupan *
          </label>
          <input
            type="datetime-local"
            name="closed_at"
            value={formData.closed_at}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/auction/${id}`)}
            className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAuction;
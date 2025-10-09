import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auctionService } from '../../api/auctionService';
import { toast } from 'react-toastify';

const CreateAuction = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_bid: '',
    closed_at: '',
  });
  const [coverFile, setCoverFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!coverFile) {
      toast.error('Pilih gambar cover terlebih dahulu');
      return;
    }

    // Validasi tanggal
    const closedDate = new Date(formData.closed_at);
    const now = new Date();
    
    if (closedDate <= now) {
      toast.error('Tanggal penutupan harus di masa depan');
      return;
    }

    setIsSubmitting(true);
    try {
      // Format tanggal ke format yang diminta API: YYYY-MM-DD HH:mm:ss
      const formattedDate = formData.closed_at.replace('T', ' ') + ':00';
      
      const data = {
        ...formData,
        closed_at: formattedDate,
        cover: coverFile,
      };

      const response = await auctionService.create(data);
      toast.success('Lelang berhasil dibuat');
      navigate(`/auction/${response.data.aucation_id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat lelang');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <button
        onClick={() => navigate('/')}
        className="mb-4 text-blue-500 hover:underline"
      >
        ← Kembali
      </button>

      <h1 className="text-3xl font-bold mb-6">Buat Lelang Baru</h1>

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
        {/* Cover Image */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            Gambar Cover *
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Preview"
              className="mt-3 w-full h-64 object-cover rounded-lg"
            />
          )}
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
            placeholder="Contoh: Keyboard Gaming RGB"
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
            placeholder="Jelaskan kondisi barang, spesifikasi, dll..."
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
            placeholder="Contoh: 200000"
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
          <p className="text-sm text-gray-500 mt-1">
            Pilih kapan lelang akan ditutup
          </p>
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400"
          >
            {isSubmitting ? 'Menyimpan...' : 'Buat Lelang'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-6 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAuction;
import React, { useState } from 'react';
import { Head, Link, usePage, router } from '@inertiajs/react';
import AuthenticatedUserLayout from '@/Layouts/AuthenticatedUserLayout';

// Upload Payment Proof Form Component
function UploadPaymentProofForm({ transactionId }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const droppedFile = e.dataTransfer.files[0];
            setFile(droppedFile);
            setPreview(URL.createObjectURL(droppedFile));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('payment_proof', file);

        router.post(route('orders.upload-payment-proof', transactionId), formData, {
            onSuccess: () => {
                setUploading(false);
            },
            onError: () => {
                setUploading(false);
            },
            forceFormData: true,
        });
    };

    return (
        <div>
            <p className="text-xs text-gray-600 mb-3">
                Silakan upload bukti transfer Anda untuk mempercepat proses verifikasi pembayaran
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-3">
                <div 
                    className={`relative border-2 border-dashed rounded-lg p-6 transition-all duration-200 ${
                        dragActive 
                            ? 'border-indigo-500 bg-indigo-50/50' 
                            : 'border-gray-300 hover:border-indigo-400'
                    }`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                >
                    <input
                        type="file"
                        id="payment_proof"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    
                    {preview ? (
                        <div className="space-y-3">
                            <img 
                                src={preview} 
                                alt="Preview" 
                                className="w-full max-w-sm mx-auto rounded-lg border-2 border-gray-200"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setFile(null);
                                    setPreview(null);
                                }}
                                className="text-xs text-red-600 hover:text-red-700 font-medium"
                            >
                                Hapus gambar
                            </button>
                        </div>
                    ) : (
                        <div className="text-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p className="mt-2 text-sm text-gray-600">
                                <span className="font-semibold text-indigo-600">Klik untuk pilih file</span> atau drag & drop
                            </p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF hingga 2MB</p>
                        </div>
                    )}
                </div>

                {file && (
                    <button
                        type="submit"
                        disabled={uploading}
                        className={`w-full px-4 py-2.5 rounded-lg font-medium text-white transition-all duration-200 ${
                            uploading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                        }`}
                    >
                        {uploading ? (
                            <span className="flex items-center justify-center gap-2">
                                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Mengupload...
                            </span>
                        ) : (
                            'Upload Bukti Pembayaran'
                        )}
                    </button>
                )}
            </form>
        </div>
    );
}

export default function OrderShow({ transaction }) {
    const { storeProfile } = usePage().props;
    const [showPaymentProof, setShowPaymentProof] = useState(false);

    const formatPrice = (value) => 
        new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(value);

    // Parsing Shipping Address JSON
    let shippingAddress = {};
    try {
        shippingAddress = typeof transaction.shipping_address === 'string' 
            ? JSON.parse(transaction.shipping_address) 
            : transaction.shipping_address;
    } catch (e) {
        shippingAddress = {};
    }

    const items = transaction.details || [];
    const shippingCost = parseFloat(transaction.shipping_cost);
    const discount = parseFloat(transaction.discount);
    const grandTotal = parseFloat(transaction.grand_total);
    const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * item.qty), 0);

    const getStatusLabel = (status, paymentProof) => {
        // If pending but has payment proof, show as processing
        if (status === 'pending' && paymentProof) {
            return 'Sedang Diproses';
        }
        
        switch (status) {
            case 'pending': return 'Menunggu Pembayaran';
            case 'processing': return 'Sedang Diproses';
            case 'shipped': return 'Dalam Pengiriman';
            case 'completed': return 'Selesai';
            case 'cancelled': return 'Dibatalkan';
            default: return status;
        }
    };

    return (
        <AuthenticatedUserLayout>
            <Head title={`Invoice ${transaction.invoice}`} />
            <div className="max-w-3xl mx-auto px-4 py-8">
                <Link 
                        href={route('user.profile')} 
                        className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow mb-4"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        <span>Kembali</span>
                    </Link>
                {/* Success Banner (Conditional) */}
                {/* Status Banner */}
                {transaction.order_status === 'pending' && !transaction.payment_proof && (
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                         <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 text-amber-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold text-amber-800">Menunggu Pembayaran</h2>
                            <p className="text-sm text-amber-600">Silakan lakukan pembayaran dan upload bukti pembayaran agar pesanan segera diproses.</p>
                        </div>
                    </div>
                )}
                
                {transaction.order_status === 'pending' && transaction.payment_proof && (
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex items-center gap-3">
                         <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 text-blue-600">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="font-semibold text-blue-800">Sedang Diproses</h2>
                            <p className="text-sm text-blue-600">Bukti pembayaran Anda sedang diverifikasi oleh admin. Pesanan akan segera diproses.</p>
                        </div>
                    </div>
                )}


                {/* Invoice Card */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-indigo-500 to-indigo-700 px-6 py-6 text-white">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center font-bold text-xl">
                                    {storeProfile?.name?.charAt(0) || 'S'}
                                </div>
                                <div>
                                    <p className="font-bold text-lg">{storeProfile?.name || 'Store Name'}</p>
                                    <p className="text-xs opacity-80">{storeProfile?.address || 'Address not set'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-xs uppercase tracking-wider opacity-80">Invoice</p>
                                <p className="text-xl font-bold">{transaction.invoice}</p>
                                <p className="text-sm opacity-80">{new Date(transaction.created_at).toLocaleDateString('id-ID', {
                                    day: 'numeric', month: 'short', year: 'numeric'
                                })}</p>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Penerima</p>
                                <p className="font-semibold text-gray-900">{shippingAddress.recipient || '-'}</p>
                                <p className="text-sm text-gray-600">{shippingAddress.phone || '-'}</p>
                                <p className="text-sm text-gray-600">{shippingAddress.address || '-'}</p>
                                <p className="text-sm text-gray-600">{shippingAddress.city} {shippingAddress.postal_code}</p>
                            </div>
                            <div className="md:text-right">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">Status Order</p>
                                <span className={`inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full 
                                    ${transaction.order_status === 'completed' ? 'bg-green-100 text-green-800' : 
                                      transaction.order_status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                                      // Show blue/processing color if payment proof exists
                                      (transaction.order_status === 'pending' && transaction.payment_proof) ? 'bg-blue-100 text-blue-800' :
                                      'bg-amber-100 text-amber-800'}`}>
                                    {getStatusLabel(transaction.order_status, transaction.payment_proof)}
                                </span>
                                <p className="text-sm text-gray-600 mt-2 font-medium">Kurir: {transaction.shipping_courier}</p>
                                {transaction.tracking_number && (
                                    <p className="text-sm text-indigo-600 font-mono mt-1">NO. RESI: {transaction.tracking_number}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="px-6 py-4">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">Produk</th>
                                    <th className="pb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">Qty</th>
                                    <th className="pb-3 text-right text-xs font-semibold uppercase tracking-wider text-gray-400">Subtotal</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {items.map((item, index) => (
                                    <tr key={item.id || index}>
                                        <td className="py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                                                    {item.product?.image ? (
                                                        <img src={item.product.image} alt={item.product.title} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500">img</div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900 line-clamp-1">{item.product?.title || 'Unknown Product'}</p>
                                                    <p className="text-xs text-gray-500">{formatPrice(item.price)}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-3 text-center text-gray-600">{item.qty}</td>
                                        <td className="py-3 text-right font-semibold text-gray-900">{formatPrice(item.price * item.qty)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Payment Proof Section */}
                  {transaction.payment_method === 'manual_transfer' && (
  <div className="px-6 py-5 border-t border-gray-200">
    {/* Header with Toggle */}
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Bukti Pembayaran</h3>
          {transaction.payment_proof && (
            <p className="text-xs text-gray-500 mt-0.5">
              {transaction.order_status === 'pending' 
                ? 'Sedang diverifikasi' 
                : 'Terverifikasi'}
            </p>
          )}
        </div>
      </div>
      
      {/* Toggle Button */}
      {transaction.payment_proof && (
        <button
          onClick={() => setShowPaymentProof(!showPaymentProof)}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          aria-label="Toggle payment proof"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className={`h-5 w-5 text-gray-600 transition-transform duration-200 ${showPaymentProof ? 'rotate-180' : ''}`}
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      )}
    </div>

    {/* Collapsible Content */}
    <div className={`overflow-hidden transition-all duration-300 ${showPaymentProof ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}>
      {transaction.payment_proof ? (
        <div className="space-y-3">
          {/* Status Message - hanya tampil jika pending */}
          {transaction.order_status === 'pending' && (
            <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 border border-amber-100 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-amber-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xs text-amber-700">Admin sedang memverifikasi pembayaran Anda</p>
            </div>
          )}

          {/* Image Preview */}
          <div 
            className="relative group cursor-pointer rounded-lg overflow-hidden border border-gray-200 bg-gray-50 hover:border-indigo-300 transition-all duration-200"
            onClick={() => window.open(`/storage/${transaction.payment_proof}`, '_blank')}
          >
            <img 
              src={`/storage/${transaction.payment_proof}`}
              alt="Bukti Pembayaran"
              className="w-full max-w-md object-cover"
            />
            
            {/* Hover Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white rounded-lg px-3 py-2 shadow-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="text-xs font-medium text-gray-700">Buka gambar</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <UploadPaymentProofForm transactionId={transaction.id} />
      )}
    </div>
  </div>
)}


                    {/* Summary */}
                    <div className="bg-gray-50 px-6 py-4">
                        <div className="max-w-xs ml-auto space-y-2 text-sm">
                            <div className="flex justify-between text-gray-600">
                                <span>Subtotal</span>
                                <span>{formatPrice(subtotal)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600">
                                <span>Ongkos Kirim</span>
                                <span>{formatPrice(shippingCost)}</span>
                            </div>
                             {discount > 0 && (
                                <div className="flex justify-between text-red-600">
                                    <span>Voucher Discount</span>
                                    <span>- {formatPrice(discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
                                <span>Total</span>
                                <span className="text-indigo-600">{formatPrice(grandTotal)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {/* Action Buttons */}
                <div className="mt-8 flex flex-col sm:flex-row gap-3">
                   
                    
                    <button 
                        onClick={() => window.print()}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 text-white font-medium rounded-xl hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                        </svg>
                        <span>Cetak Invoice</span>
                    </button>
                    
                    {/* WhatsApp Confirmation - only show if pending */}
                    {transaction.order_status === 'pending' && (
                        <a 
                            href={`https://wa.me/?text=Halo saya ingin konfirmasi pembayaran untuk pesanan ${transaction.invoice}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-medium rounded-xl hover:bg-green-700 transition-all shadow-md hover:shadow-lg"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.572-.347-.299-.149-1.774-.875-2.05-.974-.277-.1-.478-.149-.679.149-.2.297-.774.974-.95 1.175-.173.198-.347.223-.646.074-.3-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.3-.347.449-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                            </svg>
                            <span>Konfirmasi via WhatsApp</span>
                        </a>
                    )}
                </div>
            </div>
        </AuthenticatedUserLayout>
    );
}

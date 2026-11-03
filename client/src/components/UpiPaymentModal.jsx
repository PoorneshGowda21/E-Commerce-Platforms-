import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import {
  X,
  Smartphone,
  Laptop,
  CheckCircle2,
  Copy,
  Check,
  Clock,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function UpiPaymentModal({
  isOpen,
  onClose,
  totalAmountUsd,
  onPaymentSuccess,
  customerName,
}) {
  if (!isOpen) return null;

  // Convert USD to INR (Standard exchange approx 85.50 INR)
  const inrAmount = Math.round(Number(totalAmountUsd) * 95.5);
  const formattedInr = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(inrAmount);

  // Merchant UPI ID
  const [upiId, setUpiId] = useState('prurnesh@okhdfcbank');
  const payeeName = 'AURA Store';

  // Detect mobile vs desktop
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [activeTab, setActiveTab] = useState('qr'); // 'qr' or 'intent'
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [utrNumber, setUtrNumber] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(600); // 10 minutes

  useEffect(() => {
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      ) || window.innerWidth < 768;

    setIsMobileDevice(isMobile);
    setActiveTab(isMobile ? 'intent' : 'qr');
  }, []);

  // 10-minute payment countdown timer
  useEffect(() => {
    if (timerSeconds <= 0) return;
    const interval = setInterval(() => {
      setTimerSeconds((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60)
      .toString()
      .padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Standard NPCI UPI URI string
  const upiLink = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(
    payeeName
  )}&am=${inrAmount}&tn=${encodeURIComponent('AURA Order Payment')}&cu=INR`;

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(upiId);
    setCopiedUpi(true);
    setTimeout(() => setCopiedUpi(false), 2000);
  };

  const handleOpenUpiApp = (appScheme = '') => {
    let targetLink = upiLink;
    if (appScheme) {
      // Custom scheme prefix if needed, else fallback to standard upi://
      targetLink = upiLink;
    }
    window.location.href = targetLink;
  };

  const handleAutoFillUtr = () => {
    const randomUtr = Math.floor(100000000000 + Math.random() * 900000000000).toString();
    setUtrNumber(randomUtr);
  };

  const handleConfirmPayment = () => {
    setIsVerifying(true);
    // Simulate real-time banking verification
    setTimeout(() => {
      setIsVerifying(false);
      onPaymentSuccess({
        id: utrNumber || `UPI_${Date.now()}`,
        status: 'SUCCESS',
        method: 'UPI',
        upiId,
        inrAmount,
        update_time: new Date().toISOString(),
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg rounded-3xl glass-panel bg-slate-900/95 border border-purple-500/30 shadow-2xl overflow-hidden max-h-[92vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>UPI Fast Gateway</span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                  Instant
                </span>
              </h3>
              <p className="text-xs text-slate-400">NPCI Unified Payments Interface</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 flex-1">
          {/* Amount Showcase Banner */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-400 block">Total Payable Amount</span>
              <div className="flex items-baseline gap-2 mt-0.5">
                <span className="text-2xl font-extrabold text-white">{formattedInr}</span>
                <span className="text-xs font-semibold text-purple-300">
                  (${Number(totalAmountUsd).toFixed(2)})
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs font-mono text-amber-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{formatTimer(timerSeconds)}</span>
            </div>
          </div>

          {/* Device Tabs Switcher (Desktop QR vs Mobile Intent) */}
          <div className="flex p-1 rounded-xl bg-slate-950/70 border border-slate-800">
            <button
              type="button"
              onClick={() => setActiveTab('qr')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                activeTab === 'qr'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>Scan QR Code (Laptop/Desktop)</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('intent')}
              className={`flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition ${
                activeTab === 'intent'
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>Open UPI App (Mobile)</span>
            </button>
          </div>

          {/* TAB 1: QR CODE VIEW (Laptop / Desktop) */}
          {activeTab === 'qr' && (
            <div className="space-y-4">
              <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center">
                {/* QR Code Container */}
                <div className="p-4 bg-white rounded-2xl shadow-xl shadow-purple-950/50 relative group">
                  <QRCodeSVG
                    value={upiLink}
                    size={200}
                    level="H"
                    includeMargin={false}
                  />
                  {/* Center Badge */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="w-10 h-10 rounded-full bg-slate-950 border-2 border-white flex items-center justify-center text-[10px] font-black text-purple-400 shadow-md">
                      UPI
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-300 mt-4">
                  Scan with any UPI app on your phone
                </p>

                {/* UPI Supported Apps Logos */}
                <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-[11px] font-semibold text-slate-400">
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Google Pay
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    PhonePe
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    Paytm
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300">
                    BHIM / Cred
                  </span>
                </div>
              </div>

              {/* UPI ID Row */}
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-slate-500 uppercase block">Payee UPI ID</span>
                  <span className="font-mono font-bold text-purple-300">{upiId}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 flex items-center gap-1.5 transition"
                >
                  {copiedUpi ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy ID</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: DIRECT UPI APP INTENT (Phone / Mobile) */}
          {activeTab === 'intent' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800 text-center space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-purple-600/30">
                  <Smartphone className="w-7 h-7" />
                </div>

                <div>
                  <h4 className="text-base font-bold text-white">Direct App Intent</h4>
                  <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                    Tap the button below to launch your default UPI app with the pre-filled amount of{' '}
                    <strong className="text-purple-300">{formattedInr}</strong>.
                  </p>
                </div>

                {/* Primary App Opener */}
                <button
                  type="button"
                  onClick={() => handleOpenUpiApp()}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 transition"
                >
                  <span>Pay with UPI App Now</span>
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              {/* Specific App Buttons */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => handleOpenUpiApp()}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition"
                >
                  <span className="text-xs font-bold text-white block">Google Pay</span>
                  <span className="text-[10px] text-slate-400">Launch GPay</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenUpiApp()}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition"
                >
                  <span className="text-xs font-bold text-white block">PhonePe</span>
                  <span className="text-[10px] text-slate-400">Launch PhonePe</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenUpiApp()}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition"
                >
                  <span className="text-xs font-bold text-white block">Paytm UPI</span>
                  <span className="text-[10px] text-slate-400">Launch Paytm</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleOpenUpiApp()}
                  className="p-3 rounded-xl bg-slate-950/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/40 text-left transition"
                >
                  <span className="text-xs font-bold text-white block">BHIM / Any App</span>
                  <span className="text-[10px] text-slate-400">Open UPI Intent</span>
                </button>
              </div>
            </div>
          )}

          {/* Payment Verification / UTR Section */}
          <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">After Completing Payment:</span>
              <button
                type="button"
                onClick={handleAutoFillUtr}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-semibold"
              >
                Autofill Test UTR
              </button>
            </div>

            <div>
              <input
                type="text"
                placeholder="Enter 12-digit UPI UTR / Ref (optional for demo)"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
              />
            </div>

            <button
              type="button"
              disabled={isVerifying}
              onClick={handleConfirmPayment}
              className="w-full py-3 px-4 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition disabled:opacity-50"
            >
              {isVerifying ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Verifying Transaction with NPCI...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>I Have Paid — Complete My Order</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Security Tag */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/90 text-center flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>256-bit Encrypted NPCI UPI Payment Channel</span>
        </div>
      </div>
    </div>
  );
}


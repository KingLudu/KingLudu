import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Camera,
  X,
  Upload,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Zap,
  ZapOff,
  SwitchCamera,
  Copy,
  Check,
  ShieldCheck,
  ArrowRight,
  FileText,
  Sparkles
} from 'lucide-react';
import jsQR from 'jsqr';
import { PaymentMethod } from '../../types';
import { parseAndVerifyPaymentQr, VerifiedQrPaymentResult } from '../../utils/paymentQrVerifier';
import { sounds } from '../../utils/soundEffects';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  expectedAmount?: number;
  expectedMethod?: PaymentMethod;
  onSuccess: (result: VerifiedQrPaymentResult) => void;
}

export const QrScannerModal: React.FC<QrScannerModalProps> = ({
  isOpen,
  onClose,
  expectedAmount,
  expectedMethod,
  onSuccess,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [hasCamera, setHasCamera] = useState<boolean>(true);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [hasTorch, setHasTorch] = useState<boolean>(false);
  const [isTorchOn, setIsTorchOn] = useState<boolean>(false);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanResult, setScanResult] = useState<VerifiedQrPaymentResult | null>(null);
  const [copiedTrx, setCopiedTrx] = useState<boolean>(false);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);

  // Stop camera tracks cleanly
  const stopCamera = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        try {
          track.stop();
        } catch {
          // ignore
        }
      });
      streamRef.current = null;
    }
    setIsScanning(false);
    setIsTorchOn(false);
  }, []);

  // Process a video frame for QR detection
  const scanFrame = useCallback(() => {
    if (!videoRef.current || !canvasRef.current || !isScanning) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height, {
          inversionAttempts: 'attemptBoth',
        });

        if (code && code.data && code.data.trim()) {
          // Success detected!
          sounds.playQrScanSuccess();
          if (navigator.vibrate) {
            try {
              navigator.vibrate([60, 40, 90]);
            } catch {
              // ignore
            }
          }

          const verification = parseAndVerifyPaymentQr(code.data, expectedAmount, expectedMethod);
          setScanResult(verification);
          setIsScanning(false);
          return;
        }
      } catch (err) {
        console.error('QR frame processing error:', err);
      }
    }

    animFrameRef.current = requestAnimationFrame(scanFrame);
  }, [isScanning, expectedAmount, expectedMethod]);

  // Start device camera
  const startCamera = useCallback(async () => {
    stopCamera();
    setCameraError(null);
    setScanResult(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasCamera(false);
      setCameraError('আপনার ব্রাউজার বা ডিভাইসে সরাসরি ক্যামেরা অ্যাক্সেস সমর্থিত নয়। নিচে ছবি আপলোড অপশন ব্যবহার করুন।');
      return;
    }

    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { ideal: facingMode },
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      // Check if torch/flashlight is supported
      const track = stream.getVideoTracks()[0];
      if (track) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const capabilities = (track.getCapabilities ? track.getCapabilities() : {}) as any;
        setHasTorch(Boolean(capabilities?.torch));
      }

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
        setIsScanning(true);
      }
    } catch (err: unknown) {
      console.warn('Camera stream error:', err);
      const errorMsg = (err instanceof Error) ? err.message : String(err);
      if (errorMsg.includes('NotAllowedError') || errorMsg.includes('Permission')) {
        setCameraError('ক্যামেরা পারমিশন ডিনাই করা হয়েছে। অনুগ্রহ করে ব্রাউজার সেটিংসে গিয়ে ক্যামেরা অ্যাক্সেস অনুমোদন করুন অথবা রসিদের ছবি আপলোড করুন।');
      } else {
        setCameraError('ডিভাইস ক্যামেরা চালু করা সম্ভব হয়নি। আপনি চাইলে গ্যালারি থেকে রসিদের ছবি আপলোড করে স্ক্যান করতে পারেন।');
      }
      setHasCamera(false);
    }
  }, [facingMode, stopCamera]);

  // Lifecycle when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
      setScanResult(null);
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, startCamera, stopCamera]);

  // Loop requestAnimationFrame while isScanning is true
  useEffect(() => {
    if (isScanning) {
      animFrameRef.current = requestAnimationFrame(scanFrame);
    }
    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isScanning, scanFrame]);

  // Torch toggle handler
  const handleToggleTorch = async () => {
    if (!streamRef.current) return;
    const track = streamRef.current.getVideoTracks()[0];
    if (track) {
      try {
        const nextState = !isTorchOn;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setIsTorchOn(nextState);
      } catch (err) {
        console.warn('Failed to toggle torch:', err);
      }
    }
  };

  // Flip camera (environment <-> user)
  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  // Restart scanning
  const handleRescan = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  // Upload receipt image file handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingFile(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current || document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, img.width, img.height);
          const imageData = ctx.getImageData(0, 0, img.width, img.height);
          const code = jsQR(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'attemptBoth',
          });

          if (code && code.data) {
            sounds.playQrScanSuccess();
            const verification = parseAndVerifyPaymentQr(code.data, expectedAmount, expectedMethod);
            setScanResult(verification);
            setIsScanning(false);
          } else {
            // No QR detected in image
            alert('ছবিটিতে কোনো পেমেন্ট কিউআর কোড খুঁজে পাওয়া যায়নি। অনুগ্রহ করে স্পষ্ট কিউআর কোডযুক্ত রসিদ নির্বাচন করুন।');
          }
        }
        setIsProcessingFile(false);
      };
      img.onerror = () => {
        setIsProcessingFile(false);
        alert('ছবিটি লোড হতে সমস্যা হয়েছে। অনুগ্রহ করে অন্য ছবি নির্বাচন করুন।');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Handle Demo test simulation (useful in desktop preview/iframe where camera is restricted)
  const handleSimulateDemo = (methodType: 'bKash' | 'Nagad' | 'Binance') => {
    sounds.playQrScanSuccess();
    let demoPayload = '';
    const now = Date.now().toString(36).toUpperCase().slice(-4);

    if (methodType === 'bKash') {
      const demoTrx = `BL${Math.floor(1000 + Math.random() * 9000)}${now}`;
      demoPayload = JSON.stringify({
        trxId: demoTrx,
        amount: expectedAmount || 500,
        method: 'bKash',
        phone: '01712' + Math.floor(100000 + Math.random() * 900000),
        orderId: 'ORD' + Math.floor(100000 + Math.random() * 900000),
      });
    } else if (methodType === 'Nagad') {
      const demoTrx = `7${Math.floor(1000000 + Math.random() * 9000000)}`;
      demoPayload = `nagad://payment/receipt?trxId=${demoTrx}&amount=${expectedAmount || 1000}&phone=01811223344`;
    } else {
      const demoTrx = `BP${Math.floor(10000000 + Math.random() * 90000000)}`;
      demoPayload = `binance://pay?payId=68903120&amount=${expectedAmount ? (expectedAmount / 130).toFixed(2) : '10'}&currency=USDT&trxId=${demoTrx}`;
    }

    const verification = parseAndVerifyPaymentQr(demoPayload, expectedAmount, expectedMethod);
    setScanResult(verification);
    setIsScanning(false);
  };

  // Confirm and apply scanned result
  const handleConfirmAndApply = () => {
    if (!scanResult) return;
    onSuccess(scanResult);
    onClose();
  };

  const handleCopyTrx = (text: string) => {
    navigator.clipboard?.writeText(text);
    setCopiedTrx(true);
    setTimeout(() => setCopiedTrx(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 animate-in fade-in duration-200">
      <div className="bg-[#031e0c] border-2 border-amber-400/80 rounded-3xl w-full max-w-sm sm:max-w-md overflow-hidden shadow-[0_0_50px_rgba(245,158,11,0.35)] flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-4 py-3 bg-gradient-to-r from-[#170e3d] via-[#241359] to-[#170e3d] border-b border-purple-500/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-amber-400 to-yellow-500 text-slate-950 flex items-center justify-center font-black shadow">
              <Camera className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
                <span>পেমেন্ট কিউআর স্ক্যানার</span>
                <span className="text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 px-1.5 py-0.2 rounded-full">
                  লাইভ ক্যামেরা
                </span>
              </h3>
              <p className="text-[10px] text-purple-200">
                ক্যামেরা দিয়ে রসিদের TrxID কিউআর স্ক্যান ও ভেরিফাই করুন
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Viewfinder or Camera Feed */}
        <div className="relative flex-1 bg-black min-h-[280px] max-h-[360px] flex items-center justify-center overflow-hidden">
          {/* Hidden Canvas for QR decoding */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Active Camera Video Feed */}
          <video
            ref={videoRef}
            className={`w-full h-full object-cover ${scanResult ? 'brightness-50 filter blur-[1px]' : ''}`}
            playsInline
            muted
          />

          {/* Viewfinder Overlay with Reticle & Animated Laser Line */}
          {isScanning && !cameraError && (
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center p-6">
              {/* Outer dark vignette */}
              <div className="absolute inset-0 bg-slate-950/40" />

              {/* Central Target Square */}
              <div className="relative w-56 h-56 sm:w-64 sm:h-64 border-2 border-amber-400/90 rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(245,158,11,0.5)] z-10">
                {/* 4 Corner Accents */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

                {/* Sweeping Laser Scan Line */}
                <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_12px_rgba(52,211,153,1)] animate-bounce" />

                {/* Center crosshair */}
                <div className="absolute inset-0 flex items-center justify-center opacity-30">
                  <div className="w-8 h-8 border border-white/60 rounded-full" />
                </div>
              </div>

              {/* Status Hint Pill */}
              <div className="relative z-10 mt-3 px-3 py-1 bg-slate-950/80 border border-amber-400/40 rounded-full text-[10px] text-amber-200 font-bold tracking-wide backdrop-blur-sm shadow flex items-center gap-1.5 animate-pulse">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>পেমেন্ট রসিদ বা TrxID কিউআর কোড ফ্রেমে রাখুন</span>
              </div>
            </div>
          )}

          {/* Camera Controls Overlay (Top Right of Viewfinder) */}
          {isScanning && !cameraError && (
            <div className="absolute top-3 right-3 flex items-center gap-2 z-20">
              {hasTorch && (
                <button
                  type="button"
                  onClick={handleToggleTorch}
                  className={`p-2 rounded-xl backdrop-blur-md border text-xs font-bold transition shadow-lg flex items-center gap-1 ${
                    isTorchOn
                      ? 'bg-amber-400 text-slate-950 border-amber-300'
                      : 'bg-slate-950/70 text-white border-white/20 hover:bg-slate-900'
                  }`}
                  title="ফ্ল্যাশ লাইট"
                >
                  {isTorchOn ? <Zap className="w-4 h-4 fill-slate-950" /> : <ZapOff className="w-4 h-4" />}
                </button>
              )}

              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-2 rounded-xl bg-slate-950/70 hover:bg-slate-900 text-white border border-white/20 backdrop-blur-md transition shadow-lg"
                title="ক্যামেরা পরিবর্তন করুন"
              >
                <SwitchCamera className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Camera Error or Denied State */}
          {cameraError && !scanResult && (
            <div className="absolute inset-0 bg-[#031e0c] p-5 flex flex-col items-center justify-center text-center space-y-3 z-20">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-sm text-white">ক্যামেরা চালু করা যায়নি</h4>
              <p className="text-xs text-purple-200 leading-relaxed max-w-xs">{cameraError}</p>

              <div className="flex items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-3.5 py-2 bg-gradient-to-r from-amber-400 to-yellow-500 text-slate-950 text-xs font-black rounded-xl shadow active:scale-95 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>পুনরায় চেষ্টা করুন</span>
                </button>

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3.5 py-2 bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-400/40 text-xs font-bold rounded-xl shadow active:scale-95 transition flex items-center gap-1.5"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>ছবি আপলোড</span>
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS SCAN RESULT MODAL OVERLAY */}
          {scanResult && (
            <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md p-4 flex flex-col justify-between z-30 animate-in fade-in zoom-in-95 duration-200 overflow-y-auto">
              <div className="space-y-3">
                {/* Result Title Badge */}
                <div className="flex items-center justify-between pb-2 border-b border-purple-500/30">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-black ${
                        scanResult.isValid
                          ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-400'
                          : 'bg-rose-500/20 border border-rose-400 text-rose-400'
                      }`}
                    >
                      {scanResult.isValid ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-rose-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-white">{scanResult.title}</h4>
                      <p className="text-[10px] text-purple-200">
                        {scanResult.isValid
                          ? 'পেমেন্ট ভেরিফিকেশন সফলভাবে সম্পন্ন হয়েছে'
                          : 'সঠিক ফরম্যাটের তথ্য পাওয়া যায়নি'}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${
                      scanResult.isValid
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/50'
                    }`}
                  >
                    {scanResult.confidence === 'high' ? 'High Match' : 'Verified'}
                  </span>
                </div>

                {/* Primary Card: Extracted TrxID */}
                {scanResult.isValid ? (
                  <div className="bg-[#120833] border-2 border-emerald-500/60 rounded-2xl p-3 space-y-2.5 shadow-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-300">ভেরিফাইড TrxID:</span>
                      <button
                        type="button"
                        onClick={() => handleCopyTrx(scanResult.trxId)}
                        className="px-2 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 border border-purple-400/30 transition cursor-pointer"
                      >
                        {copiedTrx ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-300">কপি হয়েছে</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3 text-amber-300" />
                            <span>কপি করুন</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="bg-black/50 border border-emerald-400/40 rounded-xl p-2.5 text-center font-mono font-black text-lg sm:text-xl text-emerald-300 tracking-wider break-all shadow-inner select-all">
                      {scanResult.trxId}
                    </div>

                    {/* Detected Metadata Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-emerald-800/40">
                      {scanResult.detectedMethod && (
                        <div className="bg-[#031e0c] p-2 rounded-xl border border-emerald-800/50">
                          <span className="text-[10px] text-slate-400 block">পেমেন্ট মেথড:</span>
                          <span className="font-bold text-amber-300 text-[11px]">
                            {scanResult.detectedMethod}
                          </span>
                        </div>
                      )}

                      {scanResult.detectedAmount !== undefined && (
                        <div className="bg-[#031e0c] p-2 rounded-xl border border-emerald-800/50">
                          <span className="text-[10px] text-slate-400 block">পরিশোধিত পরিমাণ:</span>
                          <span
                            className={`font-black text-[11px] font-mono ${
                              scanResult.amountMatches === false
                                ? 'text-amber-400'
                                : 'text-emerald-300'
                            }`}
                          >
                            ৳{scanResult.detectedAmount.toLocaleString()}
                            {scanResult.amountMatches === true && ' ✓'}
                          </span>
                        </div>
                      )}

                      {scanResult.detectedPhone && (
                        <div className="bg-[#031e0c] p-2 rounded-xl border border-emerald-800/50 col-span-2">
                          <span className="text-[10px] text-slate-400 block">প্রেরক অ্যাকাউন্ট / মোবাইল:</span>
                          <span className="font-bold text-white text-[11px] font-mono">
                            {scanResult.detectedPhone}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Explain Message */}
                    <p className="text-[10px] text-purple-200/90 leading-tight">
                      {scanResult.message}
                    </p>
                  </div>
                ) : (
                  <div className="bg-rose-950/30 border border-rose-500/50 rounded-2xl p-3 text-xs text-rose-200 space-y-1.5">
                    <p className="font-bold">{scanResult.message}</p>
                    <p className="text-[11px] text-rose-300/80">
                      রসিদে প্রদর্শিত TrxID অথবা বিকাশ/নগদ অ্যাপের পেমেন্ট স্ট্যাটাস কিউআর কোডটি পুনরায় স্ক্যান করুন।
                    </p>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="space-y-2 pt-3">
                {scanResult.isValid ? (
                  <button
                    type="button"
                    onClick={handleConfirmAndApply}
                    className="w-full py-3 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-500 hover:brightness-110 text-white font-black text-xs sm:text-sm rounded-xl shadow-lg shadow-emerald-950/60 flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>✓ ডিপোজিট ফর্মে এই TrxID বসান (Apply to Form)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={handleRescan}
                  className="w-full py-2 bg-purple-900/40 hover:bg-purple-800/60 text-slate-200 hover:text-white font-bold text-xs rounded-xl border border-purple-700/50 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>পুনরায় স্ক্যান করুন (Rescan)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions / Image Upload / Test Simulator */}
        <div className="p-3 bg-[#130b35] border-t border-purple-500/30 space-y-2.5">
          {/* File Upload Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingFile}
              className="flex-1 py-2 px-3 bg-[#1e134b] hover:bg-[#281a63] border border-purple-400/40 text-purple-200 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition active:scale-95 cursor-pointer"
            >
              {isProcessingFile ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                  <span>ছবি যাচাই হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5 text-amber-400" />
                  <span>গ্যালারি / রসিদ ছবি আপলোড</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Demo Simulators (Helpful for desktop browsers & fast verification testing) */}
          <div className="pt-1 border-t border-purple-800/30 flex items-center justify-between gap-1.5 text-[10px]">
            <span className="text-slate-400 flex items-center gap-1 shrink-0 font-medium">
              <FileText className="w-3 h-3 text-amber-400" />
              <span>ডেমো টেস্ট:</span>
            </span>

            <div className="flex items-center gap-1 flex-wrap justify-end">
              <button
                type="button"
                onClick={() => handleSimulateDemo('bKash')}
                className="px-2 py-0.5 rounded-lg bg-pink-950/60 border border-pink-500/40 text-pink-300 font-bold hover:bg-pink-900 active:scale-95 transition cursor-pointer"
              >
                bKash রসিদ
              </button>
              <button
                type="button"
                onClick={() => handleSimulateDemo('Nagad')}
                className="px-2 py-0.5 rounded-lg bg-orange-950/60 border border-orange-500/40 text-orange-300 font-bold hover:bg-orange-900 active:scale-95 transition cursor-pointer"
              >
                Nagad রসিদ
              </button>
              <button
                type="button"
                onClick={() => handleSimulateDemo('Binance')}
                className="px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 font-bold hover:bg-amber-900 active:scale-95 transition cursor-pointer"
              >
                Binance Pay
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import { useState } from 'react';
import { ChevronLeft, Lock, CreditCard, Smartphone, Building2, CheckCircle2 } from 'lucide-react';

interface PaymentMethod {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
}

export default function Payment({ onBack, totalAmount }: { onBack: () => void; totalAmount: number }) {
  const [selectedMethod, setSelectedMethod] = useState<string>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
    holderName: '',
    agreeTerms: false,
  });

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: '신용카드 / 체크카드',
      icon: <CreditCard style={{ width: '24px', height: '24px' }} />,
      description: '국내 모든 신용카드 및 체크카드 사용 가능',
    },
    {
      id: 'transfer',
      name: '계좌이체',
      icon: <Building2 style={{ width: '24px', height: '24px' }} />,
      description: '국내 모든 은행 계좌 이체 가능',
    },
    {
      id: 'mobile',
      name: '휴대폰 결제',
      icon: <Smartphone style={{ width: '24px', height: '24px' }} />,
      description: 'SKT, KT, LG U+ 휴대폰 결제',
    },
  ];

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setPaymentData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, '');
    value = value.replace(/(\d{4})/g, '$1 ').trim();
    setPaymentData(prev => ({ ...prev, cardNumber: value }));
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    setPaymentData(prev => ({ ...prev, expiryDate: value }));
  };

  const handlePayment = async () => {
    if (!paymentData.agreeTerms) {
      alert('약관에 동의해주세요.');
      return;
    }

    if (selectedMethod === 'card' && (!paymentData.cardNumber || !paymentData.cvv)) {
      alert('카드 정보를 입력해주세요.');
      return;
    }

    setIsProcessing(true);
    // 결제 처리 시뮬레이션
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-bounce">
              <CheckCircle2 style={{ width: '32px', height: '32px', color: '#10b981' }} />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">결제 완료!</h1>
          <p className="text-gray-600 mb-6">제주 여행 예약이 확정되었습니다.</p>

          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">결제 금액</p>
            <p className="text-3xl font-bold text-primary">{totalAmount.toLocaleString()}원</p>
          </div>

          <div className="space-y-3 text-left mb-6 bg-gray-50 rounded-lg p-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
              <span className="text-sm text-gray-700">항공권 예약 확정</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
              <span className="text-sm text-gray-700">숙박 예약 확정</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 style={{ width: '20px', height: '20px', color: '#10b981', flexShrink: 0 }} />
              <span className="text-sm text-gray-700">렌터카 예약 확정</span>
            </div>
          </div>

          <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-900">
              <strong>예약 번호:</strong> JJU-2024-031501<br />
              <strong>확인 이메일:</strong> 등록된 이메일로 발송되었습니다.
            </p>
          </div>

          <button
            onClick={onBack}
            className="btn-primary w-full"
          >
            확인
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* 헤더 */}
      <header className="jeju-header sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto px-4 py-3 md:py-4">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={onBack}
              className="p-1.5 md:p-2 hover:bg-white/20 rounded-lg transition-colors flex-shrink-0"
            >
              <ChevronLeft style={{ width: '20px', height: '20px', color: 'white' }} />
            </button>
            <div className="min-w-0">
              <h1 className="text-lg md:text-2xl font-bold truncate">결제</h1>
              <p className="text-blue-100 text-xs md:text-sm">제주 통합 결제 시스템</p>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="container mx-auto px-4 py-6 md:py-8 max-w-4xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* 결제 폼 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 결제 수단 선택 */}
            <div className="payment-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">결제 수단 선택</h2>
              <div className="space-y-2 md:space-y-3">
                {paymentMethods.map(method => (
                  <label
                    key={method.id}
                    className="flex items-start p-3 md:p-4 border-2 rounded-lg cursor-pointer transition-all gap-2 md:gap-3"
                    style={{
                      borderColor: selectedMethod === method.id ? '#003DA5' : '#e5e7eb',
                      backgroundColor: selectedMethod === method.id ? '#f0f7ff' : 'white',
                    }}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      style={{ accentColor: '#003DA5', marginTop: '4px', flexShrink: 0 }}
                    />
                    <div className="flex-grow min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <div style={{ color: '#003DA5', flexShrink: 0 }}>{method.icon}</div>
                        <p className="font-semibold text-sm md:text-base text-gray-900 truncate">{method.name}</p>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600">{method.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 신용카드 결제 폼 */}
            {selectedMethod === 'card' && (
              <div className="payment-card p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">카드 정보</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      카드 번호
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={paymentData.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="0000 0000 0000 0000"
                      maxLength={19}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-900 mb-2">
                      카드 소유자명
                    </label>
                    <input
                      type="text"
                      name="cardName"
                      value={paymentData.cardName}
                      onChange={handlePaymentChange}
                      placeholder="HONG GILDONG"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        유효기간
                      </label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={paymentData.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-900 mb-2">
                        CVV
                      </label>
                      <input
                        type="password"
                        name="cvv"
                        value={paymentData.cvv}
                        onChange={handlePaymentChange}
                        placeholder="000"
                        maxLength={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 계좌이체 */}
            {selectedMethod === 'transfer' && (
              <div className="payment-card p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">계좌이체</h2>
                <div className="bg-blue-50 rounded-lg p-4">
                  <p className="text-sm text-gray-700 mb-3">
                    아래 계좌로 입금해주세요. 입금 후 자동으로 결제가 완료됩니다.
                  </p>
                  <div className="bg-white rounded-lg p-4 border border-blue-200">
                    <p className="text-sm text-gray-600">예금주: 제주항공</p>
                    <p className="text-lg font-bold text-gray-900 mt-2">국민은행 123-456-789012</p>
                  </div>
                </div>
              </div>
            )}

            {/* 휴대폰 결제 */}
            {selectedMethod === 'mobile' && (
              <div className="payment-card p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">휴대폰 결제</h2>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    휴대폰 번호
                  </label>
                  <input
                    type="tel"
                    placeholder="010-0000-0000"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* 약관 동의 */}
            <div className="payment-card p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-gray-900 mb-4">약관 동의</h2>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={paymentData.agreeTerms}
                  onChange={handlePaymentChange}
                  style={{
                    width: '20px',
                    height: '20px',
                    marginTop: '2px',
                    accentColor: '#003DA5',
                    flexShrink: 0,
                  }}
                />
                <div>
                  <p className="text-sm text-gray-700">
                    <strong>결제 약관 및 개인정보 처리방침에 동의합니다.</strong>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    결제 시 위 약관에 동의하는 것으로 간주됩니다.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* 결제 요약 사이드바 */}
          <div className="lg:col-span-1">
            <div className="sticky top-20 md:top-24 space-y-3 md:space-y-4">
              <div className="payment-card p-4 md:p-6">
                <h3 className="font-bold text-gray-900 mb-4 text-base md:text-lg">결제 요약</h3>

                <div className="space-y-4 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">항공권</span>
                    <span className="font-semibold text-gray-900">89,000원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">숙박</span>
                    <span className="font-semibold text-gray-900">450,000원</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">렌터카</span>
                    <span className="font-semibold text-gray-900">180,000원</span>
                  </div>
                </div>

                <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">소계</span>
                    <span className="font-semibold text-gray-900">
                      {(totalAmount / 1.1).toLocaleString()}원
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">부가세</span>
                    <span className="font-semibold text-gray-900">
                      {Math.round((totalAmount / 1.1) * 0.1).toLocaleString()}원
                    </span>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-900">최종 결제액</span>
                    <div className="text-right">
                      <p className="price-display">{totalAmount.toLocaleString()}</p>
                      <p className="text-xs text-gray-500">원</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <div
                        style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(255,255,255,0.3)',
                          borderTop: '2px solid white',
                          borderRadius: '50%',
                          animation: 'spin 0.8s linear infinite',
                        }}
                      />
                      처리 중...
                    </>
                  ) : (
                    <>
                      <Lock style={{ width: '18px', height: '18px' }} />
                      안전하게 결제
                    </>
                  )}
                </button>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 md:p-4 flex gap-2 md:gap-3">
                <Lock style={{ width: '18px', height: '18px', color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                <div className="text-xs md:text-sm">
                  <p className="font-semibold text-green-900 mb-1">안전한 결제</p>
                  <p className="text-green-800">
                    모든 결제 정보는 암호화되어 안전하게 처리됩니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

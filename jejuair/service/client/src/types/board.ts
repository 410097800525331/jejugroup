export type ServiceType = 'flight' | 'hotel' | 'rental';

export interface Post {
  id: string;
  service: ServiceType;
  title: string;
  content: string;
  author: string;
  email: string;
  phone: string;
  reservationId?: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  status: 'pending' | 'answered' | 'resolved';
}

export interface ServiceConfig {
  id: ServiceType;
  name: string;
  color: string;
  categories: string[];
}

export const SERVICES: Record<ServiceType, ServiceConfig> = {
  flight: {
    id: 'flight',
    name: '항공편 문의',
    color: '#ff5100',
    categories: ['예약 정보 확인', '예약 변경', '환불 신청', '수하물 문의', '기타 항공편 문의']
  },
  hotel: {
    id: 'hotel',
    name: '숙박 문의',
    color: '#0066cc',
    categories: ['예약 확인', '예약 변경', '취소 신청', '시설 문의', '기타 숙박 문의']
  },
  rental: {
    id: 'rental',
    name: '렌터카 문의',
    color: '#ff0000',
    categories: ['예약 확인', '예약 변경', '취소 신청', '차량 상태 문의', '기타 렌터카 문의']
  }
};

import { Button } from "@/components/ui/button";
import { AlertCircle, Home } from "lucide-react";
import { Link } from "wouter";

/**
 * 404 Not Found 페이지
 * 제주항공 스타일 적용
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-orange-50 flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 flex justify-center">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center">
            <AlertCircle className="text-orange-600" size={48} />
          </div>
        </div>
        <h1 className="text-5xl font-bold text-gray-900 mb-2">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          페이지를 찾을 수 없습니다
        </h2>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          죄송합니다. 요청하신 페이지가 존재하지 않습니다.
          <br />
          홈페이지로 돌아가거나 고객센터에 문의해주세요.
        </p>
        <Link href="/">
          <a>
            <Button className="bg-orange-500 hover:bg-orange-600 text-white">
              <Home size={20} className="mr-2" />
              홈으로 돌아가기
            </Button>
          </a>
        </Link>
      </div>
    </div>
  );
}

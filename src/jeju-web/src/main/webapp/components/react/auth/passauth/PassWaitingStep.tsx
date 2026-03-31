export const PassWaitingStep = () => {
  return (
    <div className="pass-screen active">
      <div className="pass-confirm-ui">
        <div className="pass-loader pass-loader-lg"></div>
        <div className="pass-title-center">
          <strong>인증 진행 중 상태</strong>
        </div>
        <div className="pass-subtitle">잠시만 기다리면 회원가입 창으로 결과 전달 예정 상태</div>
      </div>
    </div>
  );
};

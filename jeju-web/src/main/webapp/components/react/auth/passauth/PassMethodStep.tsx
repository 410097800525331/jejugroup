import { usePassAuthController } from "@front-components/auth/hooks/usePassAuthController";
import { PASS_METHOD_OPTIONS } from "@front-components/auth/passauth/data";

export const PassMethodStep = () => {
  const { handleSelectMethod } = usePassAuthController();

  return (
    <div className="pass-screen active">
      <div className="authmethod-list">
        {PASS_METHOD_OPTIONS.map((item) => (
          <button className="authmethod-btn" key={item.value} onClick={() => handleSelectMethod(item.value)} type="button">
            <div className="method-info">
              <strong>{item.title}</strong>
              <span>{item.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

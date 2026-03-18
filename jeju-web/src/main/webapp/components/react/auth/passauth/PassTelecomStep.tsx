import { usePassAuthController } from "@front-components/auth/hooks/usePassAuthController";
import { TELECOM_OPTIONS } from "@front-components/auth/passauth/data";

export const PassTelecomStep = () => {
  const { handleSelectTelecom } = usePassAuthController();

  return (
    <div className="pass-screen active">
      <div className="telecom-grid">
        {TELECOM_OPTIONS.map((item) => (
          <button
            className={`telecom-btn ${item.isMuted ? "mvno" : ""}`.trim()}
            key={item.value}
            onClick={() => handleSelectTelecom(item.value)}
            type="button"
          >
            {item.label.split("\n").map((line) => (
              <span key={line}>{line}</span>
            ))}
          </button>
        ))}
      </div>
    </div>
  );
};

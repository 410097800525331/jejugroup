import React from "react";

interface CardHolderProps {
  onClick: () => void;
  isOpen: boolean;
}

export default function CardHolder({ onClick, isOpen }: CardHolderProps) {
  return (
    <div className="card-holder" onClick={onClick}>
      <div className="fab-peek"></div>
      <div className="fab-body"></div>
    </div>
  );
}

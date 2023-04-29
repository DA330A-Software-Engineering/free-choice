import React from "react";

interface OpenLockControlProps {
  state: any;
  onStateChange: (newState: any) => void;
}

const OpenLockControl: React.FC<OpenLockControlProps> = ({
  state,
  onStateChange,
}) => {
  const handleOpenToggle = () => {
    onStateChange({ ...state, open: !state?.open });
  };

  const handleLockedToggle = () => {
    onStateChange({ ...state, locked: !state?.locked });
  };

  return (
    <div>
      <button onClick={handleOpenToggle}>
        {state?.open ? "Close" : "Open"}
      </button>
      <button onClick={handleLockedToggle}>
        {state?.locked ? "Unlock" : "Lock"}
      </button>
    </div>
  );
};

export default OpenLockControl;

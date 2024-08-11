"use client";

import { Button } from "@nextui-org/react";

interface ActionButtonsProps {
  selectedUserPositionHandler?: () => void;
  selectedUserTrackHandler?: () => void;
  isTracking?: boolean;
}

const ActionButtons = ({
  selectedUserPositionHandler,
  selectedUserTrackHandler,
  isTracking,
}: ActionButtonsProps) => {
  return (
    <ul>
      <Button
        color="primary"
        variant="solid"
        onClick={selectedUserPositionHandler}
      >
        {!isTracking ? "Follow User" : "Stop Following User"}
      </Button>
      <Button
        color="primary"
        variant="solid"
        onClick={selectedUserTrackHandler}
      >
        Track User
      </Button>
    </ul>
  );
};

export default ActionButtons;

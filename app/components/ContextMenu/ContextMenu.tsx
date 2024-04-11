import React, { useEffect } from "react";
import { useClickOutSide } from "@/app/hooks/UseOnclickOutSide";

type Props = {
  x: number;
  y: number;
  onCloseContextMenu: any;
  parentRef: any;
  children: any;
};

function ContextMenu({ x, y, onCloseContextMenu, parentRef, children }: Props) {
  const menuStyle = {
    top: `${y}px`,
    left: `${x}px`,
  };

  useEffect(() => {
    const clickListener = (event: MouseEvent) => {
      const menuParent = parentRef?.current;
      if (!menuParent || !menuParent.contains(event?.target)) {
        console.log("tru");
        return;
      }
      onCloseContextMenu();
    };
    document.addEventListener("mousedown", clickListener);

    return () => {
      document.removeEventListener("mousedown", clickListener);
    };
  }, []);

  return (
    <div style={menuStyle} className="absolute z-999 bg-gray-600 p-6">
      {children}
    </div>
  );
}

export default ContextMenu;

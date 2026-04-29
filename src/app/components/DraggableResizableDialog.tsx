import React, { useState, useEffect } from "react";
import { Rnd } from "react-rnd";
import { XIcon } from "lucide-react";
import { createPortal } from "react-dom";

interface DraggableResizableDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  defaultWidth?: number;
  defaultHeight?: number;
  minWidth?: number;
  minHeight?: number;
}

export function DraggableResizableDialog({
  open,
  onOpenChange,
  children,
  defaultWidth = 1200,
  defaultHeight = 700,
  minWidth = 800,
  minHeight = 500,
}: DraggableResizableDialogProps) {
  const [size, setSize] = useState({ width: defaultWidth, height: defaultHeight });
  const [position, setPosition] = useState({ x: 0, y: 0 });

  // Center the dialog when it opens
  useEffect(() => {
    if (open) {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      setPosition({
        x: (windowWidth - defaultWidth) / 2,
        y: (windowHeight - defaultHeight) / 2,
      });
      setSize({ width: defaultWidth, height: defaultHeight });
    }
  }, [open, defaultWidth, defaultHeight]);

  if (!open) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-50 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      
      {/* Draggable and Resizable Dialog */}
      <Rnd
        size={size}
        position={position}
        onDragStop={(e, d) => {
          setPosition({ x: d.x, y: d.y });
        }}
        onResizeStop={(e, direction, ref, delta, position) => {
          setSize({
            width: parseInt(ref.style.width),
            height: parseInt(ref.style.height),
          });
          setPosition(position);
        }}
        minWidth={minWidth}
        minHeight={minHeight}
        maxWidth="95vw"
        maxHeight="95vh"
        bounds="window"
        dragHandleClassName="dialog-drag-handle"
        className="z-50"
        style={{
          position: "fixed",
        }}
      >
        <div className="bg-white rounded-lg border shadow-lg overflow-hidden flex flex-col h-full relative">
          <button
            className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-white transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-gray-950 focus:ring-offset-2 disabled:pointer-events-none z-50"
            onClick={() => onOpenChange(false)}
          >
            <XIcon className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
          {children}
        </div>
      </Rnd>
    </>,
    document.body
  );
}
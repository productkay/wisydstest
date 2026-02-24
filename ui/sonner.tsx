"use client";

import * as React from "react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--border-success)",
          "--success-text": "var(--border-success-foreground)",
          "--success-border": "var(--border-success)",
          "--error-bg": "var(--border-error)",
          "--error-text": "var(--border-error-foreground)",
          "--error-border": "var(--border-error)",
          "--info-bg": "var(--border-info)",
          "--info-text": "var(--border-info-foreground)",
          "--info-border": "var(--border-info)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
'use client'

import { useFormStatus } from 'react-dom';
import { Button } from "@heroui/button";
import { ReactNode } from 'react';

export default function SubmitButton({ 
  disabled = false, size = 'lg', variant = 'shadow', className, content
}: { 
  disabled?: boolean, 
  size?: 'sm' | 'md' | 'lg',
  variant?: "shadow" | "solid" | "bordered" | "light" | "flat" | "faded" | "ghost",
  className?: string 
  content: string | ReactNode, 
}) {
  const { pending } = useFormStatus();

  return (
    <Button 
      color="primary" 
      type="submit"
      className={`submit-btn w-full ${className}`}
      size={size}
      variant={variant}
      isLoading={pending}
      isDisabled={disabled || pending}
      aria-label="Submit"
    >
      {content}
    </Button>
  );
}
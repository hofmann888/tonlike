'use client'

import { useFormStatus } from 'react-dom';
import { Button } from "@heroui/button";
import { ReactNode } from 'react';

export default function SubmitButton({ 
  content, disabled = false, className 
}: { 
  content: string | ReactNode, disabled?: boolean, className?: string 
}) {
  const { pending } = useFormStatus();

  return (
    <Button 
      color="primary" 
      type="submit"
      className={`submit-btn w-full ${className}`}
      size="lg"
      variant="shadow"
      isLoading={pending}
      isDisabled={disabled || pending}
    >
      {content}
    </Button>
  );
}
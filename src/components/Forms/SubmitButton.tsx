import { useFormStatus } from 'react-dom';
import clsx from "clsx";

export default function SubmitButton({ text, disabled = false }: { text: string, disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className={clsx('submit-btn', {'disabled': disabled || pending})} 
      disabled={disabled || pending} 
      aria-disabled={pending}
    >
      {text}
    </button>
  );
}
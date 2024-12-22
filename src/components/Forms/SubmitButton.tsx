import { useFormStatus } from 'react-dom';
import clsx from "clsx";

export default function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className={clsx('submit-btn', {'disabled': pending})} 
      disabled={pending} 
      aria-disabled={pending}
    >
      {text}
    </button>
  );
}
import { useFormStatus } from 'react-dom';
import { Button } from '@nextui-org/button';

export default function SubmitButton({ text, disabled = false }: { text: string, disabled?: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button 
      color="primary" 
      type="submit"
      className="submit-btn w-full"
      size="lg"
      variant="shadow"
      isLoading={pending}
      isDisabled={disabled || pending}
    >
      {text}
    </Button>
  );
}
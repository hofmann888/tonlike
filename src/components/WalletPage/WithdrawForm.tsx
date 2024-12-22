import { WithdrawFormState } from "@/lib/definitions";
import { WithdrawFormSubmit } from "@/db/actions";
import { useTonConnect } from "@/hooks/useTonConnect";
import { useFormState } from 'react-dom';
import { useFormStatus } from 'react-dom';
import clsx from "clsx";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      className={clsx('submit-btn', {'disabled': pending})} 
      disabled={pending} 
      aria-disabled={pending}
    >
      Withdraw
    </button>
  );
}

export default function WithdrawForm() {
  const min = 1;
  const { address } = useTonConnect();
  const initialState: WithdrawFormState = { errors: {}, message: null };
  const [state, formAction] = useFormState(WithdrawFormSubmit, initialState);
  
  return (
    <form action={formAction} className="withdraw-form">
      <div className="form-field">
        <label htmlFor="amount">Amount</label>
        <input type="number" name="amount" step="0.1" defaultValue={min} min={min} />

        <div aria-live="polite" aria-atomic="true">
            {state?.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              )
            )}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="address">Address</label>
        <input type="text" name="address" defaultValue={address ?? ''} />

        <div aria-live="polite" aria-atomic="true">
            {state?.errors?.address &&
              state.errors.address.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              )
            )}
        </div>
      </div>

      <div id="fields-error" aria-live="polite" aria-atomic="true">
        {state?.message &&
          <p className="mt-2 text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        }
      </div>

      <SubmitButton />
    </form>
  )
}
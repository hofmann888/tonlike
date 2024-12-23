'use client'

import { DepositFormSubmit } from "@/db/actions";
import { DepostitFormState } from "@/lib/definitions";
import { useFormState } from 'react-dom';
import SubmitButton from "@/components/Forms/SubmitButton";

export default function DepositForm() {
  const min = 1;
  const initialState: DepostitFormState = { errors: {}, message: null };
  const [state, formAction] = useFormState(DepositFormSubmit, initialState);

  return (
    <form action={formAction}>
      <div className="form-field">
        <label htmlFor="amount">Amount</label>
        <input type="number" name="amount" step="0.1" min={min} defaultValue={min} />

        <div id="amountError" aria-live="polite" aria-atomic="true">
          {state?.errors?.amount &&
            state.errors.amount.map((error: string) => (
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

      <SubmitButton text="Deposit" />
    </form>
  )
}
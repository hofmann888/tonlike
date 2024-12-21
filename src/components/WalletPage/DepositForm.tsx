'use clinet'

// import { updateUserBalance } from "@/app/db/actions";
import { updateUserBalance } from "@/db/sql";
import { DepostitFormState } from "@/lib/definitions";
import { useConnectedUser } from "@/hooks/useConnectedUser";
import { useFormState } from 'react-dom';

import { UserContext } from "../Providers/UserProvider";
import { useContext } from "react";

export default function DepositForm() {
  const min = 1;
  const { id, balance } = useConnectedUser();
  // const { id, balance } = useContext(UserContext);

  const initialState: DepostitFormState = { errors: {}, message: null };
  const updateBalanceWithUserId = updateUserBalance.bind(null, id, balance); // TODO: get balance on the server side?
  const [state, formAction] = useFormState(updateBalanceWithUserId, initialState);

  return (
    <form action={formAction}>
      <div className="form-field">
        <label htmlFor="amount">Amount</label>
        <input type="number" name="amount" step="0.1" min={min} defaultValue={min} />

        <div id="customer-error" aria-live="polite" aria-atomic="true">
            {state?.errors?.amount &&
              state.errors.amount.map((error: string) => (
                <p className="mt-2 text-sm text-red-500" key={error}>
                  {error}
                </p>
              )
            )}
        </div>
      </div>

      <button type="submit" className="submit-btn">Deposit</button>
    </form>
  )
}
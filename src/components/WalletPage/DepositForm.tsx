'use client'

import { Form } from "@heroui/form";
import { Input } from "@heroui/input";
import { DepositFormSubmit } from "@/core/actions";
import { DepostitFormState } from "@/lib/definitions";
import { useFormState } from 'react-dom';
import SubmitButton from "@/components/Forms/SubmitButton";

export default function DepositForm() {
  const min = 1;
  const initialState: DepostitFormState = { errors: {}, message: null };
  const [state, formAction] = useFormState(DepositFormSubmit, initialState);

  return (
    <Form action={formAction} validationErrors={state?.errors}>
      <Input
        name="amount"
        label="Amount"
        type="number"
        placeholder="0.00"
        min={min}
        step={0.1}
        variant="bordered"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">$</span>
          </div>
        }
      />

      <div id="fields-error" aria-live="polite" aria-atomic="true">
        {state?.message &&
          <p className="mt-2 text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        }
      </div>

      <SubmitButton content="Deposit" />
    </Form>
  )
}
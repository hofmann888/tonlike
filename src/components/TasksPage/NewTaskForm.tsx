'use client'

import { useRef } from "react";
import { useFormState } from "react-dom";
import { NewTaskFormSubmit } from "@/db/actions";
import { NewTaskFormState, Action, Service } from "@/lib/definitions";
import SubmitButton from "@/components/Forms/SubmitButton";

// TODO: display task sum
export default function NewTaskForm({ actions, services }: { actions: Action[], services: Service[] }) {
  const linkInput = useRef<any>();

  function changeService() {
    if (linkInput.current) {
      linkInput.current.value = '';
    }
  }

  const initialState: NewTaskFormState = { errors: {}, message: null };
  const [state, formAction] = useFormState(NewTaskFormSubmit, initialState);

  return (
    <form action={formAction} className="new-task-form">
      <div className="form-field">
        <label htmlFor="serviceId">Service</label>
        <select name="serviceId" id="serviceId" onChange={changeService} required>
          <option value="" disabled>
            Select a service
          </option>

          {services.map((service) => (
            <option key={service.id} value={service.id}>
              {service.name}
            </option>
          ))}
        </select>

        <div aria-live="polite" aria-atomic="true">
          {state?.errors?.serviceId &&
            state.errors.serviceId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            )
          )}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="link">Link</label>
        <input type="text" name="link" id="link" ref={linkInput} required />

        <div aria-live="polite" aria-atomic="true">
          {state?.errors?.link &&
            state.errors.link.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            )
          )}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="actionId">Action</label>
        <select name="actionId" id="actionId" required>
          <option value="" disabled>
            Select an action
          </option>

          {actions.map((action) => (
            <option key={action.id} value={action.id}>
              {action.name}
            </option>
          ))}
        </select>

        <div aria-live="polite" aria-atomic="true">
          {state?.errors?.actionId &&
            state.errors.actionId.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            )
          )}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="price">Price</label>
        <input type="number" name="price" min="0.01" step="0.01" defaultValue="0.01" required />

        <div aria-live="polite" aria-atomic="true">
          {state?.errors?.price &&
            state.errors.price.map((error: string) => (
              <p className="mt-2 text-sm text-red-500" key={error}>
                {error}
              </p>
            )
          )}
        </div>
      </div>

      <div className="form-field">
        <label htmlFor="count">Count</label>
        <input type="number" name="count" min="10" step="1" defaultValue="1000" required />

        <div aria-live="polite" aria-atomic="true">
          {state?.errors?.count &&
            state.errors.count.map((error: string) => (
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

      <SubmitButton text="Create" />
    </form>
  )
}
'use client'

import { useRef, useState } from "react";
import { useFormState } from "react-dom";
import { useUser } from "@/hooks/useUser";
import { CreateTaskFormSubmit } from "@/db/actions";
import { CreateTaskFormState, Action, Service } from "@/lib/definitions";
import { Form } from "@nextui-org/form";
import { Select, SelectItem } from "@nextui-org/select";
import { Avatar } from "@nextui-org/avatar";
import { Input } from "@nextui-org/input";
import SubmitButton from "@/components/Forms/SubmitButton";

// TODO: format + validation
export default function CreateTaskForm({ actions, services }: { actions: Action[], services: Service[] }) {
  const { balance } = useUser();
  const [link, setLink] = useState('');
  const [price, setPrice] = useState('0.1');
  const [count, setCount] = useState('1000');
  const sum = Number(price) * Number(count);
  const submitText = `Create ($${sum})`;
  const initialState: CreateTaskFormState = { errors: {}, message: null };
  const [state, formAction] = useFormState(CreateTaskFormSubmit, initialState);

  return (
    <Form action={formAction} className="create-task-form" validationErrors={state.errors}>
      <Select
        name="serviceId"
        items={services}
        label="Service"
        variant="bordered"
        onChange={() => setLink('')}
        classNames={{
          label: "group-data-[filled=true]:-translate-y-5",
          trigger: "min-h-16",
        }}
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <Avatar
                alt={item.data?.name}
                className="flex-shrink-0"
                size="sm"
                src="https://flagcdn.com/ar.svg"
              />
              <div className="flex flex-col">
                <span>{item.data?.name}</span>
              </div>
            </div>
          ));
        }}
      >
        {(service) => (
          <SelectItem
            key={service.id}
            startContent={
              <Avatar alt="Argentina" className="w-6 h-6" src="https://flagcdn.com/ar.svg" />
            }
          >
            {service.name}
          </SelectItem>
        )}
      </Select>

      <Input name="link" label="Link" variant="bordered" value={link} onValueChange={setLink} isClearable />


      <Select name="actionId" items={actions} label="Action" variant="bordered">
        {actions.map((action) => (
          <SelectItem key={action.id}>{action.name}</SelectItem>
        ))}
      </Select>

      <Input
        name="price"
        label="Price"
        type="number"
        placeholder="0.00"
        value={price}
        onValueChange={setPrice}
        min={0.01}
        step={0.01}
        variant="bordered"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">$</span>
          </div>
        }
      />

      <Input
        name="count"
        label="Count"
        type="number"
        placeholder="0"
        value={count}
        defaultValue={count}
        onValueChange={setCount}
        min={10}
        step={1}
        variant="bordered"
      />

      <div id="fields-error" aria-live="polite" aria-atomic="true">
        {state?.message &&
          <p className="mt-2 text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        }
      </div>

      <SubmitButton text={submitText} disabled={sum > balance} />
    </Form>
  )
}
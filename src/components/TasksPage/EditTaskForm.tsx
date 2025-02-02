import { type SliderValue, Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { EditTaskFormState, Task } from "@/lib/definitions";
import { EditTaskFormSubmit } from "@/core/actions";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useUser } from "@/hooks/useUser";
import SubmitButton from "../Forms/SubmitButton";
import CoinValue from "../Common/CoinValue";
import CoinIcon from "../Common/CoinIcon";


export default function EditTaskForm({ task }: { task: Task }) { // TODO: check if count < done on price change
  const { balance } = useUser();

  const minCount = Math.max(task.done, 10);

  const [price, setPrice] = useState(task.price);
  const [count, setCount] = useState<SliderValue>(minCount);
  const [sum, setSum] = useState(0);
  
  const reserve = Number(balance) + task.price * task.count - task.price * task.done;
  const maxCount = price ? Math.floor(reserve / Number(price)) : 10;

  const initialState: EditTaskFormState = { errors: {}, message: null };
  const action = EditTaskFormSubmit.bind(null, task.id);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    setSum(price * Number(count));
  }, [price, count]);

  useEffect(() => {
    if (sum > reserve) {
      setCount(maxCount);
    }
  }, [sum]);
  
  return (
    <Form action={formAction} validationErrors={state?.errors} className="w-full mt-4">
      <div className="flex w-full justify-between text-small mb-2">
        <CoinValue value={task.price * task.count} textBefore="Sum:" />
        <CoinValue value={task.price * task.done} textBefore="Spent:" />
        <CoinValue value={sum} textBefore="New sum:" />
      </div>

      <div className="flex w-full">
        <Input
          name="price"
          label="Price"
          type="number"
          placeholder="0"
          value={`${price}`}
          onValueChange={(value) => setPrice(Number(value))}
          min={1}
          step={1}
          variant="bordered"
          className="w-3/4 mr-2"
          startContent={
            <div className="pointer-events-none flex items-center">
              <CoinIcon className="text-default-400 text-large" />
            </div>
          }
        />

        <Select 
          name="currency" 
          label="Currency" 
          variant="bordered" 
          className="w-1/4"
          disallowEmptySelection
          selectedKeys={['coin']}
          isDisabled
        >
          <SelectItem key='coin' startContent={<CoinIcon className="text-default-400" />}>
            COIN
          </SelectItem>
        </Select>
      </div>  

      <div className="w-full flex justify-between items-end px-1">
        <Slider
          label="Count"
          size="sm"
          classNames={{
            base: "w-3/4 mr-2",
            track: "border-s-primary-100",
            filler: "bg-gradient-to-r from-primary-100 to-primary-500",
          }}
          step={1}
          minValue={minCount}
          maxValue={maxCount}
          value={count}
          onChange={setCount}
          hideValue={true}
          renderThumb={(props) => (
            <div
              {...props}
              className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
            >
              <span className="transition-transform bg-gradient-to-br shadow-small from-primary-100 to-primary-500 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
            </div>
          )}
        />

        <Input
          name="count"
          type="number"
          variant="underlined"
          classNames={{ base: "w-1/4 mb-[10px]", input: "text-center" }}
          placeholder="0"
          step={1}
          min={minCount}
          max={maxCount}
          value={`${count}`}
          onValueChange={(value) => setCount(value as any as SliderValue)}
        />
      </div>

      <div id="fields-error" aria-live="polite" aria-atomic="true">
        {state?.message &&
          <p className="mt-2 text-sm text-red-500" key={state.message}>
            {state.message}
          </p>
        }
      </div>

      <SubmitButton content="Update" disabled={!sum || sum > reserve} size="md" variant="flat" className="mt-2" />
    </Form>
  )
}
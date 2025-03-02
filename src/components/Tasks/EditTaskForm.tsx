import { type SliderValue, Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { EditTaskFormState, Task } from "@/lib/definitions";
import { EditTaskFormSubmit } from "@/core/actions";
import { useState, useEffect } from "react";
import { useFormState } from "react-dom";
import { useUser } from "@/hooks/useUser";
import SubmitButton from "@/components/Common/SubmitButton";
import CoinValue from "@/components/Common/CoinValue";
import CoinIcon from "@/components/Common/CoinIcon";

// TODO: check if count < done on price change
export default function EditTaskForm({ task }: { task: Task }) {
  const { balance } = useUser();

  const doneSum = task.doneSum ?? 0;
  const doneCount = task.doneCount ?? 0;
  const minCount = Math.max(doneCount, 10);

  const [price, setPrice] = useState(task.price);
  const [count, setCount] = useState<SliderValue>(minCount);
  const [newSum, setNewSum] = useState(0);
  
  const sum = task.price * (task.count - doneCount) + doneSum;
  const reserve = Number(balance) + sum - doneSum;
  const maxCount = price ? Math.floor(reserve / Number(price) + doneCount) : 10;

  const initialState: EditTaskFormState = { errors: {}, message: null };
  const action = EditTaskFormSubmit.bind(null, task.id);
  const [state, formAction] = useFormState(action, initialState);

  useEffect(() => {
    setNewSum(price * (Number(count) - doneCount) + doneSum);
  }, [price, count]);

  useEffect(() => {
    if (newSum - doneSum > reserve) {
      setCount(maxCount);
    }
  }, [newSum]);
  
  return (
    <Form action={formAction} className="w-full mt-4">
      <div className="flex w-full justify-between text-small mb-2">
        <CoinValue value={sum} textBefore="Sum:" />
        <CoinValue value={doneSum} textBefore="Spent:" />
        <CoinValue value={newSum} textBefore="New sum:" />
      </div>

      <div className="flex w-full">
        <Input
          name="price"
          label="Price"
          type="number"
          placeholder="0"
          variant="bordered"
          className="mr-2 w-3/4 max-[400px]:w-2/3"
          min={1}
          step={1}
          value={`${price}`}
          onValueChange={(value) => {
            setPrice(Math.floor(Number(value)));
            if (state?.errors?.price?.length) {
              delete state?.errors?.price;
            }
          }}
          isInvalid={!!state?.errors?.price?.length}
          errorMessage={state?.errors?.price?.length ? state.errors.price[0] : ''}
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
          className="w-1/4 max-[400px]:w-1/3"
          disallowEmptySelection
          selectedKeys={['coin']}
          isDisabled
        >
          <SelectItem key='coin' startContent={<CoinIcon className="text-default-400" />}>
            COIN
          </SelectItem>
        </Select>
      </div>  

      <div className="w-full flex justify-between items-baseline px-1">
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
          classNames={{ base: "w-1/4 mb-[10px]", input: "text-center", errorMessage: "absolute" }}
          placeholder="0"
          step={1}
          min={minCount}
          max={maxCount}
          value={`${count}`}
          onValueChange={(value) => {
            setCount(Math.floor(Number(value)) as any as SliderValue);
            if (state?.errors?.count?.length) {
              delete state?.errors?.count;
            }
          }}
          isInvalid={!!state?.errors?.count?.length}
          errorMessage={state?.errors?.count?.length ? state.errors.count[0] : ''}
        />
      </div>

      <div id="fields-error" aria-live="polite" aria-atomic="true">
        {state?.message &&
          <p className="mt-2 text-sm text-danger" key={state.message}>
            {state.message}
          </p>
        }
      </div>

      <SubmitButton disabled={!newSum || newSum - doneSum > reserve} size="md" variant="flat" className="mt-2">
        Update
      </SubmitButton>
    </Form>
  )
}
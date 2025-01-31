'use client'

import { type SliderValue, Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Avatar } from "@heroui/avatar";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { useFormState } from "react-dom";
import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { CreateTaskFormSubmit } from "@/core/actions";
import { CreateTaskFormState, Action, Service } from "@/lib/definitions";
import SubmitButton from "@/components/Forms/SubmitButton";
import CoinIcon from "../Common/CoinIcon";


// TODO: format + validation (numbers float, link)
// TODO: extended settings (schedule, timeout...)
// TODO: errors view (currency and count)
export default function CreateTaskForm({ services }: { services: Service[] }) {
  const { balance } = useUser();

  const [actionId, setActionId] = useState('1');
  const [serviceId, setServiceId] = useState('1');
  const [service, setService] = useState(services[0]);
  const [link, setLink] = useState('');
  const [price, setPrice] = useState(1); // TODO: forbid more than 2 decimals on input or remove decimals
  const [count, setCount] = useState<SliderValue>(10);
  const [sum, setSum] = useState(0);
  
  const maxCount = price ? Math.floor(balance / Number(price)) : 10;
  const submitContent = <div className="flex items-center">Create (<CoinIcon className="inline" />{sum})</div>;

  const initialState: CreateTaskFormState = { errors: {}, message: null };
  const [state, formAction] = useFormState(CreateTaskFormSubmit, initialState);

  useEffect(() => {
    const selectedService = services.find((service) => `${service.id}` === serviceId) as Service;
    setService(selectedService);
    const selectedActionId = selectedService.actions ? selectedService?.actions[0]?.id as any as string : '0';
    setActionId(selectedActionId); // TODO: action select options list on epmty
  }, [serviceId]);

  useEffect(() => {
    setLink('');
  }, [serviceId, actionId]);

  useEffect(() => {
    setSum(price * Number(count));
  }, [price, count]);

  useEffect(() => {
    if (sum > balance) {
      setCount(maxCount);
    }
  }, [sum]);

  return (
    <Form action={formAction} validationErrors={state?.errors}>
      <Select
        name="serviceId"
        label="Service"
        variant="bordered"
        classNames={{
          label: "group-data-[filled=true]:-translate-y-5",
          trigger: "min-h-16",
        }}
        items={services}
        selectedKeys={[serviceId]}
        onChange={(e) => setServiceId(e.target.value)}
        disallowEmptySelection
        renderValue={(items) => {
          return items.map((item) => (
            <div key={item.key} className="flex items-center gap-2">
              <Avatar
                alt={item.data?.title}
                className="flex-shrink-0"
                size="sm"
                src={item.data?.icon}
              />
              <div className="flex flex-col">
                <span>{item.data?.title}</span>
              </div>
            </div>
          ));
        }}
      >
        {(service) => (
          <SelectItem
            key={service.id}
            startContent={
              <Avatar alt={service.title} className="w-6 h-6" src={service.icon} />
            }
          >
            {service.title}
          </SelectItem>
        )}
      </Select>

      <Select 
        name="actionId" 
        label="Action" 
        variant="bordered"
        items={service.actions}
        selectedKeys={[actionId]}
        onChange={(e) => setActionId(e.target.value)}
        disallowEmptySelection
      >
        {service.actions 
          ? service.actions.map((action) => (<SelectItem key={action.id}>{action.title}</SelectItem>))
          : <SelectItem key={0}>No items</SelectItem>
        }
      </Select>

      <Input 
        name="link" 
        label="Link" 
        variant="bordered" 
        placeholder=""
        value={link} 
        onValueChange={setLink}
        isClearable 
      />

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

      <div className="w-full flex justify-between items-end px-2">
        <Slider
          label="Count"
          size="sm"
          classNames={{
            base: "w-3/4 mr-2",
            track: "border-s-primary-100",
            filler: "bg-gradient-to-r from-primary-100 to-primary-500",
          }}
          step={1}
          minValue={10}
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
          min={10}
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

      <SubmitButton content={submitContent} disabled={!sum || sum > balance} className="mt-4" />
    </Form>
  )
}
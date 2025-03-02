'use client'

import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure } from "@heroui/modal";
import { type SliderValue, Slider } from "@heroui/slider";
import { Select, SelectItem } from "@heroui/select";
import { Button } from "@heroui/button";
import { Avatar } from "@heroui/avatar";
import { Alert } from "@heroui/alert";
import { Input } from "@heroui/input";
import { Form } from "@heroui/form";
import { CreateTaskFormState, Service } from "@/lib/definitions";
import { CreateTaskFormSubmit } from "@/core/actions";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";
import { useUser } from "@/hooks/useUser";
import TgSubscribeActionMessage from "@/components/Messages/TgSubscribeActionMessage";
import TgBoostActionMessage from "@/components/Messages/TgBoostActionMessage";
import SubmitButton from "@/components/Common/SubmitButton";
import CoinIcon from "@/components/Common/CoinIcon";

// TODO: format + validation (numbers float, link) +-
// TODO: link placeholders map
// TODO: extended settings (schedule, timeout...)
export default function CreateTaskForm({ services }: { services: Service[] }) {
  const { balance } = useUser();
  const {isOpen, onOpen, onOpenChange} = useDisclosure();
  
  const [serviceActionId, setServiceActionId] = useState('0');
  const [serviceId, setServiceId] = useState('3');
  const [service, setService] = useState(services[0]);
  const [link, setLink] = useState('');
  const [price, setPrice] = useState(1);
  const [count, setCount] = useState<SliderValue>(10);
  const [sum, setSum] = useState(0);
  const [alert, setAlert] = useState<React.JSX.Element|null>(null);
  
  const maxCount = price ? Math.floor(balance / Number(price)) : 10;

  const initialState: CreateTaskFormState = { errors: {}, message: null };
  const [state, formAction] = useFormState(CreateTaskFormSubmit, initialState);

  useEffect(() => {
    const selectedService = services.find((service) => `${service.id}` === serviceId) as Service;
    setService(selectedService);
    const selectedServiceActionId = selectedService.serviceActions ? selectedService.serviceActions[0].id as any as string : '0';
    setServiceActionId(selectedServiceActionId);
  }, [serviceId]);

  useEffect(() => {
    switch (serviceActionId) { // TODO: refactor - check by name
      case '16':
        setAlert(<TgSubscribeActionMessage />); break;
      case '17':
        setAlert(<TgBoostActionMessage />); break;
      default:
        setAlert(null); break;
    }
  }, [serviceActionId]);

  useEffect(() => {
    setLink('');
  }, [serviceId, serviceActionId]);

  useEffect(() => {
    setSum(price * Number(count));
  }, [price, count]);

  useEffect(() => {
    if (sum > balance) {
      setCount(maxCount);
    }
  }, [sum]);

  // TODO?: move modal to separate component
  return (
    <Form action={formAction}>
      {!!alert && 
        <Alert 
          color="primary"
          className="px-3 gap-0"
          title={
            <>
              <p>This task requires additional steps for verification.</p>
              <Button 
                color="primary" 
                variant="light"
                className="h-auto min-w-fit p-0 data-[hover=true]:bg-tranparent"
                onPress={onOpen}
                disableRipple
                disableAnimation
              >
                Learn More
              </Button>
            </>
          } 
        /> 
      }

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
        name="serviceActionId" 
        label="Action" 
        variant="bordered"
        items={service.serviceActions}
        onChange={(e) => {
          setServiceActionId(e.target.value);
          if (state?.errors?.serviceActionId?.length) {
            delete state?.errors?.serviceActionId;
          }
        }}
        isInvalid={!!state?.errors?.serviceActionId?.length}
        errorMessage={state?.errors?.serviceActionId?.length ? state.errors.serviceActionId[0] : ''}
        disallowEmptySelection
      >
        {(serviceAction) => (
          <SelectItem key={serviceAction.id}>{serviceAction.title ?? serviceAction.action?.title}</SelectItem>
        )}
      </Select>

      <Input 
        name="link" 
        label="Link" 
        variant="bordered" 
        // placeholder="https://example.com or @example"
        value={link} 
        onValueChange={(value) => {
          setLink(value);
          if (state?.errors?.link?.length) {
            delete state?.errors?.link;
          }
        }}
        isInvalid={!!state?.errors?.link?.length}
        errorMessage={state?.errors?.link?.length ? state.errors.link[0] : ''}
        isClearable
      />

      <div className="flex w-full">
        <Input
          name="price"
          label="Price"
          type="number"
          placeholder="0"
          variant="bordered"
          className="w-3/4 mr-2 max-[374px]:w-2/3"
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
          className="w-1/4 max-[374px]:w-1/3"
          selectedKeys={['coin']}
          isDisabled
          disallowEmptySelection
        >
          <SelectItem key='coin' startContent={<CoinIcon className="text-default-400" />}>
            COIN
          </SelectItem>
        </Select>
      </div>

      <div className="w-full flex justify-between items-baseline px-2">
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
          classNames={{ base: "w-1/4 mb-[10px]", input: "text-center", errorMessage: "absolute" }}
          placeholder="0"
          step={1}
          min={10}
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

      <SubmitButton disabled={!sum || sum > balance} className="mt-4">
        <div className="flex items-center">Create (<CoinIcon className="inline" />{sum})</div>
      </SubmitButton>


      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Alert</ModalHeader>
              <ModalBody>
                {alert}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </Form>
  )
}
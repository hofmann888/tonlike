// 'use client'

// import { type SliderValue, Slider } from "@heroui/slider";
// import { Select, SelectItem } from "@heroui/select";
// import { Avatar } from "@heroui/avatar";
// import { Input } from "@heroui/input";
// import { Form } from "@heroui/form";
// import { useFormState } from "react-dom";
// import { useEffect, useState } from "react";
// import { useUser } from "@/hooks/useUser";
// import { IconType } from "react-icons";
// import { PiCoinVertical } from "react-icons/pi";
// import { BsCurrencyDollar } from "react-icons/bs";
// import { CreateTaskFormSubmit } from "@/db/actions";
// import { CreateTaskFormState, Action, Service, Currency, CurrencyEnum, CurrencyMapItem } from "@/lib/definitions";
// import SubmitButton from "@/components/Forms/SubmitButton";

// const currencyMap: CurrencyMapItem[] = [
//   { key: CurrencyEnum.COIN, title: "COIN", icon: PiCoinVertical },
//   { key: CurrencyEnum.USDT, title: "USDT", icon: BsCurrencyDollar },
// ];

// // TODO: format + validation (numbers float, link)
// // TODO: extended settings (schedule, timeout...)
// // TODO: errors view (currency and count)
// export default function CreateTaskForm({ actions, services }: { actions: Action[], services: Service[] }) {
//   const { balance, reward } = useUser();

//   const [serviceId, setServiceId] = useState('1');
//   const [actionId, setActionId] = useState('1');
//   const [link, setLink] = useState('');
//   const [currency, setCurrency] = useState(CurrencyEnum.COIN);
//   const [price, setPrice] = useState(1); // TODO: forbid more than 2 decimals on input
//   const [count, setCount] = useState<SliderValue>(10);
//   const [reserve, setReserve] = useState(reward);
//   const [priceStep, setPriceStep] = useState(1);
//   const [sum, setSum] = useState(0);
  
//   const currencyMapItem = currencyMap.find((currencyMapItem) => currencyMapItem.key === currency);
//   const CurrencyIcon = currencyMapItem?.icon as IconType;
//   const maxCount = price ? Math.floor(reserve / Number(price)) : 10;
//   const submitContent = <div className="flex items-center">Create (<CurrencyIcon className="inline" />{sum})</div>;

//   const initialState: CreateTaskFormState = { errors: {}, message: null };
//   const [state, formAction] = useFormState(CreateTaskFormSubmit, initialState);

//   const service = services.find((service) => `${service.id}` === serviceId);
//   const actionsFiltered = actions.filter((action: Action) => service?.actionIds && service.actionIds.includes(action.id));
  
//   useEffect(() => {
//     service?.actionIds && setActionId(`${service?.actionIds[0]}`);
//   }, [serviceId]);

//   useEffect(() => {
//     setLink('');
//   }, [serviceId, actionId]);

//   useEffect(() => {
//     setSum(Number((price * Number(count)).toFixed(2)));
//   }, [price, count]);

//   useEffect(() => {
//     if (sum > reserve) {
//       setCount(maxCount);
//     }
//   }, [sum]);

//   function currencyChange(value: Currency) {
//     setCurrency(value);
//     setCount(10);

//     switch (value) {
//       case CurrencyEnum.COIN:
//         setReserve(reward); 
//         setPriceStep(1);
//         break;
//       case CurrencyEnum.USDT:
//         setReserve(balance);
//         setPriceStep(0.01);
//         break;
//     }
//   }

//   return (
//     <Form action={formAction} className="create-task-form" validationErrors={state?.errors}>
//       <Select
//         name="serviceId"
//         label="Service"
//         variant="bordered"
//         classNames={{
//           label: "group-data-[filled=true]:-translate-y-5",
//           trigger: "min-h-16",
//         }}
//         items={services}
//         selectedKeys={[serviceId]}
//         onChange={(e) => setServiceId(e.target.value)}
//         disallowEmptySelection
//         renderValue={(items) => {
//           return items.map((item) => (
//             <div key={item.key} className="flex items-center gap-2">
//               <Avatar
//                 alt={item.data?.name}
//                 className="flex-shrink-0"
//                 size="sm"
//                 src={item.data?.img}
//               />
//               <div className="flex flex-col">
//                 <span>{item.data?.name}</span>
//               </div>
//             </div>
//           ));
//         }}
//       >
//         {(service) => (
//           <SelectItem
//             key={service.id}
//             startContent={
//               <Avatar alt={service.name} className="w-6 h-6" src={service.img} />
//             }
//           >
//             {service.name}
//           </SelectItem>
//         )}
//       </Select>

//       <Select 
//         name="actionId" 
//         label="Action" 
//         variant="bordered"
//         items={actionsFiltered}
//         selectedKeys={[actionId]}
//         onChange={(e) => setActionId(e.target.value)}
//         disallowEmptySelection
//       >
//         {actionsFiltered.map((action) => (
//           <SelectItem key={action.id}>{action.name}</SelectItem>
//         ))}
//       </Select>

//       <Input 
//         name="link" 
//         label="Link" 
//         variant="bordered" 
//         placeholder=""
//         value={link} 
//         onValueChange={setLink}
//         isClearable 
//       />

//       <div className="flex w-full">
//         <Input
//           name="price"
//           label="Price"
//           type="number"
//           placeholder="0"
//           value={`${price}`}
//           onValueChange={(value) => setPrice(Number(value))}
//           min={priceStep}
//           step={priceStep}
//           variant="bordered"
//           className="w-3/4 mr-2"
//           startContent={
//             <div className="pointer-events-none flex items-center">
//               <CurrencyIcon className="text-default-400 text-large" />
//             </div>
//           }
//         />

//         <Select 
//           name="currency" 
//           label="Currency" 
//           variant="bordered" 
//           className="w-1/4"
//           disallowEmptySelection
//           items={currencyMap}
//           selectedKeys={[currency]}
//           onChange={(e) => currencyChange(e.target.value as Currency)}
//         >
//           {currencyMap.map((currency) => {
//             const CurrencyIcon = currency.icon;
//             return (
//               <SelectItem key={currency.key} startContent={<CurrencyIcon className="text-default-400" />}>
//                 {currency.title}
//               </SelectItem>
//             )
//           })}
//         </Select>
//       </div>

//       <div className="w-full flex justify-between items-end px-2">
//         <Slider
//           label="Count"
//           size="sm"
//           classNames={{
//             base: "w-3/4 mr-2",
//             track: "border-s-primary-100",
//             filler: "bg-gradient-to-r from-primary-100 to-primary-500",
//           }}
//           step={1}
//           minValue={10}
//           maxValue={maxCount}
//           value={count}
//           onChange={setCount}
//           hideValue={true}
//           renderThumb={(props) => (
//             <div
//               {...props}
//               className="group p-1 top-1/2 bg-background border-small border-default-200 dark:border-default-400/50 shadow-medium rounded-full cursor-grab data-[dragging=true]:cursor-grabbing"
//             >
//               <span className="transition-transform bg-gradient-to-br shadow-small from-primary-100 to-primary-500 rounded-full w-5 h-5 block group-data-[dragging=true]:scale-80" />
//             </div>
//           )}
//         />

//         <Input
//           name="count"
//           type="number"
//           variant="underlined"
//           classNames={{ base: "w-1/4 mb-[10px]", input: "text-center" }}
//           placeholder="0"
//           step={1}
//           min={10}
//           max={maxCount}
//           value={`${count}`}
//           onValueChange={(value) => setCount(value as any as SliderValue)}
//         />
//       </div>

//       <div id="fields-error" aria-live="polite" aria-atomic="true">
//         {state?.message &&
//           <p className="mt-2 text-sm text-red-500" key={state.message}>
//             {state.message}
//           </p>
//         }
//       </div>

//       <SubmitButton content={submitContent} disabled={!sum || sum > reserve} className="mt-4" />
//     </Form>
//   )
// }
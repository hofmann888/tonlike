// import { Form } from "@heroui/form";
// import { Input } from "@heroui/input";
// import { WithdrawFormState } from "@/lib/definitions";
// import { WithdrawFormSubmit } from "@/core/actions";
// import { useTonConnect } from "@/hooks/useTonConnect";
// import { useFormState } from 'react-dom';
// import SubmitButton from "@/components/Forms/SubmitButton";

// export default function WithdrawForm() {
//   const min = 1;
//   const { address } = useTonConnect();
//   const initialState: WithdrawFormState = { errors: {}, message: null };
//   const [state, formAction] = useFormState(WithdrawFormSubmit, initialState);
  
//   return (
//     <Form action={formAction} className="withdraw-form" validationErrors={state?.errors}>
//       <Input
//         name="amount"
//         label="Amount"
//         type="number"
//         placeholder="0.00"
//         min={min}
//         step={0.1}
//         variant="bordered"
//         startContent={
//           <div className="pointer-events-none flex items-center">
//             <span className="text-default-400 text-small">$</span>
//           </div>
//         }
//       />

//       <Input name="address" label="Address" variant="bordered" defaultValue={address ?? ''} isClearable />

//       <div id="fields-error" aria-live="polite" aria-atomic="true">
//         {state?.message &&
//           <p className="mt-2 text-sm text-red-500" key={state.message}>
//             {state.message}
//           </p>
//         }
//       </div>

//       <SubmitButton content="Withdraw" />
//     </Form>
//   )
// }
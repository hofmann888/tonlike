import { useTonConnect } from "@/app/hooks/useTonConnect";
import { UserContext } from "../providers/user-provider";
import { useContext } from "react";

export default function WithdrawForm() {
  const defaultAmount = 0.8;
  const { address } = useTonConnect();
  const { user, updateUser } = useContext(UserContext);
  
  function test1() {
    updateUser({balance: user.balance + 1});
  }
  
  return (
    <form action="#" className="withdraw-form">
      <div className="form-field">
        <label htmlFor="withdrawAmount">Amount</label>
        <input type="number" name="withdrawAmount" step="0.1" defaultValue={defaultAmount} />
      </div>

      <div className="form-field">
        <label htmlFor="address">Address</label>
        <input type="text" name="address" defaultValue={address ?? ''} />
      </div>

      <button type="button" className="submit-btn" onClick={test1}>Withdraw</button>
    </form>
  )
}
import { UserContext } from "../providers/user-provider";
import { useContext } from "react";

export default function WithdrawForm() {
  const defaultAmount = 0.8;
  const { balance, address, updateUser } = useContext(UserContext);
  
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

      <button type="button" className="submit-btn">Withdraw</button>
    </form>
  )
}
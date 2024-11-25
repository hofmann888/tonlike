import clsx from "clsx";


// TODO: delete?
export default function WalletTabs({activeTab, onClick} : {activeTab: number, onClick: (tab: number) => void}) {
  const depositTab = 1;
  const withdrawTab = 2;
  
  return (
    <div className="wallet-tabs">
      <button 
        type="button" 
        className={clsx('wallet-tabs-btn left', {'active': activeTab == depositTab})} 
        onClick={() => onClick(depositTab)}
      >
        Deposit
      </button>

      <button 
        type="button" 
        className={clsx('wallet-tabs-btn right', {'active': activeTab == withdrawTab})} 
        onClick={() => onClick(withdrawTab)}
      >
        Withdraw
      </button>
    </div>
  )
}
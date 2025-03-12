import { getEnvBoolean } from "@/utils/helpers";
import { useEffect, useRef } from "react";
import CoinValue from "@/components/Common/CoinValue";
import "@/css/adsgram.scss";

interface TaskProps {
  blockId?: string;
}

export default function EarnAdQuestCard({ blockId }: TaskProps) {
  const taskRef = useRef<JSX.IntrinsicElements['adsgram-task']>(null);
  const debug = getEnvBoolean(process.env.NEXT_PUBLIC_ADSGRAM_DEBUG);
  blockId = blockId ?? process.env.NEXT_PUBLIC_ADSGRAM_TASK_BLOCK_ID;

  useEffect(() => {
    const rewardHandler = (event: CustomEvent) => {
      console.log('reward event:', event);
    };
    const onBannerNotFoundHandler = (event: CustomEvent) => {
      console.log('onBannerNotFound event:', event);
    };

    const task = taskRef.current;
    if (task) {
      task.addEventListener('reward', rewardHandler);
      task.addEventListener('onBannerNotFound', onBannerNotFoundHandler);
    }

    return () => {
      if (task) {
        task.removeEventListener('reward', rewardHandler);
        task.removeEventListener('onBannerNotFound', onBannerNotFoundHandler);
      }
    };
  }, []);

  if (!customElements.get('adsgram-task')) {
    return null;
  }

  return (
    <adsgram-task
      ref={taskRef}
      data-debug={debug}
      data-block-id={blockId}
      className="adsgram-task px-3 py-[14px] flex flex-col relative overflow-hidden h-auto text-foreground box-border outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 shadow-small rounded-large backdrop-blur-md backdrop-saturate-150 transition-transform-background motion-reduce:transition-none border-none bg-background/60 dark:bg-default-100/50 mb-2"
    >
      <span slot="reward">
        <div className="flex items-center text-small text-primary-500 mt-2 leading-[0]">
          + <CoinValue value={100} />
        </div>
      </span>
      <div 
        onClick={() => console.log('ad click')}
        slot="button" 
        className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 border-medium px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-transparent border-primary text-primary data-[hover=true]:opacity-hover btn-border-shadow w-20">
        Start
      </div>
      <div slot="done" className="z-0 group relative inline-flex items-center justify-center box-border appearance-none select-none whitespace-nowrap font-normal subpixel-antialiased overflow-hidden tap-highlight-transparent data-[pressed=true]:scale-[0.97] outline-none data-[focus-visible=true]:z-10 data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-focus data-[focus-visible=true]:outline-offset-2 px-4 min-w-20 h-10 text-small gap-2 rounded-medium [&>svg]:max-w-[theme(spacing.8)] transition-transform-colors-opacity motion-reduce:transition-none bg-primary text-primary-foreground data-[hover=true]:opacity-hover btn-border-shadow w-20">
        Check
      </div>
    </adsgram-task>
  );
};
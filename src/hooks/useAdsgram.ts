import type { AdController, ShowPromiseResult } from '@/lib/adsgram';
import { useCallback, useEffect, useRef } from 'react';
import { getEnvBoolean } from '@/utils/helpers';

export interface useAdsgramParams {
  blockId?: string;
  onReward?: () => void;
  onError?: (result: ShowPromiseResult) => void;
}

export function useAdsgram({ blockId, onReward, onError }: useAdsgramParams): () => Promise<void> {
  const AdControllerRef = useRef<AdController | undefined>(undefined);
  const debug = getEnvBoolean(process.env.NEXT_PUBLIC_ADSGRAM_DEBUG);
  blockId = blockId ?? process.env.NEXT_PUBLIC_ADSGRAM_REWARD_BLOCK_ID!; 

  useEffect(() => {
    AdControllerRef.current = window.Adsgram?.init({ blockId, debug: debug, debugBannerType: 'FullscreenMedia' });
  }, [blockId]);

  return useCallback(async () => {
    if (AdControllerRef.current) {
      AdControllerRef.current
        .show()
        .then(() => {
          onReward?.(); // user watch ad till the end or close it in interstitial format
        })
        .catch((result: ShowPromiseResult) => {
          onError?.(result); // user get error during playing ad
        });
    } else {
      onError?.({
        error: true,
        done: false,
        state: 'load',
        description: 'Adsgram script not loaded',
      });
    }
  }, [onError, onReward]);
}
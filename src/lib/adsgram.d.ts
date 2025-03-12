import { DOMAttributes } from "react";

type CustomElement<T> = Partial<T & DOMAttributes<T> & { children: any }> &
  LibraryManagedAttributes;

declare global {
  namespace JSX {
    interface IntrinsicElements extends JSXInternal {
      "adsgram-task": CustomElement<HTMLDivElement>;
    }
  }
}

export interface ShowPromiseResult {
  done: boolean;
  description: string;
  state: 'load' | 'render' | 'playing' | 'destroy';
  error: boolean;
}

type BannerType = 'RewardedVideo' | 'FullscreenMedia';

interface AdsgramInitParams {
  blockId: string;
  debug?: boolean;
  debugBannerType?: BannerType;
}

type EventType =
  | 'onReward'
  | 'onComplete'
  | 'onStart'
  | 'onSkip'
  | 'onBannerNotFound'
  | 'onNonStopShow'
  | 'onError';
type HandlerType = () => void;

export interface AdController {
  show(): Promise<ShowPromiseResult>;
  addEventListener(event: EventType, handler: HandlerType): void;
  removeEventListener(event: EventType, handler: HandlerType): void;
  destroy(): void;
}

declare global {
    interface Window {
      Adsgram?: {
        init(params: AdsgramInitParams): AdController;
      };
    }
}
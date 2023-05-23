export type Routine = {
  name: string;
  description: string;
  enabled: boolean;
  repeatable: boolean;
  schedule: string;
  actions: {
    id: string;
    type: "toggle" | "openLock" | "fan" | "screen" | "buzzer";
    state: Record<string, boolean | string>;
  }[];
};

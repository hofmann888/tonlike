import { Action, Service, Task, TaskDTO } from "@/lib/definitions";

export function formatUserTaskDTO(dto: TaskDTO) {
  return {
    id: dto?.id,
    link: dto?.link,
    price: dto?.price,
    // currency: dto?.currency,
    count: dto?.count,
    done: dto?.done,
    status: dto?.status,
    created_at: dto?.created_at, // TODO: not timestamp? - 2024-12-24T03:00:32.276Z,
    updated_at: dto?.updated_at,
    deleted_at: dto?.deleted_at,
    user_id: dto?.user_id,
    action: {
      id: dto?.action_id,
      name: dto?.action_name,
    } as Action,
    service: {
      id: dto?.service_id,
      name: dto?.service_name,
      img: dto?.service_img,
    } as Service,
  } as Task;
}
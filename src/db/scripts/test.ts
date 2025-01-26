'use server'

import util from 'util';
import * as query from "../query";
import { 
  // fetchActions as fetchActionsSQL,
  // fetchServicesWithActionIds as fetchServicesWithActionIdsSQL, 
} from '../sql';
import { BlackListReasonEnum, TaskDTO, TaskStatusEnum, User } from '@/lib/definitions';
import { TaskInsertDTO } from '../dto';
import { User as tgUser } from '@telegram-apps/sdk-react';

async function test() {
  const startTime = performance.now();
  // ---------------------------

  // const task = {
  //   userId: 1,
  //   serviceActionId: 1,
  //   link: 'link1',
  //   price: 1,
  //   count: 111,
  //   done: 0,
  //   status: 'active',
  // } as TaskInsertDTO;

  // const tgUser = { 
  //   id: 88888881, 
  //   username: 'huilo', 
  //   photoUrl: 'dickpick.jpg', 
  // };

  // const userData = {
  //   balance: 8,
  //   tgId: 88888883,
  //   tgUsername: 'chmo',
  //   tgPhotoUrl: 'crybeatch.jpg',
  // }

  // const blackListItem = { 
  //   userId: 2, 
  //   blockedUserId: 3, 
  //   taskId: 22, 
  //   reasons: [BlackListReasonEnum.ACCOUNT] 
  // }

  const result = await query.fetchTaskPerformers(22);

  // ---------------------------
  const endTime = performance.now()

  console.log('time:', endTime - startTime)
  console.log('result:', util.inspect(result, false, null, true));
}

test();
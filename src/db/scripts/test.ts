'use server'

import { User as tgUser } from '@telegram-apps/sdk-react';
import { BlackListReasonEnum, TaskStatusEnum, User } from '@/lib/definitions';
import util from 'util';
import * as query from "../query";
import * as dto from '../dto';
// import { 
  // fetchActions as fetchActionsSQL,
  // fetchServicesWithActionIds as fetchServicesWithActionIdsSQL, 
// } from '../sql';

async function test() {
  const startTime = performance.now();
  // ============================

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

  // -----------------------
  // const result = await query.taskIsAvailableForUser(12, 2);

  // const userCanTask = query.userCanTask(12, 3);
  // const userDoneTask = query.userDoneTask(12, 3);
  // const userInBlackList = query.userInBlackList(1, 3);
  // const [can, done, black] = await Promise.all([userCanTask, userDoneTask, userInBlackList]);
  // console.log('result2:', `can: ${can}; done: ${done}; black: ${black}`)
  // -----------------------

  const result = await query.performerCanBeBlocked(1, 2, 25);

  // ============================
  const endTime = performance.now()

  console.log('time:', endTime - startTime)
  console.log('result:', util.inspect(result, false, null, true));
}

test();
'use client'

import { Accordion, AccordionItem } from "@nextui-org/accordion";
import { Select, SelectItem } from "@nextui-org/select";
import { Tabs, Tab } from "@nextui-org/tabs";
import { Avatar } from "@nextui-org/avatar";
import { Chip } from "@nextui-org/chip";
import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { FaPlay, FaPause, FaCheck, FaTrashAlt } from "react-icons/fa";
import { 
  Action, 
  Service, 
  TaskStatusMapItem, TaskStatusEnum, TaskStatusTitleEnum, 
  TaskSortMapItem, TaskSortEnum, TaskSortTitleEnum 
} from "@/lib/definitions";

// TODO: combine status map and status count? # error on pass icon through component props cause its a function
// TODO: remove enums and import object?
const statusMap: TaskStatusMapItem[] = [
  { key: TaskStatusEnum.ACTIVE, title: TaskStatusTitleEnum.ACTIVE, icon: FaPlay },
  { key: TaskStatusEnum.PAUSED, title: TaskStatusTitleEnum.PAUSED, icon: FaPause },
  { key: TaskStatusEnum.DONE, title: TaskStatusTitleEnum.DONE, icon: FaCheck },
  { key: TaskStatusEnum.DELETED, title: TaskStatusTitleEnum.DELETED, icon: FaTrashAlt },
]
const sortMap: TaskSortMapItem[] = [
  { key: TaskSortEnum.PRICE_ASC, title: TaskSortTitleEnum.PRICE_ASC },
  { key: TaskSortEnum.PRICE_DESC, title: TaskSortTitleEnum.PRICE_DESC },
  { key: TaskSortEnum.DATE_ASC, title: TaskSortTitleEnum.DATE_ASC },
  { key: TaskSortEnum.DATE_DESC, title: TaskSortTitleEnum.DATE_DESC },
]

export default function TasksFilter({
  actions, services, statusCount
}: {
  actions: Action[], services: Service[], statusCount?: any
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  
  const [actionsFilter, setActionsFilter] = useState(params.get('actions')?.split(','));
  const [servicesFilter, setServicesFilter] = useState(params.get('services')?.split(','));
  const [statusFilter, setStatusFilter] = useState(params.get('status'));
  const [sortFilter, setSortFilter] = useState(params.get('sort'));

  const [pressSubText, setPressSubText] = useState('expand');

  const filterOnPress = () => {
    pressSubText === 'expand' ? setPressSubText('collapse') : setPressSubText('expand');
  }

  const tabOnChange = (key: string) => {
    setStatusFilter(key);
    setServicesFilter([]);
    setActionsFilter([]);
  }

  useEffect(() => {
    let params = '?';
    if (actionsFilter?.length) {
      params += `actions=${actionsFilter}&`;
    }
    if (servicesFilter?.length) {
      params += `services=${servicesFilter}&`; 
    } 
    if (statusFilter?.length) {
      params += `status=${statusFilter}&`; 
    }
    if (sortFilter?.length) {
      params += `sort=${sortFilter}&`;
    } 
    params = params.slice(0, -1); 
    
    router.push(`${pathname}${params}`);
  }, [actionsFilter, servicesFilter, statusFilter, sortFilter])

  return (  // TODO: move status tabs to separate component?
    <div className="flex flex-wrap gap-2 mb-4">
      {statusCount && <Tabs
        aria-label="Status"
        selectedKey={statusFilter}
        color="primary"
        variant="underlined"
        classNames={{
          base: "w-full sticky tasks-tabs z-50",
          tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-[#22d3ee]",
          tab: "max-w-full px-0 h-12",
          tabContent: "group-data-[selected=true]:text-[#06b6d4]",
        }}
        onSelectionChange={(key) => tabOnChange(key as string)}
      >
        {statusMap.map((status) => {
          const StatusIcon = status.icon;
          return (            
            <Tab
              key={status.key}
              title={
                <div className="flex items-center space-x-2">
                  <StatusIcon />
                  <span>{status.title}</span>
                  <Chip size="sm" variant="faded">{statusCount[status.key]}</Chip>
                </div>
              }
            />
          )
        })}
      </Tabs>}

      <Accordion>
        <AccordionItem 
          key="1" 
          aria-label="Filter"
          onPress={filterOnPress}
          title={
          <div className="flex justify-between items-center">
            <div>
              <p>Filter</p>
              <p className="text-small text-foreground-400">Press to {pressSubText}</p>
            </div>

            <Select 
              name="sort" 
              label="Sort By" 
              size="sm"
              variant="bordered" 
              className="w-44"
              items={sortMap}
              onChange={(e) => setSortFilter(e.target?.value)}
            >
              {sortMap.map((sort) => (
                <SelectItem key={sort.key}>{sort.title}</SelectItem>
              ))}
            </Select>
          </div>
        }>
          <div className="flex flex-wrap gap-2">
            <Select
              name="services"
              label="Services"
              variant="bordered"
              selectionMode="multiple"
              classNames={{
                label: "group-data-[filled=true]:-translate-y-5",
                trigger: "min-h-16",
              }}
              items={services}
              selectedKeys={servicesFilter}
              onChange={(e) => setServicesFilter(e.target?.value.split(','))}
              renderValue={(items) => {
                return (
                  <div className="flex items-center gap-2">
                    {items.map((item) => (
                      <div key={item.key} className="flex items-center gap-2">
                        <Avatar
                          alt={item.data?.name}
                          className="flex-shrink-0"
                          size="sm"
                          src={item.data?.img}
                        />
                        <div className="flex flex-col">
                          <span>{item.data?.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              }}
            >
              {(service) => (
                <SelectItem
                  key={service.id}
                  startContent={
                    <Avatar alt={service.name} className="w-6 h-6" src={service.img} />
                  }
                >
                  {service.name}
                </SelectItem>
              )}
            </Select>

            <Select 
              name="actions" 
              label="Actions" 
              variant="bordered"
              selectionMode="multiple"
              items={actions} 
              selectedKeys={actionsFilter}
              onChange={(e) => setActionsFilter(e.target?.value.split(','))}
            >
              {actions.map((action) => (
                <SelectItem key={action.id}>{action.name}</SelectItem>
              ))}
            </Select>
          </div>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
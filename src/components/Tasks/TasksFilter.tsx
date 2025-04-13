'use client'

import { Accordion, AccordionItem } from "@heroui/accordion";
import { Select, SelectItem } from "@heroui/select";
import { Tabs, Tab } from "@heroui/tabs";
import { Avatar } from "@heroui/avatar";
import { Chip } from "@heroui/chip";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { FaPlay, FaPause, FaCheck, FaTrashAlt } from "react-icons/fa";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Action, Service, TaskStatusMapItem, TaskStatusEnum, TaskSortMapItem, TaskSortEnum } from "@/lib/definitions";

export default function TasksFilter({
  actions, services, statusCount
}: {
  actions: Action[], services: Service[], statusCount?: any
}) {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const t = useTranslations('components.TasksFilter');
  const tEnums = useTranslations('enums'); // TODO: refactor
  
  const [actionsFilter, setActionsFilter] = useState(params.get('actions')?.split(','));
  const [servicesFilter, setServicesFilter] = useState(params.get('services')?.split(','));
  const [statusFilter, setStatusFilter] = useState(params.get('status'));
  const [sortFilter, setSortFilter] = useState(params.get('sort'));
  const [pressText, setPressText] = useState('expand');
  const page = params.get('page');

  // TODO: combine status map and status count? # error on pass icon through component props cause its a function
  // TODO: remove enums and import object?
  const statusMap: TaskStatusMapItem[] = [
    { key: TaskStatusEnum.ACTIVE, title: t('status.active'), icon: FaPlay },
    { key: TaskStatusEnum.PAUSED, title: t('status.paused'), icon: FaPause },
    { key: TaskStatusEnum.DONE, title: t('status.done'), icon: FaCheck },
    { key: TaskStatusEnum.DELETED, title: t('status.deleted'), icon: FaTrashAlt },
  ];

  const sortMap: TaskSortMapItem[] = [
    { key: TaskSortEnum.PRICE_ASC, title: `${t('sort.price')}: ${t('sort.asc')}`  },
    { key: TaskSortEnum.PRICE_DESC, title: `${t('sort.price')}: ${t('sort.desc')}` },
    { key: TaskSortEnum.DATE_ASC, title: `${t('sort.date')}: ${t('sort.asc')}` },
    { key: TaskSortEnum.DATE_DESC, title: `${t('sort.date')}: ${t('sort.desc')}` },
  ];

  const filterOnPress = () => {
    pressText === 'expand' ? setPressText('collapse') : setPressText('expand');
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
    if (page?.length) {
      params += `page=${page}&`;
    }
    params = params.slice(0, -1); 
    
    router.push(`${pathname}${params}`);
  }, [actionsFilter, servicesFilter, statusFilter, sortFilter])

  return (  // TODO: move status tabs to separate component?
    <div className="flex flex-col gap-2 mb-4">
      {statusCount && 
      <Tabs
        aria-label="Status"
        selectedKey={statusFilter}
        color="primary"
        variant="underlined"
        classNames={{
          base: "w-full",
          cursor: "w-full",
          tabList: "gap-2 w-full relative rounded-none p-0 border-b border-divider max-w-[500px] max-w-[100vw] max-[499px]:max-w-[100vw]",
          tab: "max-w-full px-0 h-12",
          tabContent: "px-2"
          // cursor: "w-full bg-[#22d3ee]",
          // tabContent: "group-data-[selected=true]:text-[#06b6d4]",
          // tabContent: "group-data-[selected=true]:text-foreground-900"
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

      <div className="w-full relative">
        <Select 
          name="sort" 
          label={t('sort.label')} 
          size="sm"
          variant="bordered" 
          className="w-44 absolute top-[15px] right-[35px] max-[350px]:w-[150px]"
          items={sortMap}
          onChange={(e) => setSortFilter(e.target?.value)}
        >
          {sortMap.map((sort) => (
            <SelectItem key={sort.key}>{sort.title}</SelectItem>
          ))}
        </Select>

        <Accordion>
          <AccordionItem 
            key="1" 
            aria-label="Filter"
            onPress={filterOnPress}
            title={
            <div className="flex justify-between items-center pl-3">
              <div>
                <p>{t('filter')}</p>
                <p className="text-small text-foreground-400">{t(pressText)}</p>
              </div>
            </div>
          }>
            <div className="flex flex-wrap gap-2">
              <Select
                name="services"
                label={t('services')}
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
                            alt={item.data?.title}
                            className="flex-shrink-0"
                            size="sm"
                            src={item.data?.icon}
                          />
                          <div className="flex flex-col">
                            <span>{tEnums(`services.${item.data!.title}`)}</span>
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
                      <Avatar alt={service.title} className="w-6 h-6" src={service.icon} />
                    }
                  >
                    {tEnums(`services.${service.title}`)}
                  </SelectItem>
                )}
              </Select>

              <Select 
                name="actions" 
                label={t('actions')} 
                variant="bordered"
                selectionMode="multiple"
                items={actions} 
                selectedKeys={actionsFilter}
                onChange={(e) => setActionsFilter(e.target?.value.split(','))}
              >
                {actions.map((action) => (
                  <SelectItem key={action.id}>{tEnums(`actions.${action.title}`)}</SelectItem>
                ))}
              </Select>
            </div>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  )
}
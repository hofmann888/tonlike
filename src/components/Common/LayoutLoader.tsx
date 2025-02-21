'use client';

import { useRouter } from 'next/navigation';
import { useUser } from "@/hooks/useUser";
import { Button } from "@heroui/button";
import { useEffect } from "react";

export default function LayoutLoader({ children }: { children: React.ReactNode }) {
  const { id } = useUser();
  const router = useRouter();

  useEffect(() => {
    id && router.refresh();
  }, [id]);

  return id 
    ? children 
    : 
      <div className="flex items-center justify-center h-[100vh]">
        <Button variant="light" color="primary" size="lg" isLoading isDisabled isIconOnly />
      </div>
}
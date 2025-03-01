import { Button } from "@heroui/button";

export default function LayoutLoader() {
  return (
    <div className="flex items-center justify-center h-[100vh]">
      <Button variant="light" color="primary" size="lg" isLoading isDisabled isIconOnly />
    </div>
  )
}
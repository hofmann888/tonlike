import { Button } from "@heroui/button";

export default function PageLoader() {
  return (
    <div className="flex items-center justify-center w-full h-full">
      <Button variant="light" color="primary" size="lg" isLoading isDisabled isIconOnly />
    </div> 
  )
}
import {
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/siws-app/components/ui/card";
import { Button } from "@/siws-app/components/ui/button";

export default function PricingView() {
  return (
    <div className="!visible transition-opacity duration-150 !opacity-100 min-h-screen">
      <div className="flex gap-6 sm:gap-4 justify-center flex-col md:flex-row lg:gap-8 h-full pt-24">
        <Card className="max-w-sm">
          <CardHeader className="p-4">
            <h2 className="text-lg font-bold">Starter</h2>
            <p className="text-sm text-muted-foreground">For hobby projects</p>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-center flex-col">
            <div className="text-4xl font-bold">Free</div>
            <p className="text-sm text-center">
              Always free! Enjoy the best of both worlds without spending a
              dime.
            </p>
          </CardContent>
          <CardFooter className="p-4">
            <Button className="w-full" variant="outline">
              Select
            </Button>
          </CardFooter>
        </Card>
        <Card className="max-w-sm">
          <CardHeader className="p-4">
            <h2 className="text-lg font-bold">Pro</h2>
            <p className="text-sm text-muted-foreground">
              For scaling applications
            </p>
          </CardHeader>
          <CardContent className="p-4 flex items-center justify-center flex-col">
            <div className="text-4xl font-bold">Free</div>
            <p className="text-sm text-center">
              Always free! Enjoy the best of both worlds without spending a
              dime.
            </p>
          </CardContent>
          <CardFooter className="p-4">
            <Button className="w-full" variant="outline">
              Select
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

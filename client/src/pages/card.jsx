import MainLayout from "@/components/layouts/main-layout";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";

export default function CardPage() {
  return (
    <MainLayout>
      <div className="p-6 max-w-xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Card Example</CardTitle>
            <CardDescription>This is a sample card layout using components.</CardDescription>
          </CardHeader>
          <CardContent>
            <p>This content is inside the card. You can customize it as needed.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Students from "./components/students";
import Lessons from "./components/lessons";
import Dashboard from "./components/dashboard";

export default function AdminPage({
  searchParams,
}: {
  searchParams: { tab?: string };
}) {
  const defaultTab = searchParams.tab || "dashboard";

  return (
    <div className="container mx-auto p-6">
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger
            value="dashboard"
            className="cursor-pointer data-[state=active]:bg-background"
          >
            Dashboard
          </TabsTrigger>
          <TabsTrigger
            value="students"
            className="cursor-pointer data-[state=active]:bg-background"
          >
            Students
          </TabsTrigger>
          <TabsTrigger
            value="lessons"
            className="cursor-pointer data-[state=active]:bg-background"
          >
            Lessons
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="py-4 text-foreground">
          <h1 className="text-2xl text-center font-bold mb-6 text-foreground">
            Mock Dashboard
          </h1>
          <Dashboard />
        </TabsContent>

        <TabsContent value="students" className="py-4">
          <Students />
        </TabsContent>

        <TabsContent value="lessons" className="py-4">
          <Lessons />
        </TabsContent>
      </Tabs>
    </div>
  );
}

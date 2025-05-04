import { Routes } from "@/lib/constants/enums";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Home,
  LogIn,
  UserPlus,
  Shield,
  BookOpen,
  User,
  Settings,
  Database,
  Code,
  Layout,
} from "lucide-react";

export default function LearnMorePage() {
  const routeInfo = [
    {
      route: Routes.HOME,
      title: "Home",
      description: "The main landing page of our platform.",
      icon: <Home className="h-5 w-5" />,
    },
    {
      route: Routes.LOGIN,
      title: "Login",
      description: "Sign in to your existing account.",
      icon: <LogIn className="h-5 w-5" />,
    },
    {
      route: Routes.REGISTER,
      title: "Register",
      description: "Create a new account to access our platform.",
      icon: <UserPlus className="h-5 w-5" />,
    },
    {
      route: Routes.ADMIN,
      title: "Admin",
      description:
        "Administrative area for managing the platform (admin access only).",
      icon: <Shield className="h-5 w-5" />,
      restricted: true,
    },
    {
      route: Routes.LESSONS,
      title: "Lessons",
      description:
        "Browse and access all available learning content. (registered users only)",
      icon: <BookOpen className="h-5 w-5" />,
    },
    {
      route: Routes.PROFILE,
      title: "Profile",
      description:
        "View and manage your profile information. (registered users only)",
      icon: <User className="h-5 w-5" />,
    },
    {
      route: Routes.LEARN_MORE,
      title: "Learn More",
      description: "Learn more about our platform and available routes.",
      icon: <BookOpen className="h-5 w-5" />,
    },
  ];

  const technologies = {
    infrastructure: [
      { name: "Docker", description: "Containerization platform" },
      { name: "MySQL", description: "Relational database management system" },
    ],
    backend: [
      {
        name: "TypeScript",
        description: "Typed JavaScript programming language",
      },
      { name: "Nest.js", description: "Progressive Node.js framework" },
      { name: "JWT", description: "JSON Web Token for authentication" },
      { name: "Passport", description: "Authentication middleware" },
      { name: "Swagger", description: "API documentation tool" },
      { name: "Prisma", description: "Next-generation ORM" },
      { name: "bcrypt", description: "Password hashing library" },
      { name: "Zod", description: "TypeScript-first schema validation" },
    ],
    frontend: [
      {
        name: "TypeScript",
        description: "Typed JavaScript programming language",
      },
      { name: "Next.js", description: "React framework for production" },
      { name: "React Query", description: "Data fetching and caching library" },
      { name: "date-fns", description: "Date utility library" },
      { name: "Lucide", description: "Icon library" },
      { name: "Recharts", description: "Composable charting library" },
      { name: "Zustand", description: "State management solution" },
      { name: "shadcn/ui", description: "UI component library" },
    ],
  };

  return (
    <div className="space-y-12">
      <div className="space-y-8">
        <p className="text-lg text-center mb-8 max-w-2xl mx-auto text-foreground">
          Our platform offers various sections to enhance your learning
          experience. Here's an overview of all available areas.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {routeInfo.map((item) => (
            <Card
              key={item.route}
              className="overflow-hidden bg-card border-border"
            >
              <CardHeader className="flex flex-row items-center gap-3">
                <div className="bg-primary/10 p-2.5 rounded-full">
                  {item.icon}
                </div>
                <div>
                  <CardTitle className="text-foreground">
                    {item.title}
                  </CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {item.route}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <p className="mb-4 text-foreground">{item.description}</p>
                {item.restricted ? (
                  <Button variant="outline" disabled className="w-full">
                    Restricted Access
                  </Button>
                ) : (
                  <Button asChild variant="outline" className="w-full">
                    <Link href={item.route}>Visit {item.title}</Link>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-center text-foreground">
          Technology Stack
        </h2>
        <p className="text-lg text-center mb-8 max-w-2xl mx-auto text-foreground">
          Our platform is built using modern technologies that ensure security,
          performance, and scalability.
        </p>

        <div className="space-y-10">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Infrastructure
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {technologies.infrastructure.map((tech) => (
                <Card key={tech.name} className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground">
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">Backend</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {technologies.backend.map((tech) => (
                <Card key={tech.name} className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground">
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Layout className="h-6 w-6 text-primary" />
              <h3 className="text-xl font-semibold text-foreground">
                Frontend
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {technologies.frontend.map((tech) => (
                <Card key={tech.name} className="border-border">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-foreground">
                      {tech.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-foreground">{tech.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

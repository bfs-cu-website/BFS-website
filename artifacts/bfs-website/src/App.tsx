import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

import Home from "@/pages/home";
import About from "@/pages/about";
import Events from "@/pages/events";
import Team from "@/pages/team";
import Blog from "@/pages/blog";
import Resources from "@/pages/resources";
import Join from "@/pages/join";
import Admin from "@/pages/admin";

const queryClient = new QueryClient();

function PublicLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/events" component={Events} />
          <Route path="/team" component={Team} />
          <Route path="/blog" component={Blog} />
          <Route path="/resources" component={Resources} />
          <Route path="/join" component={Join} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/admin" component={Admin} />
      <Route component={PublicLayout} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

import { useState } from "react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCircle2, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const interestsOptions = [
  { id: "finance", label: "Finance & Investing" },
  { id: "entrepreneurship", label: "Entrepreneurship & Startups" },
  { id: "economics", label: "Economics & Policy" },
  { id: "markets", label: "Financial Markets" },
  { id: "research", label: "Research & Analysis" },
  { id: "content", label: "Content Creation & Graphics" }
];

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  department: z.string().min(2, "Please enter your department/course."),
  year: z.string({ required_error: "Please select your year of study." }),
  interests: z.array(z.string()).min(1, "Select at least one area of interest."),
  essay: z.string().min(50, "Please write at least 50 characters about why you want to join.")
});

export default function Join() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      department: "",
      interests: [],
      essay: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, this would be an API call
    console.log(values);
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="grid lg:grid-cols-5 gap-12 lg:gap-24">
          
          {/* Info Side */}
          <div className="lg:col-span-2 lg:pt-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-sm font-bold text-accent tracking-widest uppercase mb-3">Membership</h1>
              <h2 className="text-4xl md:text-5xl font-black text-primary mb-6 leading-tight">Take the Next Step.</h2>
              <p className="text-lg text-muted-foreground font-serif mb-10 leading-relaxed">
                Joining the Business & Finance Society isn't just about adding a line to your resume. It's about surrounding yourself with ambition.
              </p>

              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">1</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Submit Application</h3>
                    <p className="text-sm text-muted-foreground">Tell us about your interests and why you want to join our community.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">2</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Interview Process</h3>
                    <p className="text-sm text-muted-foreground">A brief interaction to understand your goals and how you can contribute.</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center shrink-0">
                    <span className="text-primary font-bold">3</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Onboarding</h3>
                    <p className="text-sm text-muted-foreground">Welcome to the society. Get integrated into your chosen departments.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="lg:col-span-3">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white p-8 md:p-12 rounded-2xl shadow-xl shadow-primary/5 border border-gray-100"
            >
              {isSubmitted ? (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-primary mb-4">Application Received</h3>
                  <p className="text-lg text-muted-foreground font-serif mb-8">
                    Thank you for your interest in joining the Business & Finance Society. We have received your application and will reach out to your email shortly regarding the next steps.
                  </p>
                  <Button onClick={() => setIsSubmitted(false)} variant="outline" className="font-bold">
                    Submit Another Application
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">Full Name</FormLabel>
                            <FormControl>
                              <Input placeholder="John Doe" className="bg-gray-50/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">University Email</FormLabel>
                            <FormControl>
                              <Input placeholder="john@cottonuniversity.ac.in" className="bg-gray-50/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">Course / Department</FormLabel>
                            <FormControl>
                              <Input placeholder="B.A. Economics" className="bg-gray-50/50" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="year"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-primary font-bold">Year of Study</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger className="bg-gray-50/50">
                                  <SelectValue placeholder="Select your year" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="1st">1st Year (UG)</SelectItem>
                                <SelectItem value="2nd">2nd Year (UG)</SelectItem>
                                <SelectItem value="3rd">3rd Year (UG)</SelectItem>
                                <SelectItem value="4th">4th Year (UG)</SelectItem>
                                <SelectItem value="pg1">1st Year (PG)</SelectItem>
                                <SelectItem value="pg2">2nd Year (PG)</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="interests"
                      render={() => (
                        <FormItem>
                          <div className="mb-4">
                            <FormLabel className="text-primary font-bold text-base">Areas of Interest</FormLabel>
                            <FormDescription>
                              Select the departments you are most interested in contributing to.
                            </FormDescription>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-4">
                            {interestsOptions.map((item) => (
                              <FormField
                                key={item.id}
                                control={form.control}
                                name="interests"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={item.id}
                                      className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(item.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value, item.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== item.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-medium cursor-pointer text-primary">
                                        {item.label}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))}
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="essay"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-primary font-bold text-base">Statement of Purpose</FormLabel>
                          <FormDescription>
                            Why do you want to join the Business & Finance Society? What do you hope to learn or contribute?
                          </FormDescription>
                          <FormControl>
                            <Textarea 
                              placeholder="I am interested in joining because..." 
                              className="min-h-[150px] bg-gray-50/50 resize-none" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full h-14 text-lg bg-accent hover:bg-accent/90 text-primary font-bold">
                      Submit Application <ChevronRight className="ml-2" />
                    </Button>
                  </form>
                </Form>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
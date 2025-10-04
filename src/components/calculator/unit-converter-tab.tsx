"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Loader2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { handleUnitConversion } from "@/app/actions";
import type { ConvertUnitsOutput } from "@/ai/flows/unit-conversion";

const formSchema = z.object({
  value: z.coerce.number().min(0, "Value must be positive"),
  fromUnit: z.string().min(1, "This field is required."),
  toUnit: z.string().min(1, "This field is required."),
});

type FormValues = z.infer<typeof formSchema>;

export default function UnitConverterTab() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ConvertUnitsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: 1,
      fromUnit: "USD",
      toUnit: "EUR",
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setResult(null);
    setError(null);
    const response = await handleUnitConversion(values);
    if (response.success) {
      setResult(response.data);
    } else {
      setError(response.error);
    }
    setIsLoading(false);
  }

  return (
    <div className="space-y-6 h-[480px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="value"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Amount</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="100" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="fromUnit"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>From</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., USD, meters, kg" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toUnit"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., EUR, feet, lbs" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Sparkles className="mr-2 h-4 w-4" />
            )}
            Convert with AI
          </Button>
        </form>
      </Form>

      {result && (
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Conversion Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-3xl font-bold text-primary">{result.convertedValue.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground">{result.explanation}</p>
          </CardContent>
        </Card>
      )}

      {error && (
        <Card className="bg-destructive/5 border-destructive/20 text-destructive">
          <CardHeader>
            <CardTitle className="text-lg">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

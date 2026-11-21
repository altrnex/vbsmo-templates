import { Form, Head } from "@inertiajs/react";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function Field({ name, label, type = "text", error }: { name: string; label: string; type?: string; error?: string }) {
  return (
    <div className="space-y-1">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} required />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}

export default function Page() {
  return (
    <Layout>
      <Head title="Log in" />
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
        </CardHeader>
        <CardContent>
          <Form action="/login" method="post" className="space-y-4">
            {({ errors, processing }) => (
              <>
              <Field name="email" label="Email" type="email" error={errors.email} />
              <Field name="password" label="Password" type="password" error={errors.password} />
              <Button type="submit" className="w-full" disabled={processing}>
                Log in
              </Button>
              </>
            )}
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}

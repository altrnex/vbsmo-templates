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
      <Head title="Register" />
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle>Register</CardTitle>
        </CardHeader>
        <CardContent>
          <Form action="/register" method="post" className="space-y-4">
            {({ errors, processing }) => (
              <>
              <Field name="name" label="Name" error={errors.name} />
              <Field name="email" label="Email" type="email" error={errors.email} />
              <Field name="password" label="Password" type="password" error={errors.password} />
              <Field name="password_confirmation" label="Confirm password" type="password" />
              <Button type="submit" className="w-full" disabled={processing}>
                Register
              </Button>
              </>
            )}
          </Form>
        </CardContent>
      </Card>
    </Layout>
  );
}

import { createInertiaApp } from "@inertiajs/react";
import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "@/components/ui/sonner";

const pages = import.meta.glob("./pages/**/*.tsx", { eager: true });

createInertiaApp({
  resolve: (name) => pages[`./pages/${name}.tsx`] as { default: () => ReactNode },
  setup({ el, App, props }) {
    createRoot(el).render(
      <>
        <App {...props} />
        <Toaster />
      </>,
    );
  },
});

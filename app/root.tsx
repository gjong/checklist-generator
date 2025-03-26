import {isRouteErrorResponse, Links, Meta, Outlet, Scripts, ScrollRestoration,} from "react-router";
import type {Route} from "./+types/root";
import {PrimeReactProvider} from "primereact/api";
import {useState} from "react";
import {TailwindTheme} from "~/tailwind-theme";
import {ConfirmDialog} from "primereact/confirmdialog";
import "./app.css";

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState<boolean | undefined>(undefined)

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body className={ darkMode ? 'dark' : darkMode === false ? 'light' : ''}>
        <PrimeReactProvider value={ { ripple: false,  unstyled: true, pt: TailwindTheme } }>
          <ConfirmDialog />
          <div id='theme-toggle' className="fixed top-0 right-0 z-50 p-2 cursor-pointer">
            <i className={ `pi ${ darkMode ? 'pi-moon-o' : 'pi-sun'} aspect-square h-6` } onClick={() => setDarkMode(!darkMode)} />
          </div>
          <main className="flex items-center justify-center pt-16 pb-4">
            <div className="max-w-[70rem] w-full space-y-6 px-4">
              <nav className="rounded-3xl border border-gray-200 p-6 dark:border-gray-700 space-y-4">
                {children}
              </nav>
            </div>
          </main>
          <ScrollRestoration />
          <Scripts />
        </PrimeReactProvider>
      </body>
    </html>
  );
}

export function HydrateFallback() {
  return <>
    <div className='flex justify-center items-center h-[calc(100vh-20%)]'>
      Loading... <i className='pi pi-spin pi-spinner animate-spin' />
    </div>
  </>;
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

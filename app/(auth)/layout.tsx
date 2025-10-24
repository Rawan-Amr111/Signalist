import Link from "next/link";
import Image from "next/image";
import { ClientOnly } from "@/components/ClientOnly";
import { redirect } from "next/navigation";
import { auth } from "@/lib/better-auth/auth";
import { headers } from "next/headers";
const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth.api.getSession({ headers: await headers() });
  if (session?.user) redirect("/");
  return (
    <ClientOnly>
      <main className="auth-layout">
        <section className="auth-left-section scrollbar-hide-default">
          <Link href="/" className="auth-logo">
            <Image
              src="/assets/icons/logo.svg"
              alt="logo"
              width={140}
              height={32}
              className="h-8 w-auto"
            />
          </Link>
          <div className="pb-6 lg:pb-6 flex-1">{children}</div>
        </section>
        <section className="auth-right-section">
          <div className="z-10 relative lg:mt-4 lg:mb-16">
            <blockquote className="auth-blockquote">
              signalist turned my watchlist into a winning list
            </blockquote>
            <div className="flex items-center justify-between">
              <div>
                <cite className="auth-testimonial-author">- John Doe</cite>
                <p className="max-md:text-xs text-gray-500"> Retail Investor</p>
              </div>
              <div className="flex items-center gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Image
                    key={star}
                    src="/assets/icons/star.svg"
                    alt="star"
                    width={20}
                    height={20}
                    className="h-4 w-4"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="flex-1 relative">
            <Image
              src="/assets/images/dashboard.png"
              alt="dashboard"
              width={1440}
              height={1150}
              className="auth-dashboard-preview absolute top-0"
            />
          </div>
        </section>
      </main>
    </ClientOnly>
  );
};

export default Layout;

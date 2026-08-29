import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { FEATURES } from '@/lib/features';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip static files and auth routes
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') || 
    pathname.includes('.') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/signup')
  ) {
    return NextResponse.next();
  }

  // Seller checks
  if (pathname.startsWith('/seller/orders') && !FEATURES.sellerOrders) return NextResponse.redirect(new URL('/seller/dashboard', request.url));
  if (pathname.startsWith('/seller/returns') && !FEATURES.sellerReturns) return NextResponse.redirect(new URL('/seller/dashboard', request.url));
  if (pathname.startsWith('/seller/payouts') && !FEATURES.sellerPayouts) return NextResponse.redirect(new URL('/seller/dashboard', request.url));
  if (pathname.startsWith('/seller/analytics') && !FEATURES.sellerAnalytics) return NextResponse.redirect(new URL('/seller/dashboard', request.url));

  // Ops checks
  if (pathname.startsWith('/ops/reconciliation') && !FEATURES.opsReconciliation) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/audit-logs') && !FEATURES.opsAuditLogs) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/tickets') && !FEATURES.opsTickets) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/disputes') && !FEATURES.opsDisputes) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/fulfillment') && !FEATURES.opsFulfillment) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/control-center') && !FEATURES.opsControlCenter) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/finance') && !FEATURES.opsFinanceLedger) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/incidents') && !FEATURES.opsIncidents) return NextResponse.redirect(new URL('/ops', request.url));
  if (pathname.startsWith('/ops/rma') && !FEATURES.opsRma) return NextResponse.redirect(new URL('/ops', request.url));

  // Organization checks
  if (pathname.startsWith('/organization') && !FEATURES.organizationDashboard) {
     return NextResponse.redirect(new URL('/account', request.url));
  }

  // Account checks
  if (pathname.startsWith('/account/orders') && !FEATURES.accountOrders) return NextResponse.redirect(new URL('/account', request.url));
  if (pathname.startsWith('/account/tickets') && !FEATURES.accountTickets) return NextResponse.redirect(new URL('/account', request.url));
  if (pathname.startsWith('/account/warranties') && !FEATURES.accountWarranties) return NextResponse.redirect(new URL('/account', request.url));
  if (pathname.startsWith('/account/rma') && !FEATURES.accountRma) return NextResponse.redirect(new URL('/account', request.url));

  // Storefront checks (redirecting to a "coming soon" page or just home)
  if (pathname.startsWith('/compatibility') && !FEATURES.storefrontCompatibilityEngine) return NextResponse.redirect(new URL('/coming-soon', request.url));
  if (pathname.startsWith('/compare') && !FEATURES.storefrontCompare) return NextResponse.redirect(new URL('/coming-soon', request.url));
  if (pathname.startsWith('/bom') && !FEATURES.storefrontBom) return NextResponse.redirect(new URL('/coming-soon', request.url));
  if (pathname.startsWith('/engineering') && !FEATURES.storefrontEngineering) return NextResponse.redirect(new URL('/coming-soon', request.url));
  if (pathname.startsWith('/support') && !FEATURES.storefrontSupport) return NextResponse.redirect(new URL('/coming-soon', request.url));

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

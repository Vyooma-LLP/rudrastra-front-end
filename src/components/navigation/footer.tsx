import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container px-4 md:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-4">Engineering</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#">Components</Link></li>
              <li><Link href="#">Compatibility Graph</Link></li>
              <li><Link href="#">Reference Designs</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Procurement</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#">B2B Accounts</Link></li>
              <li><Link href="#">Request for Quote</Link></li>
              <li><Link href="#">Net Terms</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Manufacturers</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#">Verification Process</Link></li>
              <li><Link href="#">Counterfeit Defense</Link></li>
              <li><Link href="#">Become a Seller</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-4">Rudrastra</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="#">About</Link></li>
              <li><Link href="#">Operations Status</Link></li>
              <li><Link href="#">Terms & Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 Rudrastra Technologies. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Strictly Monitored</span>
            <span>Auditable Integrity</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

const fs = require('fs');
const file = 'src/app/(storefront)/quote-request/page.tsx';
let code = fs.readFileSync(file, 'utf8');

code = code.replace(/  if \(isCartLoading\) {[\s\S]*?  }\n\n  if \(\!cartState\?\.items \|\| cartState\.items\.length === 0\) {[\s\S]*?  }\n\n  useEffect\(\(\) => {/m, `  useEffect(() => {`);

code = code.replace(/  const handleRequestQuote = async \(\) => {/, `  if (isCartLoading) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center font-sans">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#111111]"></div>
      </div>
    );
  }

  if (!cartState?.items || cartState.items.length === 0) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex flex-col items-center justify-center font-sans">
        <div className="bg-white border border-[#E5E5E5] p-8 max-w-md text-center space-y-4 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800">Your cart is empty</h2>
          <p className="text-xs text-gray-500">You must add components to your cart before requesting a quote.</p>
          <Link href="/products" className="inline-block px-4 py-2.5 bg-[#111111] hover:bg-black text-white text-xs font-bold uppercase tracking-wider">
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  const handleRequestQuote = async () => {`);

fs.writeFileSync(file, code);

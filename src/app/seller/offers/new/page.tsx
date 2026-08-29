import { db } from '@/db';
import { productVariants, products } from '@/db/schema';
import { eq } from 'drizzle-orm';
import NewSellerOfferForm from './NewSellerOfferForm';

export const dynamic = 'force-dynamic';

export default async function NewSellerOfferPage() {
  // Fetch all active variants along with their parent product titles
  const variants = await db.query.productVariants.findMany({
    with: {
      product: true
    },
    orderBy: (variants, { desc }) => [desc(variants.createdAt)]
  });

  const formattedVariants = variants.map(v => ({
    id: v.id,
    name: v.name,
    productTitle: v.product.title,
    mpn: v.product.mpn
  }));

  return <NewSellerOfferForm variants={formattedVariants} />;
}


